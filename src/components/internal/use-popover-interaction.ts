import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react'
import {
  useAnchorViewportDismiss,
} from './use-anchor-viewport-dismiss'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function restoreAttribute(
  target: HTMLElement,
  name: string,
  value: string | null,
): void {
  if (value === null) {
    target.removeAttribute(name)
  } else {
    target.setAttribute(
      name,
      value,
    )
  }
}

export function usePopoverInteraction(
  wrapperRef:
    RefObject<HTMLSpanElement | null>,
  targetRef:
    RefObject<HTMLElement | null>,
  panelRef:
    RefObject<HTMLDivElement | null>,
  popoverId: string,
  open: boolean,
  autoFocus: boolean,
  restoreFocus: boolean,
  toggleOpen: () => void,
  close: () => void,
  children: unknown,
): void {
  const skipRestoreRef =
    useRef(false)
  const previousOpenRef =
    useRef(false)
  const dismissForAnchorExit =
    useCallback(() => {
      skipRestoreRef.current =
        true
      close()
    }, [close])

  useAnchorViewportDismiss(
    targetRef,
    open,
    dismissForAnchorExit,
  )

  useLayoutEffect(() => {
    const wrapper =
      wrapperRef.current
    const target =
      wrapper?.firstElementChild

    if (
      !(target instanceof HTMLElement)
    ) {
      targetRef.current = null
      return
    }

    targetRef.current =
      target

    const previousHasPopup =
      target.getAttribute(
        'aria-haspopup',
      )
    const previousControls =
      target.getAttribute(
        'aria-controls',
      )
    const previousExpanded =
      target.getAttribute(
        'aria-expanded',
      )

    target.setAttribute(
      'aria-haspopup',
      'dialog',
    )
    target.setAttribute(
      'aria-controls',
      popoverId,
    )
    target.setAttribute(
      'aria-expanded',
      'false',
    )

    const handleClick = (
      event: MouseEvent,
    ) => {
      if (
        event.defaultPrevented
      ) {
        return
      }

      skipRestoreRef.current =
        false
      toggleOpen()
    }

    target.addEventListener(
      'click',
      handleClick,
    )

    return () => {
      target.removeEventListener(
        'click',
        handleClick,
      )

      restoreAttribute(
        target,
        'aria-haspopup',
        previousHasPopup,
      )
      restoreAttribute(
        target,
        'aria-controls',
        previousControls,
      )
      restoreAttribute(
        target,
        'aria-expanded',
        previousExpanded,
      )

      if (
        targetRef.current ===
        target
      ) {
        targetRef.current = null
      }
    }
  }, [
    children,
    popoverId,
    targetRef,
    toggleOpen,
    wrapperRef,
  ])

  useLayoutEffect(() => {
    const target =
      targetRef.current

    if (target === null) {
      return
    }

    target.setAttribute(
      'aria-expanded',
      String(open),
    )
  }, [
    open,
    targetRef,
  ])

  useEffect(() => {
    if (!open) return

    const target =
      targetRef.current

    if (target === null) {
      return
    }

    const document =
      target.ownerDocument

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const eventTarget =
        event.target

      const panel =
        panelRef.current

      if (
        !(eventTarget instanceof Node) ||
        target.contains(
          eventTarget,
        ) ||
        (
          panel !== null &&
          panel.contains(
            eventTarget,
          )
        )
      ) {
        return
      }

      skipRestoreRef.current =
        true
      close()
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key !== 'Escape'
      ) {
        return
      }

      event.preventDefault()
      skipRestoreRef.current =
        false
      close()
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
      true,
    )
    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
        true,
      )
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    close,
    open,
    panelRef,
    targetRef,
  ])

  useLayoutEffect(() => {
    const wasOpen =
      previousOpenRef.current

    previousOpenRef.current =
      open

    if (
      open &&
      !wasOpen &&
      autoFocus
    ) {
      queueMicrotask(() => {
        const panel =
          panelRef.current

        if (
          panel === null ||
          !panel.isConnected
        ) {
          return
        }

        const focusable =
          panel.querySelector<HTMLElement>(
            FOCUSABLE_SELECTOR,
          )

        ;(
          focusable ??
          panel
        ).focus()
      })

      return
    }

    if (
      !open &&
      wasOpen
    ) {
      const skipRestore =
        skipRestoreRef.current

      skipRestoreRef.current =
        false

      if (
        !restoreFocus ||
        skipRestore
      ) {
        return
      }

      queueMicrotask(() => {
        const target =
          targetRef.current
        const panel =
          panelRef.current

        if (target === null) {
          return
        }

        const document =
          target.ownerDocument
        const active =
          document.activeElement

        if (
          active === null ||
          active ===
            document.body ||
          (
            panel !== null &&
            panel.contains(active)
          )
        ) {
          target.focus()
        }
      })
    }
  }, [
    autoFocus,
    open,
    panelRef,
    restoreFocus,
    targetRef,
  ])
}
