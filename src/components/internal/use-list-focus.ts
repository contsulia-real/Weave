import {
  useCallback,
  useState,
  type RefObject,
} from 'react'
import type { ListFocusMove } from './list-context'

function initialFocusId(
  enabledIds: readonly string[],
  selectedIds: ReadonlySet<string>,
): string | null {
  for (const id of enabledIds) {
    if (selectedIds.has(id)) return id
  }

  return enabledIds[0] ?? null
}

export function useListFocus(
  enabledIds: readonly string[],
  selectedIds: ReadonlySet<string>,
  rootRef: RefObject<HTMLDivElement | null>,
) {
  const [
    storedFocusId,
    setStoredFocusId,
  ] = useState<string | null>(
    () => initialFocusId(enabledIds, selectedIds),
  )

  const focusId =
    storedFocusId !== null &&
    enabledIds.includes(storedFocusId)
      ? storedFocusId
      : initialFocusId(enabledIds, selectedIds)

  const setFocusId = useCallback(
    (id: string) => {
      if (enabledIds.includes(id)) {
        setStoredFocusId(id)
      }
    },
    [enabledIds],
  )

  const moveFocus = useCallback(
    (
      id: string,
      move: ListFocusMove,
    ) => {
      if (enabledIds.length === 0) return

      const currentIndex = Math.max(
        0,
        enabledIds.indexOf(id),
      )
      let nextIndex = currentIndex

      if (move === 'first') {
        nextIndex = 0
      } else if (move === 'last') {
        nextIndex = enabledIds.length - 1
      } else if (move === 'previous') {
        nextIndex = Math.max(0, currentIndex - 1)
      } else {
        nextIndex = Math.min(
          enabledIds.length - 1,
          currentIndex + 1,
        )
      }

      const nextId = enabledIds[nextIndex]
      if (nextId === undefined) return

      setStoredFocusId(nextId)

      const focusItem = () => {
        const items =
          rootRef.current?.querySelectorAll<HTMLElement>(
            '[data-weave-list-item-id]',
          )

        if (items === undefined) return false

        for (const item of items) {
          if (
            item.dataset.weaveListItemId === nextId
          ) {
            item.focus()
            return true
          }
        }

        return false
      }

      if (focusItem()) return

      const view =
        rootRef.current?.ownerDocument.defaultView

      if (
        view !== null &&
        view !== undefined &&
        typeof view.requestAnimationFrame === 'function'
      ) {
        view.requestAnimationFrame(focusItem)
      } else {
        queueMicrotask(focusItem)
      }
    },
    [enabledIds, rootRef],
  )

  return {
    focusId,
    setFocusId,
    moveFocus,
  }
}
