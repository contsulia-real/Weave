import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  DataGridColumn,
  DataGridColumnWidths,
  DataGridProps,
  DataGridRow,
  DataGridSort,
} from '../core/data-grid-types'
import type { TableViewProps } from '../core/table-types'
import { ensureDataGridStylesheet } from '../renderers/dom/data-grid-stylesheet'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { Icon } from './Icon'
import { assignRef } from './internal/assign-ref'
import { chevronDownIcon } from './internal/control-icons'
import { fromInteractiveDescendant } from './internal/interactive-descendant'
import { TableDeclaredCellsContext } from './internal/table-context'
import {
  createVirtualLayout,
  sameVirtualViewport,
  type VirtualMeasurement,
  type VirtualViewport,
  visibleVirtualIndices,
} from './internal/virtual-list-layout'
import { Row } from './Row'
import { Table } from './Table'
import { TableBody } from './TableBody'
import { TableCell } from './TableCell'
import { TableHead } from './TableHead'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
import { View } from './View'

interface ResizeDrag {
  pointerId: number
  columnId: string
  startX: number
  startWidth: number
  minWidth: number
  maxWidth: number
  widths: DataGridColumnWidths
}

type DataGridStyle = CSSProperties & {
  '--weave-data-grid-table-width'?: string
}

function clampWidth(value: number, minWidth = 0, maxWidth = Number.POSITIVE_INFINITY): number {
  return Math.min(maxWidth, Math.max(minWidth, value))
}

function resolvedColumnWidth<TRow extends DataGridRow>(
  column: DataGridColumn<TRow>,
  widths: DataGridColumnWidths,
): number | undefined {
  const width = widths[column.id]
  if (width === undefined || !Number.isFinite(width)) return undefined
  return clampWidth(width, column.minWidth, column.maxWidth)
}

function pixelWidth(value: number | undefined): string | undefined {
  return value === undefined ? undefined : `${value}px`
}

function assertUniqueDataGridIds<TRow extends DataGridRow>(
  columns: readonly DataGridColumn<TRow>[],
  rows: readonly TRow[],
): void {
  const columnIds = new Set<string>()
  for (const column of columns) {
    if (columnIds.has(column.id)) {
      throw new Error(`DataGrid column id "${column.id}" is duplicated`)
    }
    columnIds.add(column.id)
  }

  const rowIds = new Set<string>()
  for (const row of rows) {
    if (rowIds.has(row.id)) {
      throw new Error(`DataGrid row id "${row.id}" is duplicated`)
    }
    rowIds.add(row.id)
  }
}

function sortedDataGridRows<TRow extends DataGridRow>(
  rows: readonly TRow[],
  columns: readonly DataGridColumn<TRow>[],
  sort: DataGridSort | null,
): readonly TRow[] {
  if (sort === null) return rows

  const column = columns.find((candidate) => candidate.id === sort.columnId)
  if (column?.sort === undefined) return rows

  const direction = sort.direction === 'asc' ? 1 : -1
  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const compared = column.sort!(left.row, right.row) * direction
      return compared === 0 ? left.index - right.index : compared
    })
    .map(({ row }) => row)
}

function dataGridCells<TRow extends DataGridRow>(
  row: TRow,
  columns: readonly DataGridColumn<TRow>[],
  columnWidths: DataGridColumnWidths,
) {
  return columns.map((column) => {
    const width = pixelWidth(resolvedColumnWidth(column, columnWidths))
    return (
      <TableCell
        key={column.id}
        id={column.id}
        width={width}
        minWidth={pixelWidth(column.minWidth)}
        maxWidth={pixelWidth(column.maxWidth)}
      >
        {column.cell(row)}
      </TableCell>
    )
  })
}

function DataGridMeasuredRow<TRow extends DataGridRow>({
  row,
  columns,
  columnWidths,
  onMeasure,
}: {
  row: TRow
  columns: readonly DataGridColumn<TRow>[]
  columnWidths: DataGridColumnWidths
  onMeasure(id: string, measurement: VirtualMeasurement): void
}) {
  const rowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    const element = rowRef.current
    if (element === null) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const height = element.offsetHeight || rect.height
      if (height <= 0) return

      onMeasure(row.id, {
        main: height,
        cross: element.offsetWidth || rect.width,
      })
    }

    const view = element.ownerDocument.defaultView
    const frame = view?.requestAnimationFrame(measure)
    const ResizeObserverConstructor = view?.ResizeObserver
    const observer =
      ResizeObserverConstructor === undefined ? undefined : new ResizeObserverConstructor(measure)

    observer?.observe(element)

    return () => {
      if (frame !== undefined) view?.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [onMeasure, row.id])

  return (
    <TableRow id={row.id} viewProps={{ ref: rowRef }}>
      {dataGridCells(row, columns, columnWidths)}
      <td aria-hidden="true" className="weave-table__cell weave-data-grid__filler-cell" />
    </TableRow>
  )
}

function virtualViewport(root: HTMLDivElement, body: HTMLTableSectionElement): VirtualViewport {
  const rootRect = root.getBoundingClientRect()
  const bodyRect = body.getBoundingClientRect()
  const bodyTop = bodyRect.top - rootRect.top + root.scrollTop

  return {
    offset: Math.max(0, root.scrollTop - bodyTop),
    size: root.clientHeight,
    gap: 0,
  }
}

function DataGridVirtualBody<TRow extends DataGridRow>({
  rows,
  columns,
  columnWidths,
  rootRef,
  selectable,
}: {
  rows: readonly TRow[]
  columns: readonly DataGridColumn<TRow>[]
  columnWidths: DataGridColumnWidths
  rootRef: React.RefObject<HTMLDivElement | null>
  selectable: boolean
}) {
  const bodyRef = useRef<HTMLTableSectionElement>(null)
  const [measurements, setMeasurements] = useState<ReadonlyMap<string, VirtualMeasurement>>(
    () => new Map(),
  )
  const [viewport, setViewport] = useState<VirtualViewport>({
    offset: 0,
    size: 0,
    gap: 0,
  })

  const onMeasure = useCallback((id: string, measurement: VirtualMeasurement) => {
    setMeasurements((current) => {
      const previous = current.get(id)
      if (
        previous !== undefined &&
        Math.abs(previous.main - measurement.main) < 0.5 &&
        Math.abs(previous.cross - measurement.cross) < 0.5
      ) {
        return current
      }

      const next = new Map(current)
      next.set(id, measurement)
      return next
    })
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const body = bodyRef.current
    if (root === null || body === null) return

    const view = root.ownerDocument.defaultView
    let frame: number | undefined

    const read = () => {
      const next = virtualViewport(root, body)
      setViewport((current) => (sameVirtualViewport(current, next) ? current : next))
    }

    const scheduleRead = () => {
      if (view === null || typeof view.requestAnimationFrame !== 'function') {
        queueMicrotask(read)
        return
      }
      if (frame !== undefined) return
      frame = view.requestAnimationFrame(() => {
        frame = undefined
        read()
      })
    }

    scheduleRead()
    root.addEventListener('scroll', scheduleRead, { passive: true })

    const ResizeObserverConstructor = view?.ResizeObserver
    const observer =
      ResizeObserverConstructor === undefined
        ? undefined
        : new ResizeObserverConstructor(scheduleRead)
    observer?.observe(root)
    observer?.observe(body)

    return () => {
      root.removeEventListener('scroll', scheduleRead)
      if (frame !== undefined) view?.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [rootRef])

  const layout = useMemo(
    () => createVirtualLayout(rows, measurements, 'vertical', 0),
    [measurements, rows],
  )
  const visibleIndices = useMemo(
    () => visibleVirtualIndices(rows, null, layout, viewport),
    [layout, rows, viewport],
  )
  const firstIndex = visibleIndices[0]
  const lastIndex = visibleIndices.at(-1)
  const topSpacer = firstIndex === undefined ? 0 : (layout.offsets[firstIndex] ?? 0)
  const visibleEnd =
    lastIndex === undefined ? 0 : (layout.offsets[lastIndex] ?? 0) + (layout.sizes[lastIndex] ?? 0)
  const bottomSpacer = Math.max(0, layout.total - visibleEnd)
  const colSpan = columns.length + (selectable ? 1 : 0) + 1

  return (
    <TableBody viewProps={{ ref: bodyRef }}>
      {topSpacer <= 0 ? null : (
        <tr className="weave-data-grid__spacer-row" aria-hidden="true">
          <td
            className="weave-data-grid__spacer-cell"
            colSpan={colSpan}
            style={{ height: topSpacer }}
          />
        </tr>
      )}

      {visibleIndices.map((index) => {
        const row = rows[index]
        return row === undefined ? null : (
          <DataGridMeasuredRow
            key={row.id}
            row={row}
            columns={columns}
            columnWidths={columnWidths}
            onMeasure={onMeasure}
          />
        )
      })}

      {bottomSpacer <= 0 ? null : (
        <tr className="weave-data-grid__spacer-row" aria-hidden="true">
          <td
            className="weave-data-grid__spacer-cell"
            colSpan={colSpan}
            style={{ height: bottomSpacer }}
          />
        </tr>
      )}
    </TableBody>
  )
}

export function DataGrid<TRow extends DataGridRow = DataGridRow>(
  props: DataGridProps<TRow>,
): import('react').JSX.Element {
  const {
    columns,
    rows,
    dense = false,
    verticalBorders = false,
    stickyHeader = false,
    virtualized = false,
    sort,
    defaultSort = null,
    onSortChange,
    columnWidths,
    defaultColumnWidths = {},
    onColumnWidthsChange,
    viewProps = {},
  } = props
  const selectable = props.selectable === true

  assertUniqueDataGridIds(columns, rows)

  const [uncontrolledSort, setUncontrolledSort] = useState<DataGridSort | null>(defaultSort)
  const [uncontrolledColumnWidths, setUncontrolledColumnWidths] =
    useState<DataGridColumnWidths>(defaultColumnWidths)
  const resolvedSort = sort === undefined ? uncontrolledSort : sort
  const resolvedColumnWidths = columnWidths === undefined ? uncontrolledColumnWidths : columnWidths
  const [measuredColumnWidths, setMeasuredColumnWidths] = useState<DataGridColumnWidths>({})
  const [selectionColumnWidth, setSelectionColumnWidth] = useState<number | undefined>()
  const trackColumnWidths = useMemo(() => {
    const next: Record<string, number> = {}

    for (const column of columns) {
      const width =
        resolvedColumnWidth(column, resolvedColumnWidths) ??
        resolvedColumnWidth(column, measuredColumnWidths)
      if (width !== undefined) {
        next[column.id] = width
      }
    }

    return next
  }, [columns, measuredColumnWidths, resolvedColumnWidths])
  const effectiveSelectionColumnWidth = selectable ? selectionColumnWidth : undefined
  const tracksReady =
    columns.every((column) => trackColumnWidths[column.id] !== undefined) &&
    (!selectable || effectiveSelectionColumnWidth !== undefined)
  const tableWidth = tracksReady
    ? columns.reduce((total, column) => total + (trackColumnWidths[column.id] ?? 0), 0) +
      (effectiveSelectionColumnWidth ?? 0)
    : undefined
  const sortedRows = useMemo(
    () => sortedDataGridRows(rows, columns, resolvedSort),
    [columns, resolvedSort, rows],
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const resizeDragRef = useRef<ResizeDrag | null>(null)

  useStaticStylesheet(ensureDataGridStylesheet)

  /* oxlint-disable react/set-state-in-effect -- DOM column tracks must be measured before paint. */
  useLayoutEffect(() => {
    const root = rootRef.current
    if (root === null) return

    const headers = new Map(
      Array.from(
        root.querySelectorAll<HTMLTableCellElement>(
          '.weave-data-grid__head-cell[data-weave-data-grid-column-id]',
        ),
      ).map((header) => [header.dataset.weaveDataGridColumnId, header]),
    )
    const next: Record<string, number> = {}

    for (const column of columns) {
      if (resolvedColumnWidth(column, resolvedColumnWidths) !== undefined) continue

      const header = headers.get(column.id)
      if (header === undefined) continue

      const measured = header.getBoundingClientRect().width
      if (measured > 0) {
        next[column.id] = clampWidth(measured, column.minWidth, column.maxWidth)
      }
    }

    setMeasuredColumnWidths((current) => {
      let changed = false
      const merged = { ...current }

      for (const [id, width] of Object.entries(next)) {
        if (current[id] === width) continue
        merged[id] = width
        changed = true
      }

      return changed ? merged : current
    })

    if (!selectable) return

    const selectionHeader = root.querySelector<HTMLTableCellElement>(
      '.weave-table__head .weave-table__selection-cell',
    )
    const measuredSelectionWidth = selectionHeader?.getBoundingClientRect().width
    if (measuredSelectionWidth !== undefined && measuredSelectionWidth > 0) {
      setSelectionColumnWidth((current) =>
        current === measuredSelectionWidth ? current : measuredSelectionWidth,
      )
    }
  }, [columns, resolvedColumnWidths, selectable])
  /* oxlint-enable react/set-state-in-effect */

  const requestSort = useCallback(
    (column: DataGridColumn<TRow>) => {
      if (column.sort === undefined) return

      const next: DataGridSort =
        resolvedSort?.columnId === column.id
          ? {
              columnId: column.id,
              direction: resolvedSort.direction === 'asc' ? 'desc' : 'asc',
            }
          : {
              columnId: column.id,
              direction: 'asc',
            }

      if (sort === undefined) {
        setUncontrolledSort(next)
      }
      onSortChange?.(next)
    },
    [onSortChange, resolvedSort, sort],
  )

  const commitColumnWidths = useCallback(
    (next: DataGridColumnWidths) => {
      if (columnWidths === undefined) {
        setUncontrolledColumnWidths(next)
      }
      onColumnWidthsChange?.(next)
    },
    [columnWidths, onColumnWidthsChange],
  )

  const startResize = useCallback(
    (column: DataGridColumn<TRow>, event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || column.resizable !== true) return

      const header = event.currentTarget.closest('th')
      if (header === null) return

      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.setPointerCapture?.(event.pointerId)

      resizeDragRef.current = {
        pointerId: event.pointerId,
        columnId: column.id,
        startX: event.clientX,
        startWidth: trackColumnWidths[column.id] ?? header.getBoundingClientRect().width,
        minWidth: column.minWidth ?? 0,
        maxWidth: column.maxWidth ?? Number.POSITIVE_INFINITY,
        widths: trackColumnWidths,
      }
    },
    [trackColumnWidths],
  )

  const moveResize = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = resizeDragRef.current
      if (drag === null || drag.pointerId !== event.pointerId) return

      event.preventDefault()
      event.stopPropagation()

      const width = clampWidth(
        drag.startWidth + event.clientX - drag.startX,
        drag.minWidth,
        drag.maxWidth,
      )
      commitColumnWidths({
        ...drag.widths,
        [drag.columnId]: width,
      })
    },
    [commitColumnWidths],
  )

  const endResize = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = resizeDragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return

    event.stopPropagation()
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    resizeDragRef.current = null
  }, [])

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      assignRef(viewProps.ref, node)
    },
    [viewProps.ref],
  )

  const dataGridStyle: DataGridStyle = {
    ...viewProps.style,
    '--weave-data-grid-table-width': tableWidth === undefined ? undefined : `${tableWidth}px`,
  }
  const tableViewProps: TableViewProps = {
    ...viewProps,
    ref: setRootRef,
    style: dataGridStyle,
    className: ['weave-data-grid', viewProps.className].filter(Boolean).join(' '),
    data: {
      ...viewProps.data,
      'weave-data-grid': '',
      'weave-data-grid-virtualized': virtualized ? 'true' : undefined,
      'weave-data-grid-tracks': tracksReady ? 'fixed' : undefined,
    },
    overflowY: virtualized ? (viewProps.overflowY ?? 'auto') : viewProps.overflowY,
  }

  const declaredCells = useMemo(
    () => ({
      rowIds: rows.map(({ id }) => id),
      cellIds: columns.map(({ id }) => id),
    }),
    [columns, rows],
  )

  const tableSelectionProps = selectable
    ? {
        selectable: true as const,
        selected: props.selected,
        defaultSelected: props.defaultSelected,
        onSelect: props.onSelect,
      }
    : {
        selectable: false as const,
      }

  return (
    <TableDeclaredCellsContext.Provider value={declaredCells}>
      <Table
        {...tableSelectionProps}
        dense={dense}
        verticalBorders={verticalBorders}
        stickyHeader={stickyHeader}
        viewProps={tableViewProps}
      >
        {tracksReady ? (
          <colgroup>
            {selectable ? <col style={{ width: effectiveSelectionColumnWidth }} /> : null}
            {columns.map((column) => (
              <col key={column.id} style={{ width: trackColumnWidths[column.id] }} />
            ))}
            <col className="weave-data-grid__filler-column" />
          </colgroup>
        ) : null}

        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const activeSort = resolvedSort?.columnId === column.id
              const width = pixelWidth(trackColumnWidths[column.id])
              const sortable = column.sort !== undefined

              const activateSort = (
                event: MouseEvent<HTMLTableCellElement> | KeyboardEvent<HTMLTableCellElement>,
              ) => {
                if (fromInteractiveDescendant(event.target, event.currentTarget) || !sortable) {
                  return
                }
                requestSort(column)
              }

              return (
                <TableHead
                  key={column.id}
                  width={width}
                  minWidth={pixelWidth(column.minWidth)}
                  maxWidth={pixelWidth(column.maxWidth)}
                  viewProps={{
                    className: 'weave-data-grid__head-cell',
                    tabIndex: sortable ? 0 : undefined,
                    'aria-sort': activeSort
                      ? resolvedSort?.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : sortable
                        ? 'none'
                        : undefined,
                    data: {
                      'weave-data-grid-sortable': sortable ? 'true' : undefined,
                      'weave-data-grid-column-id': column.id,
                      'weave-data-grid-last-column':
                        column.id === columns.at(-1)?.id ? 'true' : undefined,
                    },
                    onClick: sortable ? activateSort : undefined,
                    onKeyDown: sortable
                      ? (event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return
                          event.preventDefault()
                          activateSort(event)
                        }
                      : undefined,
                  }}
                >
                  <Row gap={0.25} align="center">
                    {column.header}
                    {activeSort ? (
                      <Icon
                        svg={chevronDownIcon}
                        size="small"
                        viewProps={{
                          className: 'weave-data-grid__sort-icon',
                          'aria-hidden': true,
                          style: {
                            transform:
                              resolvedSort?.direction === 'asc' ? 'rotate(180deg)' : undefined,
                          },
                        }}
                      />
                    ) : null}
                  </Row>

                  {column.resizable !== true ? null : (
                    <View
                      className="weave-data-grid__resize-handle"
                      role="separator"
                      aria-orientation="vertical"
                      onPointerDown={(event) => startResize(column, event)}
                      onPointerMove={moveResize}
                      onPointerUp={endResize}
                      onPointerCancel={endResize}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    />
                  )}
                </TableHead>
              )
            })}
            <th
              aria-hidden="true"
              className="weave-table__head-cell weave-data-grid__filler-cell"
            />
          </TableRow>
        </TableHeader>

        {virtualized ? (
          <DataGridVirtualBody
            rows={sortedRows}
            columns={columns}
            columnWidths={trackColumnWidths}
            rootRef={rootRef}
            selectable={selectable}
          />
        ) : (
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.id} id={row.id}>
                {dataGridCells(row, columns, trackColumnWidths)}
                <td aria-hidden="true" className="weave-table__cell weave-data-grid__filler-cell" />
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableDeclaredCellsContext.Provider>
  )
}
