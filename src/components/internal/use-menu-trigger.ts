import { type RefObject, useCallback, useLayoutEffect, useRef } from 'react'
import {
  useAnchorViewportDismiss,
  useOutsideInteractionDismiss,
} from './use-anchor-viewport-dismiss'
import { useAnchoredTrigger } from './use-anchored-trigger'

export type MenuInitialFocus = 'first' | 'last'

export function useMenuTrigger(
  wrapperRef: RefObject<HTMLSpanElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  rootId: string,
  menuId: string,
  open: boolean,
  requestOpen: (open: boolean, focus?: MenuInitialFocus) => void,
  closeAll: (restoreFocus?: boolean) => void,
  children: unknown,
): void {
  const previousOpenRef = useRef(false)
  const restoreFocusRef = useRef(true)

  const dismissForAnchorExit = useCallback(() => {
    restoreFocusRef.current = false
    closeAll(false)
  }, [closeAll])

  const dismissForOutside = useCallback(() => {
    restoreFocusRef.current = false
    closeAll(false)
  }, [closeAll])

  const insideMenuTree = useCallback(
    (eventTarget: Node) => {
      const document = targetRef.current?.ownerDocument

      if (document === undefined) {
        return false
      }

      const panels = document.querySelectorAll<HTMLElement>('[data-weave-menu-root]')

      for (const panel of panels) {
        if (panel.dataset.weaveMenuRoot === rootId && panel.contains(eventTarget)) {
          return true
        }
      }

      return false
    },
    [rootId, targetRef],
  )

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return
      }

      restoreFocusRef.current = true
      requestOpen(!open, 'first')
    },
    [open, requestOpen],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        restoreFocusRef.current = true
        requestOpen(true, 'first')
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        restoreFocusRef.current = true
        requestOpen(true, 'last')
      }
    },
    [requestOpen],
  )

  useAnchoredTrigger({
    wrapperRef,
    targetRef,
    popupId: menuId,
    hasPopup: 'menu',
    open,
    children,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  })

  useAnchorViewportDismiss(targetRef, open, dismissForAnchorExit)

  useOutsideInteractionDismiss(targetRef, undefined, open, dismissForOutside, false, insideMenuTree)

  useLayoutEffect(() => {
    const wasOpen = previousOpenRef.current
    previousOpenRef.current = open

    if (!open && wasOpen && restoreFocusRef.current) {
      queueMicrotask(() => {
        targetRef.current?.focus()
      })
    }
  }, [open, targetRef])
}
