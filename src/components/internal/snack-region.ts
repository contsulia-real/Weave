import type {
  SnackPlacement,
} from '../../core/snack-types'
import {
  durationMilliseconds,
} from './motion-duration'

interface RegionEntry {
  element: HTMLDivElement
  count: number
}

interface SnackPosition {
  left: number
  top: number
}

const regions =
  new WeakMap<
    Document,
    Map<SnackPlacement, RegionEntry>
  >()

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
  const view =
    element.ownerDocument.defaultView

  return (
    view?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches ?? false
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

export function syncSnackRegion(
  element: HTMLDivElement,
): void {
  const snacks =
    snackElements(element)

  element.dataset.weaveSnackCount =
    String(snacks.length)

  let queueIndex = 0

  for (const snack of snacks) {
    if (
      snack.dataset.weaveSnackState ===
      'closing'
    ) {
      delete snack.dataset
        .weaveSnackQueueIndex
      continue
    }

    snack.dataset.weaveSnackQueueIndex =
      String(queueIndex)
    queueIndex += 1
  }
}

function scheduleSync(
  element: HTMLDivElement,
): void {
  queueMicrotask(() => {
    if (!element.isConnected) {
      return
    }

    syncSnackRegion(element)
  })
}

export interface SnackRegionHandle {
  element: HTMLDivElement
  release(): void
}

export function retainSnackRegion(
  document: Document,
  placement: SnackPlacement,
): SnackRegionHandle {
  let byPlacement =
    regions.get(document)

  if (byPlacement === undefined) {
    byPlacement = new Map()
    regions.set(
      document,
      byPlacement,
    )
  }

  const existing =
    byPlacement.get(placement)

  if (existing !== undefined) {
    existing.count += 1
    scheduleSync(existing.element)

    return {
      element: existing.element,
      release() {
        existing.count -= 1

        if (existing.count <= 0) {
          existing.element.remove()
          byPlacement?.delete(
            placement,
          )
          return
        }

        scheduleSync(
          existing.element,
        )
      },
    }
  }

  const element =
    document.createElement('div')

  element.className =
    'weave-snack-region'
  element.dataset.weaveSnackRegion =
    placement
  document.body.append(element)

  const entry: RegionEntry = {
    element,
    count: 1,
  }

  byPlacement.set(
    placement,
    entry,
  )

  scheduleSync(element)

  return {
    element,
    release() {
      entry.count -= 1

      if (entry.count <= 0) {
        entry.element.remove()
        byPlacement?.delete(
          placement,
        )
        return
      }

      scheduleSync(entry.element)
    },
  }
}
