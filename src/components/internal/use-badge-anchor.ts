import { type ReactNode, type RefObject, useLayoutEffect } from 'react'
import { trackVisualAnchor, visualAnchorInteractionEvents } from './visual-anchor-tracker'

interface VisualRect {
  left: number
  top: number
  right: number
  bottom: number
}

function setAnchorVariables(wrapper: HTMLElement, target: HTMLElement): VisualRect {
  const wrapperRect = wrapper.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const rect = {
    left: targetRect.left - wrapperRect.left,
    top: targetRect.top - wrapperRect.top,
    right: targetRect.right - wrapperRect.left,
    bottom: targetRect.bottom - wrapperRect.top,
  }

  wrapper.style.setProperty('--weave-badge-target-left', `${rect.left}px`)
  wrapper.style.setProperty('--weave-badge-target-top', `${rect.top}px`)
  wrapper.style.setProperty('--weave-badge-target-right', `${rect.right}px`)
  wrapper.style.setProperty('--weave-badge-target-bottom', `${rect.bottom}px`)
  wrapper.style.setProperty('--weave-badge-target-center-x', `${(rect.left + rect.right) / 2}px`)
  wrapper.style.setProperty('--weave-badge-target-center-y', `${(rect.top + rect.bottom) / 2}px`)

  return rect
}

export function useBadgeAnchor(
  wrapperRef: RefObject<HTMLDivElement | null>,
  children: ReactNode,
): void {
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const target = wrapper?.firstElementChild

    if (wrapper === null || wrapper === undefined || !(target instanceof HTMLElement)) {
      return
    }

    return trackVisualAnchor(
      target,
      () => {
        setAnchorVariables(wrapper, target)
      },
      {
        additionalTargets: [wrapper],
        trackMutations: true,
        interactionEvents: visualAnchorInteractionEvents,
        continuousAnimations: true,
      },
    )
  }, [children, wrapperRef])
}
