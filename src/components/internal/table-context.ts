import { createContext, useContext } from 'react'

export type TableSection = 'head' | 'body'

export interface TableSelectionState {
  checked: boolean
  indeterminate: boolean
}

export interface TableDeclaredCells {
  rowIds: readonly string[]
  cellIds: readonly string[]
  rowCount?: number
}

interface TableContextValue {
  selectable: boolean
  dense: boolean
  registerCell(rowId: string, cellId: string): () => void
  cellSelected(rowId: string, cellId: string): boolean
  rowSelection(rowId: string): TableSelectionState
  tableSelection(): TableSelectionState
  toggleCell(rowId: string, cellId: string): void
  toggleRow(rowId: string): void
  toggleTable(): void
}

interface TableRowContextValue {
  section: TableSection
  rowId?: string
}

export const TableDeclaredCellsContext = createContext<TableDeclaredCells | null>(null)
export const TableContext = createContext<TableContextValue | null>(null)
export const TableSectionContext = createContext<TableSection | null>(null)
export const TableRowContext = createContext<TableRowContextValue | null>(null)

export function useTableContext(): TableContextValue {
  const value = useContext(TableContext)
  if (value === null) throw new Error('Table components must be used inside Table')
  return value
}

export function useTableSection(): TableSection {
  const value = useContext(TableSectionContext)
  if (value === null) throw new Error('TableRow must be used inside TableHeader or TableBody')
  return value
}

export function useTableRow(): TableRowContextValue {
  const value = useContext(TableRowContext)
  if (value === null) throw new Error('TableHead/TableCell must be used inside TableRow')
  return value
}
