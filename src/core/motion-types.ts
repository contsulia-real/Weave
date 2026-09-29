export type MotionDuration = number | string

export type MotionCurveStepsPosition =
  | 'start'
  | 'end'
  | 'jump-start'
  | 'jump-end'
  | 'jump-none'
  | 'jump-both'

export interface MotionCurveSteps {
  steps: number
  position?: MotionCurveStepsPosition
}

export type MotionCurve = string | readonly [number, number, number, number] | MotionCurveSteps

export interface MotionSpring {
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number
  restDelta?: number
  restSpeed?: number
}

export type MotionSpringValue = MotionSpring | string

export type MotionInterruption = 'continue' | 'restart' | 'finish'

export type MotionRepeat = number | 'infinite'

export type MotionDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'

export type ReducedMotionPreference = 'system' | 'reduce' | 'no-preference'

export interface MotionStyle {
  opacity?: number
  background?: string
  color?: string
  translateX?: number | string
  translateY?: number | string
  scale?: number
  scaleX?: number
  scaleY?: number
  rotate?: number | string
  skewX?: number | string
  skewY?: number | string
  blur?: number | string
  brightness?: number
  contrast?: number
  saturate?: number
  grayscale?: number
  sepia?: number
  hueRotate?: number | string
}

export interface MotionKeyframe extends MotionStyle {
  at?: number
}

export interface MotionStaggerConfig {
  stagger: MotionDuration
  delay?: MotionDuration
  from?: 'first' | 'last' | 'center'
}

type MotionCurveTiming = {
  duration?: MotionDuration
  curve?: MotionCurve
  spring?: never
}

type MotionSpringTiming = {
  spring: MotionSpringValue
  duration?: never
  curve?: never
}

export type MotionTiming = MotionCurveTiming | MotionSpringTiming

type ViewTransitionBase = {
  properties?: readonly string[]
  delay?: MotionDuration
}

export type ViewTransitionConfig = ViewTransitionBase & MotionTiming

export type ViewTransition = MotionDuration | ViewTransitionConfig

export type ViewMotionPreset = 'fade' | 'fade-up' | 'fade-down' | 'scale'

type ViewEnterExitBase = {
  from?: MotionStyle
  to?: MotionStyle
  animation?: ViewMotionPreset | string
  delay?: MotionDuration
  stagger?: MotionDuration
  children?: MotionStaggerConfig
}

export type ViewEnterExitConfig = ViewEnterExitBase & MotionTiming

export type ViewEnterExit = ViewMotionPreset | ViewEnterExitConfig

type ViewLayoutAnimationBase = {
  interruption?: MotionInterruption
}

export type ViewLayoutAnimationConfig = ViewLayoutAnimationBase & MotionTiming

export type ViewLayoutAnimation = boolean | ViewLayoutAnimationConfig

type ViewAnimationBase = {
  keyframes: readonly MotionKeyframe[]
  delay?: MotionDuration
  repeat?: MotionRepeat
  repeatDelay?: MotionDuration
  direction?: MotionDirection
  interruption?: MotionInterruption
}

export type ViewAnimationConfig = ViewAnimationBase & MotionTiming

export type ViewAnimation = string | ViewAnimationConfig

export interface ViewMotionProps {
  transition?: ViewTransition
  enter?: ViewEnterExit
  exit?: ViewEnterExit
  animation?: ViewAnimation
  layoutAnimation?: ViewLayoutAnimation
}
