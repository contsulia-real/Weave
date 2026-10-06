import type { ReactNode } from 'react'
import type { TableSelectedCell, TableViewProps } from './table-types'

export interface DataGridRow {
  id: string
}

export type DataGridSortDirection = 'asc' | 'desc'

export interface DataGridSort {
  columnId: string
  direction: DataGridSortDirection
}

export type DataGridColumnWidths = Readonly<Record<string, number>>

export interface DataGridColumn<TRow extends DataGridRow = DataGridRow> {
  id: string
  header: ReactNode
  cell: (row: TRow) => ReactNode
  sort?: (left: TRow, right: TRow) => number
  minWidth?: number
  maxWidth?: number
  resizable?: boolean
}

interface DataGridBaseProps<TRow extends DataGridRow> {
  columns: readonly DataGridColumn<TRow>[]
  rows: readonly TRow[]
  dense?: boolean
  verticalBorders?: boolean
  stickyHeader?: boolean
  virtualized?: boolean
  sort?: DataGridSort | null
  defaultSort?: DataGridSort | null
  onSortChange?: (sort: DataGridSort | null) => void
  columnWidths?: DataGridColumnWidths
  defaultColumnWidths?: DataGridColumnWidths
  onColumnWidthsChange?: (columnWidths: DataGridColumnWidths) => void
  viewProps?: TableViewProps
}

interface DataGridStaticProps {
  selectable?: false
  selected?: never
  defaultSelected?: never
  onSelect?: never
}

interface DataGridSelectableProps {
  selectable: true
  selected?: readonly TableSelectedCell[]
  defaultSelected?: readonly TableSelectedCell[]
  onSelect?: (selected: readonly TableSelectedCell[]) => void
}

export type DataGridProps<TRow extends DataGridRow = DataGridRow> = DataGridBaseProps<TRow> &
  (DataGridStaticProps | DataGridSelectableProps)
