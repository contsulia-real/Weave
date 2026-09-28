export type SubmenuSide =
  | 'right'
  | 'left'

export interface SubmenuSize {
  width: number
  height: number
}

export interface SubmenuViewport {
  width: number
  height: number
  padding: number
}

export interface ResolvedSubmenuPosition {
  left: number
  top: number
  side: SubmenuSide
}

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  if (max < min) return min
  return Math.min(
    max,
    Math.max(min, value),
  )
}

function candidate(
  target: DOMRect,
  panel: SubmenuSize,
  side: SubmenuSide,
  offset: number,
) {
  return {
    left:
      side === 'right'
        ? target.right + offset
        : (
            target.left -
            panel.width -
            offset
          ),
    top: target.top,
  }
}

function horizontalOverflow(
  position: {
    left: number
  },
  panel: SubmenuSize,
  viewport: SubmenuViewport,
): number {
  const min =
    viewport.padding
  const max =
    viewport.width -
    viewport.padding

  return (
    Math.max(
      0,
      min - position.left,
    ) +
    Math.max(
      0,
      position.left +
        panel.width -
        max,
    )
  )
}

export function resolveSubmenuPosition(
  target: DOMRect,
  panel: SubmenuSize,
  preferredSide:
    SubmenuSide,
  offset: number,
  viewport: SubmenuViewport,
): ResolvedSubmenuPosition {
  const requested =
    candidate(
      target,
      panel,
      preferredSide,
      offset,
    )
  const opposite:
    SubmenuSide =
    preferredSide === 'right'
      ? 'left'
      : 'right'
  const flipped =
    candidate(
      target,
      panel,
      opposite,
      offset,
    )
  const useFlipped =
    horizontalOverflow(
      flipped,
      panel,
      viewport,
    ) <
    horizontalOverflow(
      requested,
      panel,
      viewport,
    )
  const chosen =
    useFlipped
      ? flipped
      : requested
  const side =
    useFlipped
      ? opposite
      : preferredSide

  return {
    left: clamp(
      chosen.left,
      viewport.padding,
      viewport.width -
        viewport.padding -
        panel.width,
    ),
    top: clamp(
      chosen.top,
      viewport.padding,
      viewport.height -
        viewport.padding -
        panel.height,
    ),
    side,
  }
}
