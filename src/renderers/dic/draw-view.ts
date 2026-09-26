import type {
  BackgroundValue,
  Length,
  RadiusValue,
  TransformOperation,
} from '../../core/view-types'
import type { ResolvedTheme } from '../../theme/theme-types'
import type {
  DiCViewNode,
  DiCViewPaint,
} from './compile-view'

export interface DiCViewFrame {
  x: number
  y: number
  width: number
  height: number
}

export interface DiCDrawOptions {
  theme: ResolvedTheme
  rem?: number
}

function numericLength(
  value: Length | undefined,
  rem: number,
): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value * rem

  const input = value.trim()
  if (input === '0') return 0
  if (input.endsWith('rem')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed) ? parsed * rem : undefined
  }
  if (input.endsWith('px')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function resolveRadius(
  value: RadiusValue | undefined,
  theme: ResolvedTheme,
  rem: number,
): number {
  if (value === undefined || value === 'none') return 0

  const token =
    typeof value === 'string'
      ? theme.tokens.radius?.[value]
      : undefined
  const resolved = token ?? value

  return numericLength(resolved, rem) ?? 0
}

function resolveColor(
  value: string,
  theme: ResolvedTheme,
): string {
  return theme.tokens.color?.[value] ?? value
}

function gradientColor(
  value: string,
  theme: ResolvedTheme,
): string {
  return resolveColor(value, theme)
}

function linearGradient(
  context: CanvasRenderingContext2D,
  background: Extract<BackgroundValue, { type: 'linear' }>,
  frame: DiCViewFrame,
  theme: ResolvedTheme,
): CanvasGradient {
  const radians = (background.angle ?? 180) * Math.PI / 180
  const cx = frame.width / 2
  const cy = frame.height / 2
  const radius =
    Math.abs(frame.width * Math.cos(radians)) / 2 +
    Math.abs(frame.height * Math.sin(radians)) / 2
  const dx = Math.sin(radians) * radius
  const dy = -Math.cos(radians) * radius

  const gradient = context.createLinearGradient(
    cx - dx,
    cy - dy,
    cx + dx,
    cy + dy,
  )

  for (const [color, at] of background.stops) {
    gradient.addColorStop(at, gradientColor(color, theme))
  }

  return gradient
}

function radialGradient(
  context: CanvasRenderingContext2D,
  background: Extract<BackgroundValue, { type: 'radial' }>,
  frame: DiCViewFrame,
  theme: ResolvedTheme,
): CanvasGradient {
  const cx = frame.width / 2
  const cy = frame.height / 2
  const radius = Math.hypot(frame.width, frame.height) / 2
  const gradient = context.createRadialGradient(
    cx,
    cy,
    0,
    cx,
    cy,
    radius,
  )

  for (const [color, at] of background.stops) {
    gradient.addColorStop(at, gradientColor(color, theme))
  }

  return gradient
}

function backgroundStyle(
  context: CanvasRenderingContext2D,
  background: BackgroundValue,
  frame: DiCViewFrame,
  theme: ResolvedTheme,
): string | CanvasGradient {
  if (typeof background === 'string') {
    return resolveColor(background, theme)
  }

  return background.type === 'linear'
    ? linearGradient(context, background, frame, theme)
    : radialGradient(context, background, frame, theme)
}

function angleRadians(value: number | string): number | undefined {
  if (typeof value === 'number') return value * Math.PI / 180

  const input = value.trim()
  if (input.endsWith('deg')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed)
      ? parsed * Math.PI / 180
      : undefined
  }
  if (input.endsWith('rad')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function translateLength(
  value: Length,
  rem: number,
): number {
  return numericLength(value, rem) ?? 0
}

function applyTransform(
  context: CanvasRenderingContext2D,
  operation: TransformOperation,
  rem: number,
): void {
  if ('translate' in operation) {
    context.translate(
      translateLength(operation.translate[0], rem),
      translateLength(operation.translate[1], rem),
    )
    return
  }
  if ('translateX' in operation) {
    context.translate(translateLength(operation.translateX, rem), 0)
    return
  }
  if ('translateY' in operation) {
    context.translate(0, translateLength(operation.translateY, rem))
    return
  }
  if ('rotate' in operation) {
    const radians = angleRadians(operation.rotate)
    if (radians !== undefined) context.rotate(radians)
    return
  }
  if ('skewX' in operation) {
    const radians = angleRadians(operation.skewX)
    if (radians !== undefined) {
      context.transform(1, 0, Math.tan(radians), 1, 0, 0)
    }
    return
  }
  if ('skewY' in operation) {
    const radians = angleRadians(operation.skewY)
    if (radians !== undefined) {
      context.transform(1, Math.tan(radians), 0, 1, 0, 0)
    }
    return
  }
  if ('scale' in operation) {
    context.scale(operation.scale, operation.scale)
    return
  }
  if ('scaleX' in operation) {
    context.scale(operation.scaleX, 1)
    return
  }

  context.scale(1, operation.scaleY)
}

function roundedPath(
  context: CanvasRenderingContext2D,
  frame: DiCViewFrame,
  radii: readonly [number, number, number, number],
): void {
  const maxRadius = Math.min(frame.width, frame.height) / 2
  const [topLeft, topRight, bottomRight, bottomLeft] =
    radii.map((value) => Math.min(Math.max(0, value), maxRadius)) as [
      number,
      number,
      number,
      number,
    ]

  context.beginPath()

  if (typeof context.roundRect === 'function') {
    context.roundRect(
      0,
      0,
      frame.width,
      frame.height,
      [topLeft, topRight, bottomRight, bottomLeft],
    )
    return
  }

  context.moveTo(topLeft, 0)
  context.lineTo(frame.width - topRight, 0)
  context.quadraticCurveTo(frame.width, 0, frame.width, topRight)
  context.lineTo(frame.width, frame.height - bottomRight)
  context.quadraticCurveTo(
    frame.width,
    frame.height,
    frame.width - bottomRight,
    frame.height,
  )
  context.lineTo(bottomLeft, frame.height)
  context.quadraticCurveTo(0, frame.height, 0, frame.height - bottomLeft)
  context.lineTo(0, topLeft)
  context.quadraticCurveTo(0, 0, topLeft, 0)
  context.closePath()
}

function paintView(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  theme: ResolvedTheme,
  rem: number,
): void {
  context.save()
  context.translate(frame.x, frame.y)
  context.globalAlpha *= paint.opacity ?? 1

  if (paint.transform !== undefined) {
    context.translate(frame.width / 2, frame.height / 2)
    for (const operation of paint.transform) {
      applyTransform(context, operation, rem)
    }
    context.translate(-frame.width / 2, -frame.height / 2)
  }

  if (paint.background !== undefined) {
    roundedPath(
      context,
      frame,
      [
        resolveRadius(paint.radiusTopLeft, theme, rem),
        resolveRadius(paint.radiusTopRight, theme, rem),
        resolveRadius(paint.radiusBottomRight, theme, rem),
        resolveRadius(paint.radiusBottomLeft, theme, rem),
      ],
    )
    context.fillStyle = backgroundStyle(
      context,
      paint.background,
      frame,
      theme,
    )
    context.fill()
  }

  context.restore()
}

export function drawDiCView(
  context: CanvasRenderingContext2D,
  node: DiCViewNode,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
  paintView(
    context,
    node.paint,
    frame,
    options.theme,
    options.rem ?? 16,
  )
}
