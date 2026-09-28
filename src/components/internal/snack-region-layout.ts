import type {
  SnackContainer,
  SnackPlacement,
} from '../../core/snack-types'
import {
  durationMilliseconds,
} from './motion-duration'
import {
  resolveSnackHost,
} from './snack-host-context'
import {
  getSnackRegion,
} from './snack-region-registry'

interface SnackPosition {
  left: number
  top: number
}

const capturedLayouts =
  new WeakMap<
    HTMLDivElement,
    Map<HTMLElement, SnackPosition>
  >()

const layoutAnimations =
  new WeakMap<HTMLElement, Animation>()

function snackElements(
  element: HTMLDivElement,
): HTMLElement[] {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      '[data-weave-snack]',
    ),
  )
}

function reducedMotion(
  element: HTMLElement,
): boolean {
  const motionHost =
    element.querySelector<HTMLElement>(
      '[data-weave-reduced-motion]',
    )

  return (
    motionHost?.dataset
      .weaveReducedMotion ===
    'reduce'
  )
}

function motionDuration(
  element: HTMLElement,
): number {
  const view =
    element.ownerDocument.defaultView

  if (view === null) {
    return 180
  }

  return durationMilliseconds(
    view
      .getComputedStyle(element)
      .getPropertyValue(
        '--weave-motion-duration-normal',
      ),
    180,
  )
}

function motionCurve(
  element: HTMLElement,
): string {
  const view =
    element.ownerDocument.defaultView

  if (view === null) {
    return 'ease'
  }

  const value =
    view
      .getComputedStyle(element)
      .getPropertyValue(
        '--weave-motion-curve-emphasized',
      )
      .trim()

  return value || 'ease'
}

function animateCapturedLayout(
  element: HTMLDivElement,
): void {
  const previous =
    capturedLayouts.get(element)

  capturedLayouts.delete(element)

  if (
    previous === undefined ||
    reducedMotion(element)
  ) {
    return
  }

  for (
    const snack of
      snackElements(element)
  ) {
    if (
      snack.dataset.weaveSnackState ===
        'closing'
    ) {
      continue
    }

    const before =
      previous.get(snack)

    if (before === undefined) {
      continue
    }

    const after =
      snack.getBoundingClientRect()
    const x =
      before.left - after.left
    const y =
      before.top - after.top

    if (
      Math.abs(x) < 0.5 &&
      Math.abs(y) < 0.5
    ) {
      continue
    }

    layoutAnimations
      .get(snack)
      ?.cancel()

    if (
      typeof snack.animate !==
      'function'
    ) {
      continue
    }

    const animation =
      snack.animate(
        [
          {
            translate:
              `${x}px ${y}px`,
          },
          {
            translate: '0px 0px',
          },
        ],
        {
          duration:
            motionDuration(snack),
          easing:
            motionCurve(snack),
          fill: 'both',
        },
      )

    layoutAnimations.set(
      snack,
      animation,
    )

    animation.finished
      .catch(() => undefined)
      .finally(() => {
        if (
          layoutAnimations.get(
            snack,
          ) === animation
        ) {
          animation.cancel()
          layoutAnimations.delete(
            snack,
          )
        }
      })
  }
}

export function captureSnackRegionLayout(
  element: HTMLDivElement,
): void {
  const positions =
    new Map<
      HTMLElement,
      SnackPosition
    >()

  for (
    const snack of
      snackElements(element)
  ) {
    if (
      snack.dataset.weaveSnackState ===
        'closing'
    ) {
      continue
    }

    const rect =
      snack.getBoundingClientRect()

    positions.set(
      snack,
      {
        left: rect.left,
        top: rect.top,
      },
    )
  }

  capturedLayouts.set(
    element,
    positions,
  )

  const view =
    element.ownerDocument.defaultView

  if (
    view === null ||
    typeof view.requestAnimationFrame !==
      'function'
  ) {
    queueMicrotask(
      () =>
        animateCapturedLayout(
          element,
        ),
    )
    return
  }

  view.requestAnimationFrame(
    () =>
      animateCapturedLayout(
        element,
      ),
  )
}

export function captureSnackPlacementLayout(
  placement: SnackPlacement,
  container: SnackContainer | undefined,
  scopeId: string,
): void {
  if (
    typeof document ===
      'undefined'
  ) {
    return
  }

  const host =
    resolveSnackHost(
      container,
      document,
    )

  if (host === null) {
    return
  }

  const region =
    getSnackRegion(
      host,
      scopeId,
      placement,
    )

  if (region !== null) {
    captureSnackRegionLayout(
      region,
    )
  }
}
