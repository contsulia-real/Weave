export interface SwitchDragState {
  pointerId: number
  startX: number
  startOffset: number
  maxOffset: number
  currentOffset: number
  thumbSize: number
  moved: boolean
}

const DRAG_THRESHOLD = 3

interface SwitchDragGeometry {
  startOffset: number
  maxOffset: number
  thumbSize: number
}

export function switchDragGeometry(
  root: HTMLButtonElement,
  thumb: HTMLDivElement,
  checked: boolean,
): SwitchDragGeometry {
  const rootRect = root.getBoundingClientRect()
  const thumbRect = thumb.getBoundingClientRect()
  const inset = checked
    ? Math.max(0, rootRect.right - thumbRect.right)
    : Math.max(0, thumbRect.left - rootRect.left)
  const maxOffset = Math.max(0, rootRect.width - thumbRect.width - inset * 2)

  return {
    startOffset: checked ? maxOffset : 0,
    maxOffset,
    thumbSize: thumbRect.width,
  }
}

function dragProgress(offset: number, startOffset: number, maxOffset: number): number {
  const thresholdDistance = maxOffset / 2
  if (thresholdDistance <= 0) return 0

  return Math.min(1, Math.abs(offset - startOffset) / thresholdDistance)
}

function applySwitchShape(
  thumb: HTMLDivElement,
  drag: SwitchDragState,
  offset: number,
  widthScale: number,
  heightScale: number,
): void {
  const width = drag.thumbSize * widthScale
  const height = drag.thumbSize * heightScale
  const centeredX = offset + (drag.thumbSize - width) / 2
  const maxX = Math.max(0, drag.maxOffset + drag.thumbSize - width)
  const x = Math.min(maxX, Math.max(0, centeredX))

  thumb.style.width = `${width}px`
  thumb.style.height = `${height}px`
  thumb.style.transform = `translate(${x}px, -50%)`
}

export function applySwitchDragShape(
  thumb: HTMLDivElement,
  drag: SwitchDragState,
  offset: number,
  shrink: number,
  maxWidth: number,
): void {
  const progress = dragProgress(offset, drag.startOffset, drag.maxOffset)
  const widthScale = shrink + (maxWidth - shrink) * progress

  applySwitchShape(thumb, drag, offset, widthScale, shrink)
}

export function applySwitchAutoDragShape(
  thumb: HTMLDivElement,
  drag: SwitchDragState,
  offset: number,
  progress: number,
  shrink: number,
  maxWidth: number,
): void {
  const normalized = Math.min(1, Math.max(0, progress))
  const secondHalf = Math.max(0, (normalized - 0.5) * 2)

  const widthScale =
    normalized <= 0.5
      ? shrink + (maxWidth - shrink) * (normalized * 2)
      : maxWidth + (1 - maxWidth) * secondHalf
  const heightScale = normalized <= 0.5 ? shrink : shrink + (1 - shrink) * secondHalf

  applySwitchShape(thumb, drag, offset, widthScale, heightScale)
}

export function clearSwitchDragShape(thumb: HTMLDivElement): void {
  thumb.style.removeProperty('width')
  thumb.style.removeProperty('height')
  thumb.style.removeProperty('transform')
}

export function moveSwitchDrag(drag: SwitchDragState, clientX: number): number {
  const delta = clientX - drag.startX
  const nextOffset = Math.min(drag.maxOffset, Math.max(0, drag.startOffset + delta))

  drag.currentOffset = nextOffset

  if (!drag.moved && Math.abs(delta) >= DRAG_THRESHOLD) {
    drag.moved = true
  }

  return nextOffset
}
