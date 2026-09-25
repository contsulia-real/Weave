import type { CSSProperties } from 'react'
import type { ProgressSpeed } from '../../core/progress-types'

export type ProgressVariableStyle = CSSProperties &
  Record<`--weave-progress-${string}`, string | number | undefined>

export function resolveProgressStyle(
  speed: ProgressSpeed | undefined,
): ProgressVariableStyle {
  if (typeof speed !== 'number') return {}

  return {
    '--weave-progress-duration': `${speed}ms`,
  }
}

export function resolveProgressValueStyle(
  progress: number,
): ProgressVariableStyle {
  return {
    '--weave-progress-value': `${progress * 100}%`,
  }
}
