import type {
  MotionCurve,
  MotionDuration,
  MotionStyle,
  ViewEnterExit,
  ViewEnterExitConfig,
  ViewTransition,
} from '../../core/motion-types'
import type { ViewStyleProps } from '../../core/view-types'
import {
  background,
  color,
  filterValue,
  transformValue,
} from '../../core/values'
import type { ResolvedTheme } from '../../theme/theme-types'
import type { RuntimeStyleDeclarations } from './runtime-class'

export type ViewMotionState =
  | 'enter-from'
  | 'enter-to'
  | 'exit-from'
  | 'exit-to'

export interface ResolvedViewEnterExit {
  frames: RuntimeStyleDeclarations
  transition: RuntimeStyleDeclarations
  totalMilliseconds: number
}

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

function durationMilliseconds(
  value: MotionDuration | undefined,
  theme: ResolvedTheme,
  fallback: string,
): number {
  const resolved =
    value === undefined
      ? theme.tokens.motion?.duration?.[fallback]
      : typeof value === 'string' &&
          Object.prototype.hasOwnProperty.call(
            theme.tokens.motion?.duration ?? {},
            value,
          )
        ? theme.tokens.motion?.duration?.[value]
        : value

  if (typeof resolved === 'number') {
    return Math.max(0, resolved)
  }

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

function curve(
  value: MotionCurve | undefined,
  theme: ResolvedTheme,
  fallback: string,
): string {
  const resolvedValue = value ?? fallback

  if (typeof resolvedValue === 'string') {
    if (
      Object.prototype.hasOwnProperty.call(
        theme.tokens.motion?.curve ?? {},
        resolvedValue,
      )
    ) {
      return `var(--weave-motion-curve-${resolvedValue})`
    }
    return resolvedValue
  }

  if (Array.isArray(resolvedValue)) {
    return `cubic-bezier(${resolvedValue.join(', ')})`
  }

  const steps = resolvedValue as Exclude<
    MotionCurve,
    string | readonly number[]
  >
  return `steps(${steps.steps}, ${steps.position ?? 'end'})`
}

function properties(values: readonly string[] | undefined): string {
  if (values === undefined || values.length === 0) return 'all'
  return values.map(kebab).join(', ')
}

function preset(
  value: Exclude<ViewEnterExit, ViewEnterExitConfig>,
  phase: 'enter' | 'exit',
): ViewEnterExitConfig {
  const entering = phase === 'enter'

  switch (value) {
    case 'fade':
      return entering
        ? { from: { opacity: 0 }, to: { opacity: 1 } }
        : { from: { opacity: 1 }, to: { opacity: 0 } }
    case 'fade-up':
      return entering
        ? {
            from: { opacity: 0, translateY: 0.5 },
            to: { opacity: 1, translateY: 0 },
          }
        : {
            from: { opacity: 1, translateY: 0 },
            to: { opacity: 0, translateY: -0.5 },
          }
    case 'fade-down':
      return entering
        ? {
            from: { opacity: 0, translateY: -0.5 },
            to: { opacity: 1, translateY: 0 },
          }
        : {
            from: { opacity: 1, translateY: 0 },
            to: { opacity: 0, translateY: 0.5 },
          }
    case 'scale':
      return entering
        ? {
            from: { opacity: 0, scale: 0.96 },
            to: { opacity: 1, scale: 1 },
          }
        : {
            from: { opacity: 1, scale: 1 },
            to: { opacity: 0, scale: 0.96 },
          }
  }
}

function resolvedDefinition(
  value: ViewEnterExit,
  phase: 'enter' | 'exit',
): ViewEnterExitConfig {
  return typeof value === 'string'
    ? preset(value, phase)
    : value
}

const TRANSFORM_KEYS = new Set<keyof MotionStyle>([
  'translateX',
  'translateY',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'skewX',
  'skewY',
])

const FILTER_KEYS = new Set<keyof MotionStyle>([
  'blur',
  'brightness',
  'contrast',
  'saturate',
  'grayscale',
  'sepia',
  'hueRotate',
])

function motionProperties(
  from: MotionStyle | undefined,
  to: MotionStyle | undefined,
): string {
  const keys = new Set<keyof MotionStyle>([
    ...Object.keys(from ?? {}) as (keyof MotionStyle)[],
    ...Object.keys(to ?? {}) as (keyof MotionStyle)[],
  ])
  const output = new Set<string>()

  if (keys.has('opacity')) output.add('opacity')
  if (keys.has('background')) output.add('background')
  if (keys.has('color')) output.add('color')
  if ([...keys].some((key) => TRANSFORM_KEYS.has(key))) {
    output.add('transform')
  }
  if ([...keys].some((key) => FILTER_KEYS.has(key))) {
    output.add('filter')
  }

  return output.size === 0 ? 'all' : [...output].join(', ')
}

function setMotionVariable(
  output: Record<string, string | number | undefined>,
  state: string,
  property: string,
  value: string | number | undefined,
): void {
  if (value === undefined) return
  output[`--weave-motion-${state}-${kebab(property)}`] = value
}

function motionStyle(
  style: MotionStyle | undefined,
  state: string,
): RuntimeStyleDeclarations {
  if (style === undefined) return {}

  const output: Record<string, string | number | undefined> = {}
  const viewStyle = style as ViewStyleProps

  setMotionVariable(output, state, 'opacity', style.opacity)
  setMotionVariable(output, state, 'background', background(style.background))
  setMotionVariable(output, state, 'color', color(style.color))
  setMotionVariable(output, state, 'filter', filterValue(viewStyle))
  setMotionVariable(output, state, 'transform', transformValue(viewStyle))

  return output
}

export function resolveViewEnterExit(
  value: ViewEnterExit | undefined,
  phase: 'enter' | 'exit',
  theme: ResolvedTheme,
  reduceMotion: boolean,
): ResolvedViewEnterExit | undefined {
  if (value === undefined) return undefined

  const definition = resolvedDefinition(value, phase)
  const fromState = `${phase}-from`
  const toState = `${phase}-to`
  const durationValue = duration(definition.duration, theme, 'normal')
  const delayValue =
    definition.delay === undefined
      ? '0ms'
      : duration(definition.delay, theme, 'instant')

  return {
    frames: {
      ...motionStyle(definition.from, fromState),
      ...motionStyle(definition.to, toState),
    },
    transition: reduceMotion
      ? {
          '--weave-transition-property': 'none',
          '--weave-transition-duration': '0ms',
          '--weave-transition-timing-function': 'linear',
          '--weave-transition-delay': '0ms',
        }
      : {
          '--weave-transition-property': motionProperties(
            definition.from,
            definition.to,
          ),
          '--weave-transition-duration': durationValue,
          '--weave-transition-timing-function': curve(
            definition.curve,
            theme,
            phase,
          ),
          '--weave-transition-delay': delayValue,
        },
    totalMilliseconds: reduceMotion
      ? 0
      : durationMilliseconds(definition.duration, theme, 'normal') +
        (definition.delay === undefined
          ? 0
          : durationMilliseconds(definition.delay, theme, 'instant')),
  }
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
      '--weave-transition-timing-function': curve(
        undefined,
        theme,
        'standard',
      ),
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
    '--weave-transition-timing-function': curve(
      transition.curve,
      theme,
      'standard',
    ),
    '--weave-transition-delay':
      transition.delay === undefined
        ? '0ms'
        : duration(transition.delay, theme, 'instant'),
  }
}
