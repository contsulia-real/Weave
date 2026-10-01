import type { CSSProperties, MouseEvent } from 'react'
import { useEffect } from 'react'
import type { TableCellProps } from '../core/table-types'
import { dimension } from '../core/values'
import { useTableContext, useTableRow } from './internal/table-context'
import { useViewHost } from './internal/use-view-host'

export function TableCell({
  id,
  children,
  align = 'start',
  width,
  minWidth,
  maxWidth,
  viewProps = {},
}: TableCellProps) {
  const table = useTableContext()
  const row = useTableRow()
  const { selectable, registerCell, cellSelected, toggleCell } = table

  if (row.section !== 'body') {
    throw new TypeError('TableCell must be used inside a TableBody row')
  }

  if (selectable && (row.rowId === undefined || id === undefined)) {
    throw new TypeError('Selectable Table cells require row and cell ids')
  }

  const rowId = row.rowId
  const selected =
    selectable && rowId !== undefined && id !== undefined ? cellSelected(rowId, id) : false

  useEffect(() => {
    if (!selectable || rowId === undefined || id === undefined) return
    return registerCell(rowId, id)
  }, [id, rowId, registerCell, selectable])

  const componentStyle: CSSProperties = {
    textAlign: align,
    width: dimension(width),
    minWidth: dimension(minWidth),
    maxWidth: dimension(maxWidth),
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    viewProps,
    componentStyle,
    'table-cell',
  )

  const handleClick = (event: MouseEvent<HTMLTableCellElement>) => {
    resolved.domProps.onClick?.(event)
    if (event.defaultPrevented || !selectable || rowId === undefined || id === undefined) {
      return
    }

    toggleCell(rowId, id)
  }

  return (
    <td
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-table-cell=""
      data-weave-table-cell-selected={selected ? 'true' : undefined}
      data-weave-layout={resolved.layout}
      className={['weave-table__cell', className].filter(Boolean).join(' ')}
      style={inlineStyle}
      onClick={handleClick}
    >
      {children}
    </td>
  )
}
