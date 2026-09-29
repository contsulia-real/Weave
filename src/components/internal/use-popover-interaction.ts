import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  useAnchorViewportDismiss,
  useOutsideInteractionDismiss,
} from './use-anchor-viewport-dismiss'
import { useAnchoredTrigger } from './use-anchored-trigger'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function usePopoverInteraction(
  wrapperRef: RefObject<HTMLSpanElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
  popoverId: string,
  open: boolean,
  autoFocus: boolean,
  restoreFocus: boolean,
  toggleOpen: () => void,
  close: () => void,
  children: unknown,
): void {
  const skipRestoreRef = useRef(false)
  const previousOpenRef = useRef(false)

  const dismissForAnchorExit = useCallback(() => {
    skipRestoreRef.current = true
    close()
  }, [close])

  const dismissForOutside = useCallback(() => {
    skipRestoreRef.current = true
    close()
  }, [close])

  const handleTriggerClick = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return
      }

      skipRestoreRef.current = false
      toggleOpen()
    },
    [toggleOpen],
  )

  useAnchoredTrigger({
    wrapperRef,
    targetRef,
    popupId: popoverId,
    hasPopup: 'dialog',
    open,
    children,
    onClick: handleTriggerClick,
  })

  useAnchorViewportDismiss(targetRef, open, dismissForAnchorExit)

  useOutsideInteractionDismiss(targetRef, panelRef, open, dismissForOutside)

  useEffect(() => {
    if (!open) return

    const target = targetRef.current

    if (target === null) {
      return
    }

    const document = target.ownerDocument

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      event.preventDefault()
      skipRestoreRef.current = false
      close()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, open, targetRef])

  useLayoutEffect(() => {
    const wasOpen = previousOpenRef.current

    previousOpenRef.current = open

    if (open && !wasOpen && autoFocus) {
      queueMicrotask(() => {
        const panel = panelRef.current

        if (panel === null || !panel.isConnected) {
          return
        }

        const focusable = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)

        ;(focusable ?? panel).focus()
      })

      return
    }

    if (!open && wasOpen) {
      const skipRestore = skipRestoreRef.current

      skipRestoreRef.current = false

      if (!restoreFocus || skipRestore) {
        return
      }

      queueMicrotask(() => {
        const target = targetRef.current
        const panel = panelRef.current

        if (target === null) {
          return
        }

        const document = target.ownerDocument
        const active = document.activeElement

        if (
          active === null ||
          active === document.body ||
          (panel !== null && panel.contains(active))
        ) {
          target.focus()
        }
      })
    }
  }, [autoFocus, open, panelRef, restoreFocus, targetRef])
}
