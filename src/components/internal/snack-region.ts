import type {
  SnackPlacement,
} from '../../core/snack-types'

const MAX_VISIBLE_SNACKS = 3

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
  const total =
    snacks.length
  const hiddenCount =
    Math.max(
      0,
      total -
        MAX_VISIBLE_SNACKS,
    )

  element.dataset.weaveSnackCount =
    String(total)

  for (
    let index = 0;
    index < total;
    index += 1
  ) {
    const snack =
      snacks[index]
    const rank =
      index

    snack.dataset.weaveSnackStackRank =
      String(rank)

    if (
      rank >=
      MAX_VISIBLE_SNACKS
    ) {
      snack.dataset.weaveSnackStackHidden =
        ''
    } else {
      delete snack.dataset
        .weaveSnackStackHidden
    }
  }

  if (hiddenCount > 0) {
    element.dataset.weaveSnackFolded =
      ''
    element.dataset.weaveSnackHiddenCount =
      String(hiddenCount)
    return
  }

  delete element.dataset
    .weaveSnackFolded
  delete element.dataset
    .weaveSnackHiddenCount
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
