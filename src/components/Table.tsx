import { useContext, useLayoutEffect, useMemo, useRef } from 'react'
import type { TableProps } from '../core/table-types'
import { resolveTableTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { ensureTableStylesheet } from '../renderers/dom/table-stylesheet'
import { useTheme } from '../theme/theme-context'
import { AutoScrollbar } from './internal/AutoScrollbar'
import {
  TableBodyScrollContext,
  TableContext,
  TableDeclaredCellsContext,
} from './internal/table-context'
import { useTableSelection } from './internal/use-table-selection'
import { View } from './View'

export function Table(props: TableProps): import('react').JSX.Element {
  const {
    children,
    dense = false,
    verticalBorders = false,
    stickyHeader = false,
    viewProps = {},
  } = props
  const { theme } = useTheme()
  const themeDeclarations = useMemo(() => resolveTableTheme(theme), [theme])
  const themeClassName = useRuntimeStyleClass('table-theme', themeDeclarations)
  const selection = useTableSelection(props)
  const declaredCells = useContext(TableDeclaredCellsContext)

  useStaticStylesheet(ensureTableStylesheet)
  const tableRef = useRef<HTMLTableElement>(null)
  const bodyRef = useRef<HTMLTableSectionElement>(null)

  useLayoutEffect(() => {
    if (!stickyHeader) return
    const table = tableRef.current
    if (table === null) return
    const root = table.parentElement
    if (
      root?.hasAttribute('data-weave-data-grid') &&
      root.hasAttribute('data-weave-table-grid-ready')
    )
      return
    root?.removeAttribute('data-weave-table-grid-ready')
    const cells = Array.from(table.tHead?.rows[0]?.cells ?? [])
    if (cells.length === 0) return
    const widths = cells.map((cell) => cell.getBoundingClientRect().width)
    table.style.setProperty('--weave-table-column-count', String(cells.length))
    table.style.setProperty(
      '--weave-table-initial-track-template',
      widths
        .map((width, index) =>
          index === widths.length - 1 ? `minmax(${width}px, 1fr)` : `${width}px`,
        )
        .join(' '),
    )
    table.dataset.weaveTableGridReady = 'true'
    table.parentElement?.setAttribute('data-weave-table-grid-ready', 'true')
  }, [stickyHeader, children])

  const className = [
    'weave-table',
    dense ? 'weave-table--dense' : undefined,
    verticalBorders ? 'weave-table--vertical-borders' : undefined,
    stickyHeader ? 'weave-table--sticky-header' : undefined,
    selection.selectable ? 'weave-table--selectable' : undefined,
    themeClassName,
    viewProps.className,
  ]
    .filter(Boolean)
    .join(' ')

  const contextValue = useMemo(
    () => ({
      ...selection,
      dense,
    }),
    [dense, selection],
  )

  return (
    <TableContext.Provider value={contextValue}>
      <TableBodyScrollContext.Provider value={stickyHeader ? bodyRef : null}>
        <View
          {...viewProps}
          width={viewProps.width ?? 'fill'}
          overflowX="auto"
          overflowY={stickyHeader ? 'hidden' : viewProps.overflowY}
          className={className}
        >
          <table
            ref={tableRef}
            className="weave-table__table"
            aria-rowcount={
              viewProps.data?.['weave-data-grid-virtualized'] === 'true'
                ? declaredCells?.rowCount
                : undefined
            }
          >
            {children}
          </table>
        </View>
        {stickyHeader ? (
          <AutoScrollbar
            targetRef={bodyRef}
            config={viewProps.scrollbar}
            overflowIntent={{ styleOverflowY: 'auto', styleOverflowX: 'hidden' }}
          />
        ) : null}
      </TableBodyScrollContext.Provider>
    </TableContext.Provider>
  )
}
