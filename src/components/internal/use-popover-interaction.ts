import { type RefObject, useCallback, useEffect, useRef } from 'react'
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

interface OpenPopoverEscapeHandler {
  handler: (event: KeyboardEvent) => void
  target: HTMLElement
}

const escapeHandlers = new WeakMap<Document, OpenPopoverEscapeHandler[]>()

export function usePopoverInteraction(
  wrapperRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
  popoverId: string,
  open: boolean,
  present: boolean,
  autoFocus: boolean,
  restoreFocus: boolean,
  toggleOpen: () => void,
  close: () => void,
  children: unknown,
): void {
  const skipRestoreRef = useRef(false)
  const previousOpenRef = useRef(false)
  const pendingAutoFocusRef = useRef(false)

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

  useAnchorViewportDismiss(targetRef, open, dismissForAnchorExit, children)

  useOutsideInteractionDismiss(
    targetRef,
    panelRef,
    open,
    dismissForOutside,
    false,
    undefined,
    children,
  )

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
      if (escapeHandlers.get(document)?.at(-1)?.handler !== handleKeyDown) return

      event.preventDefault()
      event.stopImmediatePropagation()
      skipRestoreRef.current = false
      close()
    }

    const handlers = escapeHandlers.get(document) ?? []
    const entry = { handler: handleKeyDown, target }
    const panel = panelRef.current
    const parentIndex = handlers.findIndex(({ target: childTarget }) =>
      panel?.contains(childTarget),
    )
    handlers.splice(parentIndex < 0 ? handlers.length : parentIndex, 0, entry)
    escapeHandlers.set(document, handlers)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      handlers.splice(handlers.indexOf(entry), 1)
      if (handlers.length === 0) escapeHandlers.delete(document)
    }
  }, [close, open, panelRef, targetRef])

  useEffect(() => {
    const wasOpen = previousOpenRef.current
    previousOpenRef.current = open

    if (open) {
      if (!wasOpen && autoFocus) {
        pendingAutoFocusRef.current = true
      }

      if (present && pendingAutoFocusRef.current) {
        const panel = panelRef.current

        if (panel !== null && panel.isConnected) {
          queueMicrotask(() => {
            if (
              panelRef.current !== panel ||
              !panel.isConnected ||
              targetRef.current?.getAttribute('aria-expanded') !== 'true'
            ) {
              return
            }

            pendingAutoFocusRef.current = false
            const focusable = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
            ;(focusable ?? panel).focus()
          })
        }
      }

      return
    }

    pendingAutoFocusRef.current = false

    if (wasOpen) {
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
  }, [autoFocus, open, panelRef, present, restoreFocus, targetRef])
}
