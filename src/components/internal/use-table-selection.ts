import { useCallback, useContext, useMemo, useState } from 'react'
import type { TableProps, TableSelectedCell } from '../../core/table-types'
import { TableDeclaredCellsContext, type TableSelectionState } from './table-context'

function keyFor(rowId: string, cellId: string): string {
  return JSON.stringify([rowId, cellId])
}

function cellFor(key: string): TableSelectedCell {
  const [rowId, cellId] = JSON.parse(key) as [string, string]
  return { rowId, cellId }
}

function keysFor(cells: readonly TableSelectedCell[] | undefined): Set<string> {
  return new Set((cells ?? []).map(({ rowId, cellId }) => keyFor(rowId, cellId)))
}

function stateFor(keys: readonly string[], selected: ReadonlySet<string>): TableSelectionState {
  if (keys.length === 0) return { checked: false, indeterminate: false }

  let selectedCount = 0
  for (const key of keys) {
    if (selected.has(key)) selectedCount += 1
  }

  return {
    checked: selectedCount === keys.length,
    indeterminate: selectedCount > 0 && selectedCount < keys.length,
  }
}

export function useTableSelection(props: TableProps) {
  const declaredCells = useContext(TableDeclaredCellsContext)
  const selectable = props.selectable === true
  const controlledSelected = selectable ? props.selected : undefined
  const defaultSelected = selectable ? props.defaultSelected : undefined
  const onSelect = selectable ? props.onSelect : undefined
  const [uncontrolledSelected, setUncontrolledSelected] = useState<Set<string>>(() =>
    keysFor(defaultSelected),
  )
  const [registry, setRegistry] = useState<ReadonlyMap<string, ReadonlySet<string>>>(
    () => new Map(),
  )

  const declaredRowIds = useMemo(() => new Set(declaredCells?.rowIds ?? []), [declaredCells])

  const selectedKeys = useMemo(
    () => (controlledSelected === undefined ? uncontrolledSelected : keysFor(controlledSelected)),
    [controlledSelected, uncontrolledSelected],
  )

  const commit = useCallback(
    (next: Set<string>) => {
      if (!selectable) return

      if (controlledSelected === undefined) {
        setUncontrolledSelected(next)
      }

      onSelect?.([...next].map(cellFor))
    },
    [controlledSelected, onSelect, selectable],
  )

  const registerCell = useCallback((rowId: string, cellId: string) => {
    setRegistry((current) => {
      const row = new Set(current.get(rowId) ?? [])
      if (row.has(cellId)) return current

      row.add(cellId)
      const next = new Map(current)
      next.set(rowId, row)
      return next
    })

    return () => {
      setRegistry((current) => {
        const currentRow = current.get(rowId)
        if (currentRow === undefined || !currentRow.has(cellId)) return current

        const row = new Set(currentRow)
        row.delete(cellId)
        const next = new Map(current)
        if (row.size === 0) next.delete(rowId)
        else next.set(rowId, row)
        return next
      })
    }
  }, [])

  const rowKeys = useCallback(
    (rowId: string): string[] => {
      const cellIds = new Set(registry.get(rowId) ?? [])
      if (declaredRowIds.has(rowId)) {
        for (const cellId of declaredCells?.cellIds ?? []) {
          cellIds.add(cellId)
        }
      }

      return [...cellIds].map((cellId) => keyFor(rowId, cellId))
    },
    [declaredCells, declaredRowIds, registry],
  )

  const allKeys = useMemo(() => {
    const keys = new Set<string>()

    if (declaredCells !== null) {
      for (const rowId of declaredCells.rowIds) {
        for (const cellId of declaredCells.cellIds) {
          keys.add(keyFor(rowId, cellId))
        }
      }
    }

    for (const [rowId, cellIds] of registry) {
      for (const cellId of cellIds) {
        keys.add(keyFor(rowId, cellId))
      }
    }

    return [...keys]
  }, [declaredCells, registry])

  const cellSelected = useCallback(
    (rowId: string, cellId: string) => selectedKeys.has(keyFor(rowId, cellId)),
    [selectedKeys],
  )

  const rowSelection = useCallback(
    (rowId: string) => stateFor(rowKeys(rowId), selectedKeys),
    [rowKeys, selectedKeys],
  )

  const tableSelection = useCallback(() => stateFor(allKeys, selectedKeys), [allKeys, selectedKeys])

  const toggleCell = useCallback(
    (rowId: string, cellId: string) => {
      if (!selectable) return

      const key = keyFor(rowId, cellId)
      const next = new Set(selectedKeys)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      commit(next)
    },
    [commit, selectable, selectedKeys],
  )

  const toggleRow = useCallback(
    (rowId: string) => {
      if (!selectable) return

      const keys = rowKeys(rowId)
      const current = stateFor(keys, selectedKeys)
      const next = new Set(selectedKeys)

      for (const key of keys) {
        if (current.checked) next.delete(key)
        else next.add(key)
      }

      commit(next)
    },
    [commit, rowKeys, selectable, selectedKeys],
  )

  const toggleTable = useCallback(() => {
    if (!selectable) return

    const current = stateFor(allKeys, selectedKeys)
    const next = new Set(selectedKeys)

    for (const key of allKeys) {
      if (current.checked) next.delete(key)
      else next.add(key)
    }

    commit(next)
  }, [allKeys, commit, selectable, selectedKeys])

  return {
    selectable,
    registerCell,
    cellSelected,
    rowSelection,
    tableSelection,
    toggleCell,
    toggleRow,
    toggleTable,
  }
}
