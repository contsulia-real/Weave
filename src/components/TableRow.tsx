import type { TableRowProps } from '../core/table-types'
import { Checkbox } from './Checkbox'
import { TableRowContext, useTableContext, useTableSection } from './internal/table-context'
import { useViewHost } from './internal/use-view-host'

export function TableRow(props: TableRowProps): import('react').JSX.Element {
  const { id, children, viewProps = {} } = props
  const table = useTableContext()
  const section = useTableSection()
  const { elementRef, className, inlineStyle, resolved } = useViewHost(viewProps)

  if (table.selectable && section === 'body' && id === undefined) {
    throw new TypeError('Selectable Table body rows require id')
  }

  const selection =
    section === 'head'
      ? table.tableSelection()
      : id === undefined
        ? { checked: false, indeterminate: false }
        : table.rowSelection(id)

  const checkbox =
    table.selectable && section === 'head' ? (
      <th className="weave-table__head-cell weave-table__selection-cell" scope="col">
        <Checkbox
          size="small"
          checked={selection.checked}
          indeterminate={selection.indeterminate}
          onChange={() => table.toggleTable()}
          viewProps={{ label: 'Select all rows' }}
        />
      </th>
    ) : table.selectable && id !== undefined ? (
      <td className="weave-table__cell weave-table__selection-cell">
        <Checkbox
          size="small"
          checked={selection.checked}
          indeterminate={selection.indeterminate}
          onChange={() => table.toggleRow(id)}
          viewProps={{ label: `Select row ${id}` }}
        />
      </td>
    ) : null

  return (
    <TableRowContext.Provider value={{ section, rowId: id }}>
      <tr
        {...resolved.domProps}
        ref={elementRef}
        data-weave-view=""
        data-weave-table-row=""
        data-weave-table-row-selected={selection.checked ? 'true' : undefined}
        data-weave-layout={resolved.layout}
        className={['weave-table__row', className].filter(Boolean).join(' ')}
        style={inlineStyle}
      >
        {checkbox}
        {children}
      </tr>
    </TableRowContext.Provider>
  )
}
