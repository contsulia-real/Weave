import { useCallback, useMemo, useState } from 'react'
import type { ListProps } from '../../core/list-types'

interface SingleListSelectionState {
  selection: 'single'
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (selected: string | null) => void
}

interface MultipleListSelectionState {
  selection: 'multiple'
  selected?: readonly string[]
  defaultSelected?: readonly string[]
  onSelect?: (selected: readonly string[]) => void
}

const EMPTY_SELECTED_IDS: readonly string[] = []

export function useListSelection(props: ListProps, enabledIds: readonly string[]) {
  const selection = props.selection ?? 'none'
  const singleProps = selection === 'single' ? (props as SingleListSelectionState) : undefined
  const multipleProps = selection === 'multiple' ? (props as MultipleListSelectionState) : undefined

  const [uncontrolledSingle, setUncontrolledSingle] = useState<string | null>(
    singleProps?.defaultSelected ?? null,
  )
  const [uncontrolledMultiple, setUncontrolledMultiple] = useState<readonly string[]>(
    multipleProps?.defaultSelected ?? [],
  )

  const currentSingle =
    selection === 'single' ? (singleProps?.selected ?? uncontrolledSingle) : null
  const currentMultiple =
    selection === 'multiple'
      ? (multipleProps?.selected ?? uncontrolledMultiple)
      : EMPTY_SELECTED_IDS

  const selectedIds = useMemo(() => {
    if (selection === 'single') {
      return new Set(currentSingle === null ? [] : [currentSingle])
    }

    if (selection === 'multiple') {
      return new Set(currentMultiple)
    }

    return new Set<string>()
  }, [currentMultiple, currentSingle, selection])

  const selectItem = useCallback(
    (id: string) => {
      if (!enabledIds.includes(id)) return

      if (selection === 'single') {
        const selectionProps = props as SingleListSelectionState

        if (currentSingle === id) return

        if (selectionProps.selected === undefined) {
          setUncontrolledSingle(id)
        }

        selectionProps.onSelect?.(id)
        return
      }

      if (selection === 'multiple') {
        const selectionProps = props as MultipleListSelectionState
        const next = currentMultiple.includes(id)
          ? currentMultiple.filter((selectedId) => selectedId !== id)
          : [...currentMultiple, id]

        if (selectionProps.selected === undefined) {
          setUncontrolledMultiple(next)
        }

        selectionProps.onSelect?.(next)
      }
    },
    [currentMultiple, currentSingle, enabledIds, props, selection],
  )

  return {
    selection,
    selectedIds,
    selectItem,
  }
}
