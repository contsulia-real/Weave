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

export type MotionCurve =
  | string
  | readonly [number, number, number, number]
  | MotionCurveSteps

export type ReducedMotionPreference =
  | 'system'
  | 'reduce'
  | 'no-preference'

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

export interface ViewTransitionConfig {
  properties?: readonly string[]
  duration?: MotionDuration
  delay?: MotionDuration
  curve?: MotionCurve
}

export type ViewTransition =
  | MotionDuration
  | ViewTransitionConfig

export type ViewMotionPreset =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'scale'

export interface ViewEnterExitConfig {
  from?: MotionStyle
  to?: MotionStyle
  duration?: MotionDuration
  delay?: MotionDuration
  curve?: MotionCurve
}

export type ViewEnterExit =
  | ViewMotionPreset
  | ViewEnterExitConfig

export interface ViewLayoutAnimationConfig {
  duration?: MotionDuration
  curve?: MotionCurve
}

export type ViewLayoutAnimation =
  | boolean
  | ViewLayoutAnimationConfig

export interface ViewMotionProps {
  transition?: ViewTransition
  enter?: ViewEnterExit
  exit?: ViewEnterExit
  layoutAnimation?: ViewLayoutAnimation
}
