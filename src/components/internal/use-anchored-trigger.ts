import { type RefObject, useLayoutEffect } from 'react'

function restoreAttribute(target: HTMLElement, name: string, value: string | null): void {
  if (value === null) {
    target.removeAttribute(name)
    return
  }

  target.setAttribute(name, value)
}

interface AnchoredTriggerOptions {
  wrapperRef: RefObject<HTMLSpanElement | null>
  targetRef: RefObject<HTMLElement | null>
  popupId: string
  hasPopup: string
  open: boolean
  children: unknown
  onClick?: (event: MouseEvent) => void
  onKeyDown?: (event: KeyboardEvent) => void
}

export function useAnchoredTrigger({
  wrapperRef,
  targetRef,
  popupId,
  hasPopup,
  open,
  children,
  onClick,
  onKeyDown,
}: AnchoredTriggerOptions): void {
  useLayoutEffect(() => {
    const target = wrapperRef.current?.firstElementChild

    if (!(target instanceof HTMLElement)) {
      targetRef.current = null
      return
    }

    targetRef.current = target

    const previousHasPopup = target.getAttribute('aria-haspopup')
    const previousControls = target.getAttribute('aria-controls')
    const previousExpanded = target.getAttribute('aria-expanded')

    target.setAttribute('aria-haspopup', hasPopup)
    target.setAttribute('aria-controls', popupId)
    target.setAttribute('aria-expanded', 'false')

    if (onClick !== undefined) {
      target.addEventListener('click', onClick)
    }

    if (onKeyDown !== undefined) {
      target.addEventListener('keydown', onKeyDown)
    }

    return () => {
      if (onClick !== undefined) {
        target.removeEventListener('click', onClick)
      }

      if (onKeyDown !== undefined) {
        target.removeEventListener('keydown', onKeyDown)
      }

      restoreAttribute(target, 'aria-haspopup', previousHasPopup)
      restoreAttribute(target, 'aria-controls', previousControls)
      restoreAttribute(target, 'aria-expanded', previousExpanded)

      if (targetRef.current === target) {
        targetRef.current = null
      }
    }
  }, [children, hasPopup, onClick, onKeyDown, popupId, targetRef, wrapperRef])

  useLayoutEffect(() => {
    targetRef.current?.setAttribute('aria-expanded', String(open))
  }, [open, targetRef])
}
