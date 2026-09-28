import {
  useEffect,
  type RefObject,
} from 'react'
import {
  useAnchorViewportDismiss,
} from './use-anchor-viewport-dismiss'

export function useSelectInteraction(
  triggerRef:
    RefObject<HTMLButtonElement | null>,
  listboxRef:
    RefObject<HTMLDivElement | null>,
  open: boolean,
  close: () => void,
): void {
  useAnchorViewportDismiss(
    triggerRef,
    open,
    close,
  )

  useEffect(() => {
    if (!open) return

    const trigger =
      triggerRef.current

    if (trigger === null) {
      return
    }

    const document =
      trigger.ownerDocument

    const pointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target

      if (
        !(target instanceof Node)
      ) {
        return
      }

      if (
        trigger.contains(target) ||
        listboxRef.current
          ?.contains(target)
      ) {
        return
      }

      close()
    }

    document.addEventListener(
      'pointerdown',
      pointerDown,
      true,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        pointerDown,
        true,
      )
    }
  }, [
    close,
    listboxRef,
    open,
    triggerRef,
  ])
}
