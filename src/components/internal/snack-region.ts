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

function syncRegionState(
  entry: RegionEntry,
): void {
  const hiddenCount =
    Math.max(
      0,
      entry.count -
        MAX_VISIBLE_SNACKS,
    )

  entry.element.dataset.weaveSnackCount =
    String(entry.count)

  if (hiddenCount > 0) {
    entry.element.dataset.weaveSnackFolded =
      ''
    entry.element.dataset.weaveSnackHiddenCount =
      String(hiddenCount)
    return
  }

  delete entry.element.dataset
    .weaveSnackFolded
  delete entry.element.dataset
    .weaveSnackHiddenCount
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
    syncRegionState(existing)

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

        syncRegionState(existing)
      },
    }
  }

  const element =
    document.createElement('div')

  element.className =
    'weave-snack-region'
  element.dataset.weaveSnackRegion =
    placement

  const entry: RegionEntry = {
    element,
    count: 1,
  }

  syncRegionState(entry)
  document.body.append(element)

  byPlacement.set(
    placement,
    entry,
  )

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

      syncRegionState(entry)
    },
  }
}
