import type {
  SnackPlacement,
} from '../../core/snack-types'
import {
  durationMilliseconds,
} from './motion-duration'

interface RegionEntry {
  element: HTMLDivElement
  count: number
  releaseHostPosition(): void
}

interface SnackPosition {
  left: number
  top: number
}

interface HostPositionEntry {
  count: number
  changedInlinePosition: boolean
  previousInlinePosition: string
}

const regions =
  new WeakMap<
    HTMLElement,
    Map<
      string,
      Map<SnackPlacement, RegionEntry>
    >
  >()

const hostPositions =
  new WeakMap<
    HTMLElement,
    HostPositionEntry
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

function retainHostPosition(
  host: HTMLElement,
): () => void {
  if (
    host ===
    host.ownerDocument.body
  ) {
    return () => {}
  }

  const existing =
    hostPositions.get(host)

  if (existing !== undefined) {
    existing.count += 1

    return () => {
      existing.count -= 1

      if (existing.count > 0) {
        return
      }

      if (
        existing.changedInlinePosition &&
        host.style.position ===
          'relative'
      ) {
        host.style.position =
          existing.previousInlinePosition
      }

      hostPositions.delete(host)
    }
  }

  const view =
    host.ownerDocument.defaultView
  const computedPosition =
    view
      ?.getComputedStyle(host)
      .position ??
    host.style.position

  const previousInlinePosition =
    host.style.position
  const changedInlinePosition =
    computedPosition === 'static' ||
    computedPosition.length === 0

  if (changedInlinePosition) {
    host.style.position = 'relative'
  }

  const entry: HostPositionEntry = {
    count: 1,
    changedInlinePosition,
    previousInlinePosition,
  }

  hostPositions.set(
    host,
    entry,
  )

  return () => {
    entry.count -= 1

    if (entry.count > 0) {
      return
    }

    if (
      entry.changedInlinePosition &&
      host.style.position ===
        'relative'
    ) {
      host.style.position =
        entry.previousInlinePosition
    }

    hostPositions.delete(host)
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

export function getSnackRegion(
  host: HTMLElement,
  scopeId: string,
  placement: SnackPlacement,
): HTMLDivElement | null {
  return (
    regions
      .get(host)
      ?.get(scopeId)
      ?.get(placement)
      ?.element ??
    null
  )
}

export interface SnackRegionHandle {
  element: HTMLDivElement
  release(): void
}

export function retainSnackRegion(
  host: HTMLElement,
  scopeId: string,
  placement: SnackPlacement,
): SnackRegionHandle {
  let byScope =
    regions.get(host)

  if (byScope === undefined) {
    byScope = new Map()
    regions.set(
      host,
      byScope,
    )
  }

  let byPlacement =
    byScope.get(scopeId)

  if (byPlacement === undefined) {
    byPlacement = new Map()
    byScope.set(
      scopeId,
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
          existing.releaseHostPosition()
          byPlacement?.delete(
            placement,
          )

          if (
            byPlacement?.size === 0
          ) {
            byScope?.delete(
              scopeId,
            )
          }
          return
        }

        scheduleSync(
          existing.element,
        )
      },
    }
  }

  const element =
    host.ownerDocument.createElement(
      'div',
    )
  const scoped =
    host !==
    host.ownerDocument.body

  element.className =
    'weave-snack-region'
  element.dataset.weaveSnackRegion =
    placement
  element.dataset.weaveSnackScope =
    scoped
      ? 'container'
      : 'viewport'
  element.dataset.weaveSnackProviderScope =
    scopeId

  const releaseHostPosition =
    retainHostPosition(host)

  host.append(element)

  const entry: RegionEntry = {
    element,
    count: 1,
    releaseHostPosition,
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
        entry.releaseHostPosition()
        byPlacement?.delete(
          placement,
        )

        if (
          byPlacement?.size === 0
        ) {
          byScope?.delete(
            scopeId,
          )
        }
        return
      }

      scheduleSync(entry.element)
    },
  }
}
