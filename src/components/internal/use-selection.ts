import { useCallback, useMemo, useState } from 'react'

interface NoSelectionProps {
  selection?: 'none'
  selected?: never
  defaultSelected?: never
  onSelect?: never
}

interface SingleSelectionProps {
  selection: 'single'
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (selected: string | null) => void
}

interface MultipleSelectionProps {
  selection: 'multiple'
  selected?: readonly string[]
  defaultSelected?: readonly string[]
  onSelect?: (selected: readonly string[]) => void
}

type SelectionProps = NoSelectionProps | SingleSelectionProps | MultipleSelectionProps

const EMPTY_SELECTED_IDS: readonly string[] = []

export function useSelection(props: SelectionProps, enabledIds: readonly string[]) {
  const selection = props.selection ?? 'none'
  const singleProps = selection === 'single' ? (props as SingleSelectionProps) : undefined
  const multipleProps = selection === 'multiple' ? (props as MultipleSelectionProps) : undefined

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
        const selectionProps = props as SingleSelectionProps

        if (currentSingle === id) return

        if (selectionProps.selected === undefined) {
          setUncontrolledSingle(id)
        }

        selectionProps.onSelect?.(id)
        return
      }

      if (selection === 'multiple') {
        const selectionProps = props as MultipleSelectionProps
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
