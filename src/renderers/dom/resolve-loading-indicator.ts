import type { CSSProperties } from 'react'
import type {
  LoadingIndicatorSpeed,
} from '../../core/loading-indicator-types'

export type LoadingIndicatorVariableStyle = CSSProperties &
  Record<`--weave-loading-${string}`, string | number | undefined>

export function resolveLoadingIndicatorStyle(
  speed: LoadingIndicatorSpeed | undefined,
): LoadingIndicatorVariableStyle {
  if (typeof speed !== 'number') return {}

  return {
    '--weave-loading-duration': `${speed}ms`,
  }
}

export function resolveLoadingIndicatorProgressStyle(
  progress: number,
): LoadingIndicatorVariableStyle {
  return {
    '--weave-loading-progress': `${progress * 100}%`,
  }
}
