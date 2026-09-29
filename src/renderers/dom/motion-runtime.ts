import type {
  MotionCurve,
  MotionDirection,
  MotionDuration,
  MotionKeyframe,
  MotionSpring,
  MotionSpringValue,
  MotionStyle,
  MotionTiming,
  ViewAnimation,
  ViewAnimationConfig,
} from '../../core/motion-types'
import { solveSpring } from '../../core/spring'
import { background, color, filterValue, transformValue } from '../../core/values'
import type { ViewStyleProps } from '../../core/view-types'
import type { ResolvedTheme } from '../../theme/theme-types'

interface ResolvedMotionTiming {
  durationMs: number
  durationCss: string
  easing: string
  spring: boolean
}

export function resolveMotionDurationCss(
  value: MotionDuration | undefined,
  theme: ResolvedTheme,
  fallback: string,
): string {
  if (value === undefined) {
    return `var(--weave-motion-duration-${fallback})`
  }

  if (typeof value === 'number') return `${value}ms`

  if (Object.prototype.hasOwnProperty.call(theme.tokens.motion?.duration ?? {}, value)) {
    return `var(--weave-motion-duration-${value})`
  }

  return value
}

export function resolveMotionDurationMs(
  value: MotionDuration | undefined,
  theme: ResolvedTheme,
  fallback: string,
): number {
  const resolved =
    value === undefined
      ? theme.tokens.motion?.duration?.[fallback]
      : typeof value === 'string' &&
          Object.prototype.hasOwnProperty.call(theme.tokens.motion?.duration ?? {}, value)
        ? theme.tokens.motion?.duration?.[value]
        : value

  if (typeof resolved === 'number') return Math.max(0, resolved)
  if (typeof resolved !== 'string') return 0

  const trimmed = resolved.trim()
  if (trimmed.endsWith('ms')) {
    return Math.max(0, Number.parseFloat(trimmed) || 0)
  }
  if (trimmed.endsWith('s')) {
    return Math.max(0, (Number.parseFloat(trimmed) || 0) * 1000)
  }
  return Math.max(0, Number.parseFloat(trimmed) || 0)
}

export function resolveMotionCurveCss(
  value: MotionCurve | undefined,
  theme: ResolvedTheme,
  fallback: string,
  themeVariable = false,
): string {
  const resolvedValue = value ?? fallback

  if (typeof resolvedValue === 'string') {
    const token = theme.tokens.motion?.curve?.[resolvedValue]
    if (token !== undefined) {
      if (themeVariable) {
        return `var(--weave-motion-curve-${resolvedValue})`
      }
      return typeof token === 'string' ? token : `cubic-bezier(${token.join(', ')})`
    }
    return resolvedValue
  }

  if (Array.isArray(resolvedValue)) {
    return `cubic-bezier(${resolvedValue.join(', ')})`
  }

  const steps = resolvedValue as Exclude<MotionCurve, string | readonly number[]>
  return `steps(${steps.steps}, ${steps.position ?? 'end'})`
}

function resolveMotionSpring(value: MotionSpringValue, theme: ResolvedTheme): MotionSpring {
  if (typeof value !== 'string') return value
  return theme.tokens.motion?.spring?.[value] ?? {}
}

export function resolveMotionTiming(
  timing: MotionTiming,
  theme: ResolvedTheme,
  fallbackDuration = 'normal',
  fallbackCurve = 'standard',
  themeVariables = false,
): ResolvedMotionTiming {
  if ('spring' in timing && timing.spring !== undefined) {
    const solution = solveSpring(resolveMotionSpring(timing.spring, theme))
    return {
      durationMs: solution.durationMs,
      durationCss: `${solution.durationMs}ms`,
      easing: solution.easing,
      spring: true,
    }
  }

  return {
    durationMs: resolveMotionDurationMs(timing.duration, theme, fallbackDuration),
    durationCss: resolveMotionDurationCss(timing.duration, theme, fallbackDuration),
    easing: resolveMotionCurveCss(timing.curve, theme, fallbackCurve, themeVariables),
    spring: false,
  }
}

export function motionStyleToKeyframe(style: MotionStyle, offset?: number): Keyframe {
  const viewStyle = style as ViewStyleProps
  const output: Keyframe = {}

  if (offset !== undefined) output.offset = offset
  if (style.opacity !== undefined) output.opacity = style.opacity
  if (style.background !== undefined) {
    output.background = background(style.background)
  }
  if (style.color !== undefined) output.color = color(style.color)

  const transform = transformValue(viewStyle)
  if (transform !== undefined) output.transform = transform

  const filter = filterValue(viewStyle)
  if (filter !== undefined) output.filter = filter

  return output
}

export function motionStyleProperties(styles: readonly (MotionStyle | undefined)[]): Set<string> {
  const properties = new Set<string>()

  for (const style of styles) {
    if (style === undefined) continue
    if (style.opacity !== undefined) properties.add('opacity')
    if (style.background !== undefined) properties.add('background')
    if (style.color !== undefined) properties.add('color')
    if (
      style.translateX !== undefined ||
      style.translateY !== undefined ||
      style.scale !== undefined ||
      style.scaleX !== undefined ||
      style.scaleY !== undefined ||
      style.rotate !== undefined ||
      style.skewX !== undefined ||
      style.skewY !== undefined
    ) {
      properties.add('transform')
    }
    if (
      style.blur !== undefined ||
      style.brightness !== undefined ||
      style.contrast !== undefined ||
      style.saturate !== undefined ||
      style.grayscale !== undefined ||
      style.sepia !== undefined ||
      style.hueRotate !== undefined
    ) {
      properties.add('filter')
    }
  }

  return properties
}

function normalizedOffsets(frames: readonly MotionKeyframe[]): number[] {
  const count = frames.length
  if (count <= 1) return count === 0 ? [] : [1]

  const offsets = frames.map((frame) =>
    frame.at === undefined ? undefined : Math.max(0, Math.min(1, frame.at)),
  )
  offsets[0] ??= 0
  offsets[count - 1] ??= 1

  let anchor = 0
  while (anchor < count - 1) {
    let next = anchor + 1
    while (next < count && offsets[next] === undefined) next += 1
    if (next >= count) break

    const start = offsets[anchor] ?? 0
    const end = Math.max(start, offsets[next] ?? start)
    offsets[next] = end
    const span = next - anchor

    for (let index = anchor + 1; index < next; index += 1) {
      offsets[index] = start + ((end - start) * (index - anchor)) / span
    }
    anchor = next
  }

  return offsets.map((value, index) =>
    Math.max(index === 0 ? 0 : (offsets[index - 1] ?? 0), value ?? 1),
  )
}

export function resolveMotionKeyframes(frames: readonly MotionKeyframe[]): Keyframe[] {
  const offsets = normalizedOffsets(frames)
  return frames.map((frame, index) => {
    const { at: _at, ...style } = frame
    return motionStyleToKeyframe(style, offsets[index])
  })
}

export function resolveViewAnimation(
  animation: ViewAnimation | undefined,
  theme: ResolvedTheme,
): ViewAnimationConfig | undefined {
  if (animation === undefined) return undefined
  if (typeof animation !== 'string') return animation
  return theme.tokens.motion?.animation?.[animation]
}

export function captureComputedMotionKeyframe(
  element: HTMLElement,
  properties: ReadonlySet<string>,
): Keyframe {
  const style = getComputedStyle(element)
  const frame: Keyframe = { offset: 0 }

  if (properties.has('opacity')) frame.opacity = style.opacity
  if (properties.has('background')) frame.background = style.backgroundColor
  if (properties.has('color')) frame.color = style.color
  if (properties.has('transform')) frame.transform = style.transform
  if (properties.has('filter')) frame.filter = style.filter
  return frame
}

export function cyclePlaybackDirection(
  direction: MotionDirection | undefined,
  cycle: number,
): PlaybackDirection {
  switch (direction ?? 'normal') {
    case 'normal':
      return 'normal'
    case 'reverse':
      return 'reverse'
    case 'alternate':
      return cycle % 2 === 0 ? 'normal' : 'reverse'
    case 'alternate-reverse':
      return cycle % 2 === 0 ? 'reverse' : 'normal'
  }
}

export function totalAnimationCycles(repeat: ViewAnimationConfig['repeat']): number {
  if (repeat === 'infinite') return Number.POSITIVE_INFINITY
  if (repeat === undefined) return 1
  return Math.max(1, Math.floor(repeat) + 1)
}
