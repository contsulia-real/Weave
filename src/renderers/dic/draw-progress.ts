import type { ProgressSpeed } from '../../core/progress-types'
import type { ResolvedProgress } from '../../core/resolved-progress'
import type { ResolvedTheme, ThemeScaleValue } from '../../theme/theme-types'
import type { DiCProgressContent } from './compile-view'
import type { DiCViewFrame } from './draw-view'
import { resolveDiCColor } from './color'

export interface DiCProgressDrawEnvironment {
  theme: ResolvedTheme
  rem: number
  time: number
  reducedMotion: boolean
  color?: string
}

function scalarMilliseconds(
  value: ThemeScaleValue | undefined,
): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value

  const input = value.trim()

  if (input.endsWith('ms')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed)
      ? parsed
      : undefined
  }

  if (input.endsWith('s')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed)
      ? parsed * 1000
      : undefined
  }

  const parsed = Number.parseFloat(input)
  return Number.isFinite(parsed)
    ? parsed
    : undefined
}

function semanticDuration(
  speed: Exclude<ProgressSpeed, number>,
  theme: ResolvedTheme,
): number {
  const token =
    theme.tokens.motion?.duration?.[speed]

  return scalarMilliseconds(token) ??
    (
      speed === 'fast'
        ? 120
        : speed === 'slow'
          ? 320
          : 200
    )
}

export function progressDuration(
  progress: ResolvedProgress,
  theme: ResolvedTheme,
): number {
  if (typeof progress.speed === 'number') {
    return Math.max(1, progress.speed)
  }

  const base = semanticDuration(
    progress.speed,
    theme,
  )

  if (!progress.undetermined) {
    return base
  }

  return base * (
    progress.speed === 'slow'
      ? 6
      : progress.speed === 'fast'
        ? 9
        : 8
  )
}

function phase(
  time: number,
  duration: number,
): number {
  const safe = Math.max(1, duration)
  return ((time % safe) + safe) % safe / safe
}

function progressColor(
  progress: ResolvedProgress,
  environment: DiCProgressDrawEnvironment,
): string {
  return resolveDiCColor(
    progress.color,
    environment.theme,
    environment.color,
  )
}

function trackColor(
  progress: ResolvedProgress,
  environment: DiCProgressDrawEnvironment,
): string {
  const color = progressColor(
    progress,
    environment,
  )
  const token =
    environment.theme.components.Progress?.base
      ?.trackColor

  return token === undefined
    ? color
    : resolveDiCColor(
        token,
        environment.theme,
        color,
      )
}

function thickness(
  progress: ResolvedProgress,
  environment: DiCProgressDrawEnvironment,
): number {
  const sized =
    environment.theme.components.Progress?.sizes?.[
      progress.size
    ]
  const value = sized?.spinThickness

  if (value === undefined) {
    return environment.rem * 0.15625
  }

  if (typeof value === 'number') {
    return value * environment.rem
  }

  const input = value.trim()
  if (input.endsWith('rem')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) {
      return parsed * environment.rem
    }
  }
  if (input.endsWith('px')) {
    const parsed = Number.parseFloat(input)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  throw new Error(
    `Unsupported DiC Progress thickness "${value}"`,
  )
}

function drawSpin(
  context: CanvasRenderingContext2D,
  progress: ResolvedProgress,
  frame: DiCViewFrame,
  environment: DiCProgressDrawEnvironment,
): void {
  const cx = frame.x + frame.width / 2
  const cy = frame.y + frame.height / 2
  const lineWidth = thickness(
    progress,
    environment,
  )
  const radius = Math.max(
    0,
    Math.min(frame.width, frame.height) / 2 -
      lineWidth / 2,
  )
  const start = -Math.PI / 2

  context.save()
  context.lineWidth = lineWidth
  context.lineCap = 'butt'

  if (progress.tracked) {
    context.beginPath()
    context.strokeStyle = trackColor(
      progress,
      environment,
    )
    context.arc(
      cx,
      cy,
      radius,
      0,
      Math.PI * 2,
    )
    context.stroke()
  }

  const color = progressColor(
    progress,
    environment,
  )
  context.beginPath()
  context.strokeStyle = color

  if (progress.undetermined) {
    const rotation =
      environment.reducedMotion
        ? 0
        : phase(
            environment.time,
            progressDuration(
              progress,
              environment.theme,
            ),
          ) * Math.PI * 2

    context.arc(
      cx,
      cy,
      radius,
      start + rotation,
      start + rotation + 96 * Math.PI / 180,
    )
  } else {
    context.arc(
      cx,
      cy,
      radius,
      start,
      start +
        (progress.progress ?? 0) *
          Math.PI *
          2,
    )
  }

  context.stroke()
  context.restore()
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const radius = Math.max(
    0,
    Math.min(width, height) / 2,
  )
  context.beginPath()

  if (typeof context.roundRect === 'function') {
    context.roundRect(
      x,
      y,
      width,
      height,
      radius,
    )
    return
  }

  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius,
  )
  context.lineTo(
    x + width,
    y + height - radius,
  )
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  )
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius,
  )
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(
    x,
    y,
    x + radius,
    y,
  )
  context.closePath()
}

function fillSegment(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
): void {
  if (width <= 0 || height <= 0) return

  roundedRect(
    context,
    x,
    y,
    width,
    height,
  )
  context.fillStyle = color
  context.fill()
}

function leadingOffset(
  progress: number,
  segmentWidth: number,
): number {
  return (
    -1.2 +
    progress * 4.8
  ) * segmentWidth
}

function trailingOffset(
  progress: number,
  segmentWidth: number,
): number {
  if (progress < 0.5) {
    return (
      1.2 +
      (progress / 0.5) * 2.4
    ) * segmentWidth
  }

  return (
    -1.2 +
    ((progress - 0.5) / 0.5) * 2.4
  ) * segmentWidth
}

function drawLinear(
  context: CanvasRenderingContext2D,
  progress: ResolvedProgress,
  frame: DiCViewFrame,
  environment: DiCProgressDrawEnvironment,
): void {
  const color = progressColor(
    progress,
    environment,
  )

  context.save()
  roundedRect(
    context,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  )
  context.clip()

  if (progress.tracked) {
    fillSegment(
      context,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      trackColor(
        progress,
        environment,
      ),
    )
  }

  if (!progress.undetermined) {
    fillSegment(
      context,
      frame.x,
      frame.y,
      frame.width *
        (progress.progress ?? 0),
      frame.height,
      color,
    )
    context.restore()
    return
  }

  const segmentWidth = frame.width * 0.42

  if (environment.reducedMotion) {
    fillSegment(
      context,
      frame.x +
        0.7 * segmentWidth,
      frame.y,
      segmentWidth,
      frame.height,
      color,
    )
    context.restore()
    return
  }

  const animationPhase = phase(
    environment.time,
    progressDuration(
      progress,
      environment.theme,
    ),
  )

  fillSegment(
    context,
    frame.x +
      leadingOffset(
        animationPhase,
        segmentWidth,
      ),
    frame.y,
    segmentWidth,
    frame.height,
    color,
  )
  fillSegment(
    context,
    frame.x +
      trailingOffset(
        animationPhase,
        segmentWidth,
      ),
    frame.y,
    segmentWidth,
    frame.height,
    color,
  )

  context.restore()
}

export function drawDiCProgress(
  context: CanvasRenderingContext2D,
  content: DiCProgressContent,
  frame: DiCViewFrame,
  environment: DiCProgressDrawEnvironment,
): void {
  if (
    frame.width <= 0 ||
    frame.height <= 0
  ) {
    return
  }

  if (content.progress.mode === 'spin') {
    drawSpin(
      context,
      content.progress,
      frame,
      environment,
    )
    return
  }

  drawLinear(
    context,
    content.progress,
    frame,
    environment,
  )
}
