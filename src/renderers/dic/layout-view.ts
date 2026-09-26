import type {
  Dimension,
  Length,
} from '../../core/view-types'
import type { DiCViewPaint } from './compile-view'
import type { DiCViewFrame } from './draw-view'

export interface DiCLayoutConstraints {
  x?: number
  y?: number
  width: number
  height: number
}

export interface DiCViewLayout {
  frame: DiCViewFrame
  contentFrame: DiCViewFrame
}

export interface DiCLayoutOptions {
  rem?: number
}

function numericLength(
  value: Length | undefined,
  reference: number,
  rem: number,
): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value * rem

  const input = value.trim()
  if (input === '0') return 0

  if (input.endsWith('rem')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed)
      ? parsed * rem
      : undefined
  }

  if (input.endsWith('px')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed)
      ? parsed
      : undefined
  }

  if (input.endsWith('%')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed)
      ? reference * parsed / 100
      : undefined
  }

  return undefined
}

function dimension(
  value: Dimension | undefined,
  available: number,
  rem: number,
): number {
  if (value === undefined || value === 'fill') {
    return available
  }

  if (value === 'fit' || value === 'content') {
    throw new Error(
      `DiC intrinsic dimension "${value}" requires tree measurement`,
    )
  }

  return numericLength(value, available, rem) ?? available
}

function padding(
  value: Length | undefined,
  width: number,
  rem: number,
): number {
  return Math.max(0, numericLength(value, width, rem) ?? 0)
}

export function layoutDiCView(
  paint: DiCViewPaint,
  constraints: DiCLayoutConstraints,
  options: DiCLayoutOptions = {},
): DiCViewLayout {
  const rem = options.rem ?? 16
  const width = Math.max(
    0,
    dimension(paint.width, constraints.width, rem),
  )
  const height = Math.max(
    0,
    dimension(paint.height, constraints.height, rem),
  )

  const frame: DiCViewFrame = {
    x: constraints.x ?? 0,
    y: constraints.y ?? 0,
    width,
    height,
  }

  const top = padding(paint.paddingTop, width, rem)
  const right = padding(paint.paddingRight, width, rem)
  const bottom = padding(paint.paddingBottom, width, rem)
  const left = padding(paint.paddingLeft, width, rem)

  return {
    frame,
    contentFrame: {
      x: frame.x + left,
      y: frame.y + top,
      width: Math.max(0, frame.width - left - right),
      height: Math.max(0, frame.height - top - bottom),
    },
  }
}
