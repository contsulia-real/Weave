import type {
  SnackPlacement,
} from '../../core/snack-types'

interface RegionEntry {
  element: HTMLDivElement
  count: number
}

const regions =
  new WeakMap<
    Document,
    Map<SnackPlacement, RegionEntry>
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
