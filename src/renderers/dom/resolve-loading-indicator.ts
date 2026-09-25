import type { CSSProperties } from 'react'
import type {
  LoadingIndicatorAnimation,
  LoadingIndicatorSize,
  LoadingIndicatorSpeed,
} from '../../core/loading-indicator-types'

export type LoadingIndicatorVariableStyle = CSSProperties &
  Record<`--weave-loading-${string}`, string | number | undefined>

function speedValue(value: LoadingIndicatorSpeed | undefined): string {
  if (value === undefined) {
    return 'var(--weave-motion-duration-normal)'
  }

  if (typeof value === 'number') {
    return `${value}ms`
  }

  return `var(--weave-motion-duration-${value})`
}

export function resolveLoadingIndicatorStyle(input: {
  size: LoadingIndicatorSize
  speed?: LoadingIndicatorSpeed
  animation: LoadingIndicatorAnimation
  progress?: number
}): LoadingIndicatorVariableStyle {
  const output: LoadingIndicatorVariableStyle = {
    '--weave-loading-duration': speedValue(input.speed),
  }

  if (input.progress !== undefined) {
    output['--weave-loading-progress'] = `${input.progress * 100}%`
  }

  return output
}
