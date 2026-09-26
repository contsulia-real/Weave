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
import type { DiCViewTreeLayout } from './layout-tree'
import { drawDiCText } from './draw-text'
import { drawDiCImage } from './draw-image'
import type { DiCImageResourceManager } from './image-resource'

export interface DiCViewFrame {
  x: number
  y: number
  width: number
  height: number
}

export interface DiCDrawOptions {
  theme: ResolvedTheme
  rem?: number
  viewportWidth?: number
  imageResources?: DiCImageResourceManager
}

function numericLength(
  value: Length | undefined,
  rem: number,
  reference?: number,
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
  if (input.endsWith('%') && reference !== undefined) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed)
      ? reference * parsed / 100
      : undefined
  }

  return undefined
}

function resolveRadius(
  value: RadiusValue | undefined,
  theme: ResolvedTheme,
  rem: number,
  reference: number,
): number {
  if (value === undefined || value === 'none') return 0

  const token =
    typeof value === 'string'
      ? theme.tokens.radius?.[value]
      : undefined
  const resolved = token ?? value

  const numeric = numericLength(resolved, rem, reference)
  if (numeric === undefined) {
    throw new Error(
      `Unsupported DiC radius "${String(value)}"`,
    )
  }

  return numeric
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

function angleRadians(value: number | string): number {
  if (typeof value === 'number') return value * Math.PI / 180

  const input = value.trim()
  if (input.endsWith('deg')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) {
      return parsed * Math.PI / 180
    }
  }
  if (input.endsWith('rad')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) return parsed
  }

  throw new Error(
    `Unsupported DiC angle "${String(value)}"`,
  )
}

function translateLength(
  value: Length,
  rem: number,
  reference: number,
): number {
  const numeric = numericLength(value, rem, reference)
  if (numeric === undefined) {
    throw new Error(
      `Unsupported DiC transform length "${String(value)}"`,
    )
  }

  return numeric
}

function applyTransform(
  context: CanvasRenderingContext2D,
  operation: TransformOperation,
  rem: number,
  frame: DiCViewFrame,
): void {
  if ('translate' in operation) {
    context.translate(
      translateLength(operation.translate[0], rem, frame.width),
      translateLength(operation.translate[1], rem, frame.height),
    )
    return
  }
  if ('translateX' in operation) {
    context.translate(
      translateLength(operation.translateX, rem, frame.width),
      0,
    )
    return
  }
  if ('translateY' in operation) {
    context.translate(
      0,
      translateLength(operation.translateY, rem, frame.height),
    )
    return
  }
  if ('rotate' in operation) {
    context.rotate(angleRadians(operation.rotate))
    return
  }
  if ('skewX' in operation) {
    const radians = angleRadians(operation.skewX)
    context.transform(1, 0, Math.tan(radians), 1, 0, 0)
    return
  }
  if ('skewY' in operation) {
    const radians = angleRadians(operation.skewY)
    context.transform(1, Math.tan(radians), 0, 1, 0, 0)
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

function applyViewContext(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  rem: number,
): void {
  context.globalAlpha *= paint.opacity ?? 1

  if (paint.transform === undefined) return

  context.translate(frame.width / 2, frame.height / 2)
  for (const operation of paint.transform) {
    applyTransform(context, operation, rem, frame)
  }
  context.translate(-frame.width / 2, -frame.height / 2)
}

function drawViewBackground(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
  if (paint.background === undefined) return

  const theme = options.theme
  const rem = options.rem ?? 16
  const localFrame: DiCViewFrame = {
    x: 0,
    y: 0,
    width: frame.width,
    height: frame.height,
  }

  roundedPath(
    context,
    localFrame,
    [
      resolveRadius(
        paint.radiusTopLeft,
        theme,
        rem,
        Math.min(frame.width, frame.height),
      ),
      resolveRadius(
        paint.radiusTopRight,
        theme,
        rem,
        Math.min(frame.width, frame.height),
      ),
      resolveRadius(
        paint.radiusBottomRight,
        theme,
        rem,
        Math.min(frame.width, frame.height),
      ),
      resolveRadius(
        paint.radiusBottomLeft,
        theme,
        rem,
        Math.min(frame.width, frame.height),
      ),
    ],
  )
  context.fillStyle = backgroundStyle(
    context,
    paint.background,
    localFrame,
    theme,
  )
  context.fill()
}

export function drawDiCViewPaint(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
  const rem = options.rem ?? 16

  context.save()
  context.translate(frame.x, frame.y)
  applyViewContext(context, paint, frame, rem)
  drawViewBackground(context, paint, frame, options)
  context.restore()
}

export function drawDiCView(
  context: CanvasRenderingContext2D,
  node: DiCViewNode,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
  drawDiCViewPaint(
    context,
    node.paint,
    frame,
    options,
  )
}

export function drawDiCViewTree(
  context: CanvasRenderingContext2D,
  layout: DiCViewTreeLayout,
  options: DiCDrawOptions,
): void {
  const rem = options.rem ?? 16

  context.save()
  context.translate(
    layout.frame.x,
    layout.frame.y,
  )
  applyViewContext(
    context,
    layout.paint,
    layout.frame,
    rem,
  )
  drawViewBackground(
    context,
    layout.paint,
    layout.frame,
    options,
  )

  if (
    layout.node.content?.kind === 'text' &&
    layout.typography !== undefined
  ) {
    drawDiCText(
      context,
      layout.node.content,
      layout.contentFrame,
      {
        theme: options.theme,
        typography: layout.typography,
        viewportWidth:
          options.viewportWidth ??
          layout.frame.width,
        containerWidth: layout.contentFrame.width,
        rem,
      },
    )
  }

  if (layout.node.content?.kind === 'image') {
    drawDiCImage(
      context,
      layout.node.content,
      layout.contentFrame,
      {
        imageResources: options.imageResources,
        rem,
      },
    )
  }

  for (const child of layout.children) {
    drawDiCViewTree(
      context,
      child,
      options,
    )
  }

  context.restore()
}
