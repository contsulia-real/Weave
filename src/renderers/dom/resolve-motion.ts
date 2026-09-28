import type {
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
import {
  kebab,
  resolveMotionCurveCss,
  resolveMotionDurationCss,
  resolveMotionDurationMs,
  resolveMotionTiming,
} from './motion-runtime'
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

function properties(values: readonly string[] | undefined): string {
  if (values === undefined || values.length === 0) return 'all'
  return values.map(kebab).join(', ')
}

function preset(
  value: string,
  phase: 'enter' | 'exit',
): ViewEnterExitConfig | undefined {
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
    default:
      return undefined
  }
}

export function resolveViewEnterExitDefinition(
  value: ViewEnterExit,
  phase: 'enter' | 'exit',
): ViewEnterExitConfig {
  if (typeof value === 'string') {
    return preset(value, phase) ?? {}
  }

  const animation = value.animation === undefined
    ? undefined
    : preset(value.animation, phase)

  return {
    ...animation,
    ...value,
    from: value.from ?? animation?.from,
    to: value.to ?? animation?.to,
  } as ViewEnterExitConfig
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

  const definition = resolveViewEnterExitDefinition(value, phase)
  const timing = resolveMotionTiming(
    definition,
    theme,
    'normal',
    phase,
    true,
  )
  const delayCss = definition.delay === undefined
    ? '0ms'
    : resolveMotionDurationCss(definition.delay, theme, 'instant')
  const delayMs = definition.delay === undefined
    ? 0
    : resolveMotionDurationMs(definition.delay, theme, 'instant')

  return {
    frames: {
      ...motionStyle(definition.from, `${phase}-from`),
      ...motionStyle(definition.to, `${phase}-to`),
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
          '--weave-transition-duration': timing.durationCss,
          '--weave-transition-timing-function': timing.easing,
          '--weave-transition-delay': delayCss,
        },
    totalMilliseconds: reduceMotion
      ? 0
      : timing.durationMs + delayMs,
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
      '--weave-transition-duration': resolveMotionDurationCss(
        transition,
        theme,
        'normal',
      ),
      '--weave-transition-timing-function': resolveMotionCurveCss(
        undefined,
        theme,
        'standard',
        true,
      ),
      '--weave-transition-delay': '0ms',
    }
  }

  const timing = resolveMotionTiming(
    transition,
    theme,
    'normal',
    'standard',
    true,
  )

  return {
    '--weave-transition-property': properties(transition.properties),
    '--weave-transition-duration': timing.durationCss,
    '--weave-transition-timing-function': timing.easing,
    '--weave-transition-delay':
      transition.delay === undefined
        ? '0ms'
        : resolveMotionDurationCss(transition.delay, theme, 'instant'),
  }
}
