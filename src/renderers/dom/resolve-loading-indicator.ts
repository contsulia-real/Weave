import type { CSSProperties } from 'react'
import type {
  LoadingIndicatorSpeed,
} from '../../core/loading-indicator-types'

export type LoadingIndicatorVariableStyle = CSSProperties &
  Record<`--weave-loading-${string}`, string | number | undefined>

export function resolveLoadingIndicatorStyle(input: {
  speed?: LoadingIndicatorSpeed
  progress?: number
}): LoadingIndicatorVariableStyle {
  const output: LoadingIndicatorVariableStyle = {}

  if (typeof input.speed === 'number') {
    output['--weave-loading-duration'] = `${input.speed}ms`
  }

  if (input.progress !== undefined) {
    output['--weave-loading-progress'] = `${input.progress * 100}%`
  }

  return output
}
