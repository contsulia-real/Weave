import type { CSSProperties } from 'react'
import type {
  LoadingIndicatorAnimation,
  LoadingIndicatorColor,
  LoadingIndicatorSize,
  LoadingIndicatorSpeed,
} from '../../core/loading-indicator-types'

export type LoadingIndicatorVariableStyle = CSSProperties &
  Record<`--weave-loading-${string}`, string | number | undefined>

function colorValue(value: LoadingIndicatorColor | undefined): string | undefined {
  if (value === undefined) return undefined

  if (/^[A-Za-z][A-Za-z0-9_-]*$/.test(value)) {
    return `var(--weave-color-${value}, ${value})`
  }

  return value
}

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
  color?: LoadingIndicatorColor
  speed?: LoadingIndicatorSpeed
  animation: LoadingIndicatorAnimation
  progress?: number
}): LoadingIndicatorVariableStyle {
  const output: LoadingIndicatorVariableStyle = {
    '--weave-loading-size': input.size,
    '--weave-loading-duration': speedValue(input.speed),
    '--weave-loading-animation': input.animation,
  }

  const resolvedColor = colorValue(input.color)
  if (resolvedColor !== undefined) {
    output['--weave-loading-color'] = resolvedColor
  }

  if (input.progress !== undefined) {
    output['--weave-loading-progress'] = `${input.progress * 100}%`
  }

  return output
}
