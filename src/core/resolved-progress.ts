import type {
  ProgressColor,
  ProgressMode,
  ProgressSize,
  ProgressSpeed,
} from './progress-types'

export interface ResolvedProgress {
  undetermined: boolean
  progress?: number
  mode: ProgressMode
  tracked: boolean
  size: ProgressSize
  color: ProgressColor
  speed: ProgressSpeed
}

export function resolveProgress(input: {
  undetermined: boolean
  progress?: number
  mode?: ProgressMode
  tracked?: boolean
  size?: ProgressSize
  color?: ProgressColor
  speed?: ProgressSpeed
}): ResolvedProgress {
  return {
    undetermined: input.undetermined,
    progress:
      input.undetermined
        ? undefined
        : Math.min(
            1,
            Math.max(
              0,
              input.progress ?? 0,
            ),
          ),
    mode: input.mode ?? 'spin',
    tracked: input.tracked ?? false,
    size: input.size ?? 'medium',
    color: input.color ?? 'primary',
    speed: input.speed ?? 'normal',
  }
}
