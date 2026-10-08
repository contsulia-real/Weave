import { DataGrid, type DataGridColumn } from '../../../index'

interface PersonRow {
  id: string
  name: string
  role: string
  score: number
}

const rows: readonly PersonRow[] = Array.from({ length: 200 }, (_, index) => ({
  id: `person-${index + 1}`,
  name: `Person ${index + 1}`,
  role: ['Design', 'Engineering', 'Research'][index % 3] ?? 'Design',
  score: 100 - (index % 73),
}))

const columns: readonly DataGridColumn<PersonRow>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: (row) => row.name,
    sort: (left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }),
    minWidth: 140,
    maxWidth: 320,
    resizable: true,
  },
  {
    id: 'role',
    header: 'Role',
    cell: (row) => row.role,
    sort: (left, right) => left.role.localeCompare(right.role),
    minWidth: 140,
    maxWidth: 280,
    resizable: true,
  },
  {
    id: 'score',
    header: 'Score',
    cell: (row) => row.score,
    sort: (left, right) => left.score - right.score,
    minWidth: 96,
    maxWidth: 180,
    resizable: true,
  },
]

export default function DataGridBasicUsageDemo() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      defaultSort={{ columnId: 'score', direction: 'desc' }}
      defaultColumnWidths={{ name: 180, role: 180, score: 120 }}
      selectable
      virtualized
      stickyHeader
      verticalBorders
      viewProps={{ maxHeight: 448 }}
    />
  )
}
