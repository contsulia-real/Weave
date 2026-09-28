import type {
  SnackPlacement,
} from '../../core/snack-types'

interface RegionEntry {
  element: HTMLDivElement
  count: number
  releaseHostPosition(): void
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

function snackElements(
  element: HTMLDivElement,
): HTMLElement[] {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      '[data-weave-snack]',
    ),
  )
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
