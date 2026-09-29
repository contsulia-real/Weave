import type { PopoverPlacement } from '../../core/popover-types'

interface PopoverSize {
  width: number
  height: number
}

interface PopoverViewport {
  width: number
  height: number
  padding: number
}

interface ResolvedPopoverPosition {
  left: number
  top: number
  placement: PopoverPlacement
}

export type PopoverCrossAlignment = 'center' | 'start'

function oppositePopoverPlacement(placement: PopoverPlacement): PopoverPlacement {
  switch (placement) {
    case 'top-left':
      return 'bottom-left'
    case 'top':
      return 'bottom'
    case 'top-right':
      return 'bottom-right'
    case 'right':
      return 'left'
    case 'bottom-right':
      return 'top-right'
    case 'bottom':
      return 'top'
    case 'bottom-left':
      return 'top-left'
    case 'left':
      return 'right'
  }
}

function candidatePosition(
  target: DOMRect,
  panel: PopoverSize,
  placement: PopoverPlacement,
  offset: number,
  crossAlignment: PopoverCrossAlignment,
): {
  left: number
  top: number
} {
  const centerX = target.left + target.width / 2
  const centerY = target.top + target.height / 2

  switch (placement) {
    case 'top-left':
      return {
        left: target.left,
        top: target.top - panel.height - offset,
      }
    case 'top':
      return {
        left: centerX - panel.width / 2,
        top: target.top - panel.height - offset,
      }
    case 'top-right':
      return {
        left: target.right - panel.width,
        top: target.top - panel.height - offset,
      }
    case 'right':
      return {
        left: target.right + offset,
        top: crossAlignment === 'start' ? target.top : centerY - panel.height / 2,
      }
    case 'bottom-right':
      return {
        left: target.right - panel.width,
        top: target.bottom + offset,
      }
    case 'bottom':
      return {
        left: centerX - panel.width / 2,
        top: target.bottom + offset,
      }
    case 'bottom-left':
      return {
        left: target.left,
        top: target.bottom + offset,
      }
    case 'left':
      return {
        left: target.left - panel.width - offset,
        top: crossAlignment === 'start' ? target.top : centerY - panel.height / 2,
      }
  }
}

function mainOverflow(
  position: {
    left: number
    top: number
  },
  panel: PopoverSize,
  placement: PopoverPlacement,
  viewport: PopoverViewport,
): number {
  const right = position.left + panel.width
  const bottom = position.top + panel.height
  const maxX = viewport.width - viewport.padding
  const maxY = viewport.height - viewport.padding

  if (placement.startsWith('top')) {
    return Math.max(0, viewport.padding - position.top)
  }

  if (placement.startsWith('bottom')) {
    return Math.max(0, bottom - maxY)
  }

  if (placement === 'left') {
    return Math.max(0, viewport.padding - position.left)
  }

  return Math.max(0, right - maxX)
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min
  return Math.min(max, Math.max(min, value))
}

export function resolvePopoverPosition(
  target: DOMRect,
  panel: PopoverSize,
  placement: PopoverPlacement,
  offset: number,
  viewport: PopoverViewport,
  crossAlignment: PopoverCrossAlignment = 'center',
): ResolvedPopoverPosition {
  const requested = candidatePosition(target, panel, placement, offset, crossAlignment)
  const opposite = oppositePopoverPlacement(placement)
  const flipped = candidatePosition(target, panel, opposite, offset, crossAlignment)

  const requestedOverflow = mainOverflow(requested, panel, placement, viewport)
  const flippedOverflow = mainOverflow(flipped, panel, opposite, viewport)
  const useFlipped = requestedOverflow > 0 && flippedOverflow < requestedOverflow
  const chosen = useFlipped ? flipped : requested
  const resolvedPlacement = useFlipped ? opposite : placement
  const maxLeft = viewport.width - viewport.padding - panel.width
  const maxTop = viewport.height - viewport.padding - panel.height

  return {
    left: clamp(chosen.left, viewport.padding, maxLeft),
    top: clamp(chosen.top, viewport.padding, maxTop),
    placement: resolvedPlacement,
  }
}
