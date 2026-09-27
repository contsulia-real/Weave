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

function snackElements(
  element: HTMLDivElement,
): HTMLElement[] {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      '[data-weave-snack]',
    ),
  )
}

function openSnackElements(
  element: HTMLDivElement,
): HTMLElement[] {
  return snackElements(
    element,
  ).filter(
    (snack) =>
      snack.dataset.weaveSnackState !==
        'closing',
  )
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
      openSnackElements(element)
  ) {
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
}

function animateCapturedLayout(
  element: HTMLDivElement,
): void {
  const previous =
    capturedLayouts.get(
      element,
    )

  if (previous === undefined) {
    return
  }

  capturedLayouts.delete(element)

  const view =
    element.ownerDocument.defaultView

  if (
    view === null ||
    view.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
  ) {
    return
  }

  for (
    const snack of
      openSnackElements(element)
  ) {
    const before =
      previous.get(snack)

    if (before === undefined) {
      continue
    }

    const after =
      snack.getBoundingClientRect()
    const deltaX =
      before.left -
      after.left
    const deltaY =
      before.top -
      after.top

    if (
      Math.abs(deltaX) < 0.5 &&
      Math.abs(deltaY) < 0.5
    ) {
      continue
    }

    if (
      typeof snack.animate !==
        'function'
    ) {
      continue
    }

    const computed =
      view.getComputedStyle(
        snack,
      )
    const duration =
      durationMilliseconds(
        computed
          .getPropertyValue(
            '--weave-motion-duration-normal',
          )
          .trim(),
        220,
      )
    const easing =
      computed
        .getPropertyValue(
          '--weave-motion-curve-emphasized',
        )
        .trim() ||
      'ease'

    snack.animate(
      [
        {
          transform:
            `translate(${deltaX}px, ${deltaY}px)`,
        },
        {
          transform:
            'translate(0px, 0px)',
        },
      ],
      {
        duration,
        easing,
      },
    )
  }
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

  animateCapturedLayout(
    element,
  )
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
