import { type RefObject, useLayoutEffect } from 'react'
import { isHTMLElement, isNode } from './dom-realm'

function restoreAttribute(target: HTMLElement, name: string, value: string | null): void {
  if (value === null) {
    target.removeAttribute(name)
    return
  }

  target.setAttribute(name, value)
}

interface AnchoredTriggerOptions {
  wrapperRef: RefObject<HTMLElement | null>
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
    const wrapper = wrapperRef.current
    const target = wrapper?.firstElementChild

    if (wrapper === null || !isHTMLElement(target, wrapper.ownerDocument)) {
      targetRef.current = null
      return
    }

    targetRef.current = target

    const previousHasPopup = target.getAttribute('aria-haspopup')
    const previousControls = target.getAttribute('aria-controls')
    const previousExpanded = target.getAttribute('aria-expanded')
    const document = target.ownerDocument

    target.setAttribute('aria-haspopup', hasPopup)
    target.setAttribute('aria-controls', popupId)
    target.setAttribute('aria-expanded', 'false')

    const eventBelongsToTarget = (event: Event) =>
      isNode(event.target, document) && target.contains(event.target)

    const handleClick = (event: MouseEvent) => {
      if (eventBelongsToTarget(event)) {
        onClick?.(event)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (eventBelongsToTarget(event)) {
        onKeyDown?.(event)
      }
    }

    if (onClick !== undefined) {
      document.addEventListener('click', handleClick)
    }

    if (onKeyDown !== undefined) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (onClick !== undefined) {
        document.removeEventListener('click', handleClick)
      }

      if (onKeyDown !== undefined) {
        document.removeEventListener('keydown', handleKeyDown)
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
