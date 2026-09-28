import type {
  MotionCurve,
  MotionDuration,
  ViewTransition,
} from '../../core/motion-types'
import type { ResolvedTheme } from '../../theme/theme-types'
import type { RuntimeStyleDeclarations } from './runtime-class'

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (letter) =>
    `-${letter.toLowerCase()}`,
  )
}

function duration(
  value: MotionDuration | undefined,
  theme: ResolvedTheme,
  fallback: string,
): string {
  if (value === undefined) {
    return `var(--weave-motion-duration-${fallback})`
  }

  if (typeof value === 'number') {
    return `${value}ms`
  }

  if (
    Object.prototype.hasOwnProperty.call(
      theme.tokens.motion?.duration ?? {},
      value,
    )
  ) {
    return `var(--weave-motion-duration-${value})`
  }

  return value
}

function curve(
  value: MotionCurve | undefined,
  theme: ResolvedTheme,
): string {
  if (value === undefined) {
    return 'var(--weave-motion-curve-standard)'
  }

  if (typeof value === 'string') {
    if (
      Object.prototype.hasOwnProperty.call(
        theme.tokens.motion?.curve ?? {},
        value,
      )
    ) {
      return `var(--weave-motion-curve-${value})`
    }
    return value
  }

  if (Array.isArray(value)) {
    return `cubic-bezier(${value.join(', ')})`
  }

  const steps = value as Exclude<MotionCurve, string | readonly number[]>
  return `steps(${steps.steps}, ${steps.position ?? 'end'})`
}

function properties(values: readonly string[] | undefined): string {
  if (values === undefined || values.length === 0) return 'all'
  return values.map(kebab).join(', ')
}

export function resolveViewTransition(
  transition: ViewTransition | undefined,
  theme: ResolvedTheme,
  reduceMotion: boolean,
): RuntimeStyleDeclarations | undefined {
  if (reduceMotion) {
    return {
      '--weave-transition-property': 'none',
      '--weave-transition-duration': '0ms',
      '--weave-transition-timing-function': 'linear',
      '--weave-transition-delay': '0ms',
    }
  }

  if (transition === undefined) return undefined

  if (
    typeof transition === 'string' ||
    typeof transition === 'number'
  ) {
    return {
      '--weave-transition-property': 'all',
      '--weave-transition-duration': duration(transition, theme, 'normal'),
      '--weave-transition-timing-function': curve(undefined, theme),
      '--weave-transition-delay': '0ms',
    }
  }

  return {
    '--weave-transition-property': properties(transition.properties),
    '--weave-transition-duration': duration(
      transition.duration,
      theme,
      'normal',
    ),
    '--weave-transition-timing-function': curve(transition.curve, theme),
    '--weave-transition-delay':
      transition.delay === undefined
        ? '0ms'
        : duration(transition.delay, theme, 'instant'),
  }
}
