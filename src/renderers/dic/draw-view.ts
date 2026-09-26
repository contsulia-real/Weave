import type {
  BackgroundValue,
  Length,
  RadiusValue,
  ShadowDefinition,
  ShadowValue,
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
import { applyDiCTransform } from './transform'
import { resolveDiCColor } from './color'

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

function gradientColor(
  value: string,
  theme: ResolvedTheme,
): string {
  return resolveDiCColor(value, theme)
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
    return resolveDiCColor(background, theme)
  }

  return background.type === 'linear'
    ? linearGradient(context, background, frame, theme)
    : radialGradient(context, background, frame, theme)
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
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      [topLeft, topRight, bottomRight, bottomLeft],
    )
    return
  }

  const x = frame.x
  const y = frame.y
  const right = x + frame.width
  const bottom = y + frame.height

  context.moveTo(x + topLeft, y)
  context.lineTo(right - topRight, y)
  context.quadraticCurveTo(
    right,
    y,
    right,
    y + topRight,
  )
  context.lineTo(
    right,
    bottom - bottomRight,
  )
  context.quadraticCurveTo(
    right,
    bottom,
    right - bottomRight,
    bottom,
  )
  context.lineTo(x + bottomLeft, bottom)
  context.quadraticCurveTo(
    x,
    bottom,
    x,
    bottom - bottomLeft,
  )
  context.lineTo(x, y + topLeft)
  context.quadraticCurveTo(
    x,
    y,
    x + topLeft,
    y,
  )
  context.closePath()
}

function viewRadii(
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  theme: ResolvedTheme,
  rem: number,
): readonly [number, number, number, number] {
  const reference = Math.min(
    frame.width,
    frame.height,
  )

  return [
    resolveRadius(
      paint.radiusTopLeft,
      theme,
      rem,
      reference,
    ),
    resolveRadius(
      paint.radiusTopRight,
      theme,
      rem,
      reference,
    ),
    resolveRadius(
      paint.radiusBottomRight,
      theme,
      rem,
      reference,
    ),
    resolveRadius(
      paint.radiusBottomLeft,
      theme,
      rem,
      reference,
    ),
  ]
}

function parseShadowToken(
  value: string,
): ShadowDefinition {
  if (value.includes('inset')) {
    throw new Error(
      `Inset DiC shadow is not implemented: "${value}"`,
    )
  }

  const match = value.trim().match(
    /^(-?(?:\d+(?:\.\d+)?|\.\d+)(?:rem|px)?)\s+(-?(?:\d+(?:\.\d+)?|\.\d+)(?:rem|px)?)\s+(-?(?:\d+(?:\.\d+)?|\.\d+)(?:rem|px)?)(?:\s+(-?(?:\d+(?:\.\d+)?|\.\d+)(?:rem|px)?))?\s+(.+)$/,
  )

  if (match === null) {
    throw new Error(
      `Unsupported DiC shadow token "${value}"`,
    )
  }

  return {
    x: match[1],
    y: match[2],
    blur: match[3],
    spread: match[4] ?? 0,
    color: match[5],
  }
}

function shadowDefinitions(
  value: ShadowValue | undefined,
  theme: ResolvedTheme,
): readonly ShadowDefinition[] {
  if (value === undefined || value === 'none') {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'object') {
    return [value]
  }

  const token = theme.tokens.shadow?.[value]
  if (token === undefined) {
    throw new Error(
      `Unknown DiC shadow token "${value}"`,
    )
  }

  return [parseShadowToken(token)]
}

function shadowLength(
  value: Length | undefined,
  rem: number,
): number {
  if (value === undefined) return 0

  const resolved = numericLength(
    value,
    rem,
  )
  if (resolved === undefined) {
    throw new Error(
      `Unsupported DiC shadow length "${String(value)}"`,
    )
  }

  return resolved
}

function drawViewShadow(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
  const definitions = shadowDefinitions(
    paint.shadow,
    options.theme,
  )
  if (
    definitions.length === 0 ||
    paint.background === undefined
  ) {
    return
  }

  const rem = options.rem ?? 16
  const radii = viewRadii(
    paint,
    frame,
    options.theme,
    rem,
  )

  for (const shadow of definitions) {
    const spread = shadowLength(
      shadow.spread,
      rem,
    )
    const shadowFrame: DiCViewFrame = {
      x: -spread,
      y: -spread,
      width: frame.width + spread * 2,
      height: frame.height + spread * 2,
    }

    context.save()
    context.shadowOffsetX = shadowLength(
      shadow.x,
      rem,
    )
    context.shadowOffsetY = shadowLength(
      shadow.y,
      rem,
    )
    context.shadowBlur = shadowLength(
      shadow.blur,
      rem,
    )
    context.shadowColor = resolveDiCColor(
      shadow.color ?? 'rgb(0 0 0 / 0.2)',
      options.theme,
    )
    context.globalAlpha *= shadow.opacity ?? 1
    context.fillStyle = '#000'

    roundedPath(
      context,
      shadowFrame,
      radii.map(
        (radius) => Math.max(0, radius + spread),
      ) as [number, number, number, number],
    )
    context.fill()
    context.restore()
  }
}

function uniformBorder(
  paint: DiCViewPaint,
  rem: number,
): {
  width: number
  color?: string
} | undefined {
  const widths = [
    paint.borderTop,
    paint.borderRight,
    paint.borderBottom,
    paint.borderLeft,
  ].map((value) =>
    value === undefined
      ? 0
      : numericLength(value, rem),
  )

  if (widths.some((value) => value === undefined)) {
    throw new Error(
      'Unsupported DiC border width',
    )
  }

  const numericWidths = widths as number[]
  if (numericWidths.every((value) => value === 0)) {
    return undefined
  }

  if (
    numericWidths.some(
      (value) => value !== numericWidths[0],
    )
  ) {
    throw new Error(
      'Asymmetric DiC borders are not implemented yet',
    )
  }

  const colors = [
    paint.borderTopColor,
    paint.borderRightColor,
    paint.borderBottomColor,
    paint.borderLeftColor,
  ].filter(
    (value): value is string =>
      value !== undefined,
  )

  if (
    colors.some(
      (value) => value !== colors[0],
    )
  ) {
    throw new Error(
      'Asymmetric DiC border colors are not implemented yet',
    )
  }

  return {
    width: numericWidths[0] ?? 0,
    color: colors[0],
  }
}

function drawViewBorder(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
  const rem = options.rem ?? 16
  const border = uniformBorder(
    paint,
    rem,
  )
  if (border === undefined) return

  if (
    paint.borderStyle !== undefined &&
    paint.borderStyle !== 'solid'
  ) {
    throw new Error(
      `Unsupported DiC border style "${paint.borderStyle}"`,
    )
  }

  const half = border.width / 2
  const borderFrame: DiCViewFrame = {
    x: half,
    y: half,
    width: Math.max(
      0,
      frame.width - border.width,
    ),
    height: Math.max(
      0,
      frame.height - border.width,
    ),
  }
  const radii = viewRadii(
    paint,
    frame,
    options.theme,
    rem,
  ).map(
    (radius) => Math.max(0, radius - half),
  ) as [number, number, number, number]

  roundedPath(
    context,
    borderFrame,
    radii,
  )
  context.lineWidth = border.width
  context.strokeStyle = resolveDiCColor(
    border.color ?? 'currentColor',
    options.theme,
  )
  context.stroke()
}

function drawViewOutline(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
  if (paint.outlineWidth === undefined) return

  const rem = options.rem ?? 16
  const width = numericLength(
    paint.outlineWidth,
    rem,
  )
  if (width === undefined || width <= 0) return

  if (
    paint.outlineStyle !== undefined &&
    paint.outlineStyle !== 'solid'
  ) {
    throw new Error(
      `Unsupported DiC outline style "${paint.outlineStyle}"`,
    )
  }

  const offset =
    numericLength(
      paint.outlineOffset,
      rem,
    ) ?? 0
  const expand = offset + width / 2
  const outlineFrame: DiCViewFrame = {
    x: -expand,
    y: -expand,
    width: frame.width + expand * 2,
    height: frame.height + expand * 2,
  }
  const radii = viewRadii(
    paint,
    frame,
    options.theme,
    rem,
  ).map(
    (radius) => Math.max(0, radius + expand),
  ) as [number, number, number, number]

  roundedPath(
    context,
    outlineFrame,
    radii,
  )
  context.lineWidth = width
  context.strokeStyle = resolveDiCColor(
    paint.outlineColor ?? 'currentColor',
    options.theme,
  )
  context.stroke()
}

function applyViewContext(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  rem: number,
): void {
  context.globalAlpha *= paint.opacity ?? 1

  applyDiCTransform(
    context,
    paint.transform,
    frame,
    rem,
  )
}

function clipViewBounds(
  context: CanvasRenderingContext2D,
  paint: DiCViewPaint,
  frame: DiCViewFrame,
  options: DiCDrawOptions,
): void {
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
    viewRadii(
      paint,
      frame,
      theme,
      rem,
    ),
  )
  context.clip()
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
  drawViewShadow(context, paint, frame, options)
  drawViewBackground(context, paint, frame, options)
  drawViewBorder(context, paint, frame, options)
  drawViewOutline(context, paint, frame, options)
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
  drawViewShadow(
    context,
    layout.paint,
    layout.frame,
    options,
  )
  drawViewBackground(
    context,
    layout.paint,
    layout.frame,
    options,
  )
  drawViewBorder(
    context,
    layout.paint,
    layout.frame,
    options,
  )
  drawViewOutline(
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
    context.save()
    clipViewBounds(
      context,
      layout.paint,
      layout.frame,
      options,
    )
    drawDiCImage(
      context,
      layout.node.content,
      layout.contentFrame,
      {
        imageResources: options.imageResources,
        rem,
      },
    )
    context.restore()
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
