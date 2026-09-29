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

export function useOutsideInteractionDismiss(
  anchorRef:
    RefObject<HTMLElement | null>,
  surfaceRef:
    | RefObject<HTMLElement | null>
    | undefined,
  active: boolean,
  onDismiss: () => void,
  dismissOnFocusOutside = false,
  isInsideExtra?: (
    target: Node,
  ) => boolean,
): void {
  useEffect(() => {
    if (!active) return

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
      if (!(target instanceof Node)) {
        return false
      }

      return (
        anchorRef.current
          ?.contains(target) === true ||
        surfaceRef?.current
          ?.contains(target) === true ||
        isInsideExtra?.(target) === true
      )
    }

    const pointerDown = (
      event: PointerEvent,
    ) => {
      if (!inside(event.target)) {
        onDismiss()
      }
    }

    const focusIn = (
      event: FocusEvent,
    ) => {
      if (!inside(event.target)) {
        onDismiss()
      }
    }

    document.addEventListener(
      'pointerdown',
      pointerDown,
      true,
    )

    if (dismissOnFocusOutside) {
      document.addEventListener(
        'focusin',
        focusIn,
        true,
      )
    }

    return () => {
      document.removeEventListener(
        'pointerdown',
        pointerDown,
        true,
      )

      if (dismissOnFocusOutside) {
        document.removeEventListener(
          'focusin',
          focusIn,
          true,
        )
      }
    }
  }, [
    active,
    anchorRef,
    dismissOnFocusOutside,
    isInsideExtra,
    onDismiss,
    surfaceRef,
  ])
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
