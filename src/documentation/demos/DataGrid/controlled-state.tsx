import { useState } from 'react'
import {
  DataGrid,
  type DataGridColumn,
  type DataGridColumnWidths,
  type DataGridSort,
  type TableSelectedCell,
} from '../../../index'

interface ProjectRow {
  id: string
  name: string
  owner: string
  score: number
}

const rows: readonly ProjectRow[] = [
  { id: 'atlas', name: 'Atlas', owner: 'Mina', score: 92 },
  { id: 'borealis', name: 'Borealis', owner: 'Noah', score: 84 },
  { id: 'cirrus', name: 'Cirrus', owner: 'Iris', score: 88 },
]

const columns: readonly DataGridColumn<ProjectRow>[] = [
  {
    id: 'name',
    header: 'Project',
    cell: (row) => row.name,
    sort: (left, right) => left.name.localeCompare(right.name),
    minWidth: 120,
    maxWidth: 240,
    resizable: true,
  },
  {
    id: 'owner',
    header: 'Owner',
    cell: (row) => row.owner,
    sort: (left, right) => left.owner.localeCompare(right.owner),
    minWidth: 120,
    maxWidth: 220,
    resizable: true,
  },
  {
    id: 'score',
    header: 'Score',
    cell: (row) => row.score,
    sort: (left, right) => left.score - right.score,
    minWidth: 88,
    maxWidth: 140,
    resizable: true,
  },
]

export default function DataGridControlledStateDemo() {
  const [sort, setSort] = useState<DataGridSort | null>({
    columnId: 'score',
    direction: 'desc',
  })
  const [columnWidths, setColumnWidths] = useState<DataGridColumnWidths>({
    name: 160,
    owner: 140,
    score: 96,
  })
  const [selected, setSelected] = useState<readonly TableSelectedCell[]>([
    { rowId: 'atlas', cellId: 'name' },
  ])

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      dense
      selectable
      sort={sort}
      onSortChange={setSort}
      columnWidths={columnWidths}
      onColumnWidthsChange={setColumnWidths}
      selected={selected}
      onSelect={setSelected}
    />
  )
}
