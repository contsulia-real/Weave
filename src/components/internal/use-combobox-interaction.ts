import {
  useEffect,
  type RefObject,
} from 'react'
import {
  useAnchorViewportDismiss,
} from './use-anchor-viewport-dismiss'

export function useComboboxInteraction(
  anchorRef:
    RefObject<HTMLInputElement | null>,
  rootRef:
    RefObject<HTMLElement | null>,
  listboxRef:
    RefObject<HTMLDivElement | null>,
  open: boolean,
  close: () => void,
): void {
  useAnchorViewportDismiss(
    anchorRef,
    open,
    close,
  )

  useEffect(() => {
    if (!open) return

    const anchor =
      anchorRef.current

    if (anchor === null) {
      return
    }

    const document =
      anchor.ownerDocument

    const inside = (
      target: EventTarget | null,
    ) => {
      if (
        !(target instanceof Node)
      ) {
        return false
      }

      return (
        rootRef.current
          ?.contains(target) ===
          true ||
        listboxRef.current
          ?.contains(target) ===
          true
      )
    }

    const pointerDown = (
      event: PointerEvent,
    ) => {
      if (!inside(event.target)) {
        close()
      }
    }

    const focusIn = (
      event: FocusEvent,
    ) => {
      if (!inside(event.target)) {
        close()
      }
    }

    document.addEventListener(
      'pointerdown',
      pointerDown,
      true,
    )
    document.addEventListener(
      'focusin',
      focusIn,
      true,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        pointerDown,
        true,
      )
      document.removeEventListener(
        'focusin',
        focusIn,
        true,
      )
    }
  }, [
    anchorRef,
    close,
    listboxRef,
    open,
    rootRef,
  ])
}
