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

export interface ViewTransitionConfig {
  properties?: readonly string[]
  duration?: MotionDuration
  delay?: MotionDuration
  curve?: MotionCurve
}

export type ViewTransition =
  | MotionDuration
  | ViewTransitionConfig

export interface ViewMotionProps {
  transition?: ViewTransition
}
