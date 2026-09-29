import type { ListOrientation } from '../../core/list-types'

export interface VirtualMeasurement {
  main: number
  cross: number
}

export interface VirtualViewport {
  offset: number
  size: number
  gap: number
}

interface VirtualLayout {
  offsets: readonly number[]
  sizes: readonly number[]
  total: number
  maxCross: number
  estimate: number
}

const INITIAL_WINDOW = 12
const VERTICAL_ESTIMATE = 48
const HORIZONTAL_ESTIMATE = 160

function numericGap(root: HTMLDivElement, orientation: ListOrientation): number {
  const view = root.ownerDocument.defaultView
  if (view === null) return 0

  const style = view.getComputedStyle(root)
  const value = orientation === 'vertical' ? style.rowGap : style.columnGap
  const parsed = Number.parseFloat(value)

  return Number.isFinite(parsed) ? parsed : 0
}

export function readVirtualViewport(
  root: HTMLDivElement,
  orientation: ListOrientation,
): VirtualViewport {
  return {
    offset: orientation === 'vertical' ? root.scrollTop : root.scrollLeft,
    size: orientation === 'vertical' ? root.clientHeight : root.clientWidth,
    gap: numericGap(root, orientation),
  }
}

export function sameVirtualViewport(left: VirtualViewport, right: VirtualViewport): boolean {
  return left.offset === right.offset && left.size === right.size && left.gap === right.gap
}

export function createVirtualLayout(
  entries: readonly { id: string }[],
  measurements: ReadonlyMap<string, VirtualMeasurement>,
  orientation: ListOrientation,
  gap: number,
): VirtualLayout {
  const estimate = orientation === 'vertical' ? VERTICAL_ESTIMATE : HORIZONTAL_ESTIMATE
  const offsets: number[] = []
  const sizes: number[] = []
  let cursor = 0
  let maxCross = orientation === 'horizontal' ? VERTICAL_ESTIMATE : 0

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]!
    const measurement = measurements.get(entry.id)
    const size = measurement?.main ?? estimate

    offsets.push(cursor)
    sizes.push(size)
    maxCross = Math.max(maxCross, measurement?.cross ?? 0)

    cursor += size
    if (index < entries.length - 1) {
      cursor += gap
    }
  }

  return {
    offsets,
    sizes,
    total: cursor,
    maxCross,
    estimate,
  }
}

export function visibleVirtualIndices(
  entries: readonly { id: string }[],
  focusId: string | null,
  layout: VirtualLayout,
  viewport: VirtualViewport,
): number[] {
  if (entries.length === 0) return []

  const activeIndex = focusId === null ? -1 : entries.findIndex((entry) => entry.id === focusId)

  if (viewport.size <= 0) {
    const initial = Array.from(
      {
        length: Math.min(INITIAL_WINDOW, entries.length),
      },
      (_, index) => index,
    )

    if (activeIndex >= 0 && !initial.includes(activeIndex)) {
      initial.push(activeIndex)
      initial.sort((a, b) => a - b)
    }

    return initial
  }

  const overscan = Math.max(layout.estimate * 3, viewport.size * 0.5)
  const windowStart = Math.max(0, viewport.offset - overscan)
  const windowEnd = viewport.offset + viewport.size + overscan
  const indices: number[] = []

  for (let index = 0; index < entries.length; index += 1) {
    const start = layout.offsets[index]!
    const end = start + layout.sizes[index]!

    if (end >= windowStart && start <= windowEnd) {
      indices.push(index)
    }
  }

  if (activeIndex >= 0 && !indices.includes(activeIndex)) {
    indices.push(activeIndex)
    indices.sort((a, b) => a - b)
  }

  return indices
}
