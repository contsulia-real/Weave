import {
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react'

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

export type MenuInitialFocus =
  | 'first'
  | 'last'

export function useMenuTrigger(
  wrapperRef:
    RefObject<HTMLSpanElement | null>,
  targetRef:
    RefObject<HTMLElement | null>,
  rootId: string,
  menuId: string,
  open: boolean,
  requestOpen: (
    open: boolean,
    focus?: MenuInitialFocus,
  ) => void,
  closeAll: (
    restoreFocus?: boolean,
  ) => void,
  children: unknown,
): void {
  const previousOpenRef =
    useRef(false)
  const restoreFocusRef =
    useRef(true)

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
      'menu',
    )
    target.setAttribute(
      'aria-controls',
      menuId,
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

      restoreFocusRef.current =
        true
      requestOpen(
        !open,
        'first',
      )
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.defaultPrevented
      ) {
        return
      }

      if (
        event.key ===
          'ArrowDown' ||
        event.key ===
          'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault()
        restoreFocusRef.current =
          true
        requestOpen(
          true,
          'first',
        )
        return
      }

      if (
        event.key ===
        'ArrowUp'
      ) {
        event.preventDefault()
        restoreFocusRef.current =
          true
        requestOpen(
          true,
          'last',
        )
      }
    }

    target.addEventListener(
      'click',
      handleClick,
    )
    target.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      target.removeEventListener(
        'click',
        handleClick,
      )
      target.removeEventListener(
        'keydown',
        handleKeyDown,
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
    menuId,
    open,
    requestOpen,
    targetRef,
    wrapperRef,
  ])

  useLayoutEffect(() => {
    targetRef.current
      ?.setAttribute(
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

    const pointerDown = (
      event: PointerEvent,
    ) => {
      const eventTarget =
        event.target

      if (
        !(eventTarget instanceof Node)
      ) {
        return
      }

      if (
        target.contains(
          eventTarget,
        )
      ) {
        return
      }

      const panels =
        document.querySelectorAll<HTMLElement>(
          '[data-weave-menu-root]',
        )

      for (const panel of panels) {
        if (
          panel.dataset
            .weaveMenuRoot ===
            rootId &&
          panel.contains(
            eventTarget,
          )
        ) {
          return
        }
      }

      restoreFocusRef.current =
        false
      closeAll(false)
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
    closeAll,
    open,
    rootId,
    targetRef,
  ])

  useLayoutEffect(() => {
    const wasOpen =
      previousOpenRef.current
    previousOpenRef.current =
      open

    if (
      !open &&
      wasOpen &&
      restoreFocusRef.current
    ) {
      queueMicrotask(() => {
        targetRef.current
          ?.focus()
      })
    }
  }, [
    open,
    targetRef,
  ])
}
