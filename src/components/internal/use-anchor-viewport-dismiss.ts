import {
  useEffect,
  type RefObject,
} from 'react'
import {
  trackVisualAnchor,
} from './visual-anchor-tracker'

const INTERACTION_EVENTS = [
  'pointerenter',
  'pointerleave',
  'pointerdown',
  'pointerup',
  'pointercancel',
  'focusin',
  'focusout',
] as const

function anchorFullyOutsideViewport(
  target: HTMLElement,
): boolean {
  const view =
    target.ownerDocument
      .defaultView

  if (view === null) {
    return false
  }

  const rect =
    target.getBoundingClientRect()

  if (
    rect.width <= 0 &&
    rect.height <= 0
  ) {
    return false
  }

  return (
    rect.bottom <= 0 ||
    rect.top >=
      view.innerHeight ||
    rect.right <= 0 ||
    rect.left >=
      view.innerWidth
  )
}

export function useAnchorViewportDismiss(
  targetRef:
    RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!active) return

    const target =
      targetRef.current

    if (target === null) {
      return
    }

    let dismissed = false

    const checkViewport = () => {
      if (
        dismissed ||
        !anchorFullyOutsideViewport(
          target,
        )
      ) {
        return
      }

      dismissed = true
      onDismiss()
    }

    return trackVisualAnchor(
      target,
      checkViewport,
      {
        trackScroll: true,
        trackMutations: true,
        interactionEvents:
          INTERACTION_EVENTS,
        continuousAnimations:
          true,
      },
    )
  }, [
    active,
    onDismiss,
    targetRef,
  ])
}
