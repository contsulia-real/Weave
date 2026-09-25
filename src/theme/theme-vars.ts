import type { CSSProperties } from 'react'
import type { ThemeDefinition, ThemeScaleValue } from './theme-types'

export type ThemeVariableStyle = CSSProperties &
  Record<`--weave-${string}`, string | number | undefined>

function scale(value: ThemeScaleValue): string {
  return typeof value === 'number' ? `${value}rem` : value
}

function duration(value: number | string): string {
  return typeof value === 'number' ? `${value}ms` : value
}

function curve(value: string | readonly [number, number, number, number]): string {
  return typeof value === 'string'
    ? value
    : `cubic-bezier(${value.join(', ')})`
}

export function themeVariables(theme: ThemeDefinition): ThemeVariableStyle {
  const output: ThemeVariableStyle = {}
  const tokens = theme.tokens

  for (const [name, value] of Object.entries(tokens?.color ?? {})) {
    output[`--weave-color-${name}`] = value
  }

  for (const [name, value] of Object.entries(tokens?.typography?.size ?? {})) {
    output[`--weave-typography-size-${name}`] = scale(value)
  }

  for (const [name, value] of Object.entries(tokens?.typography?.weight ?? {})) {
    output[`--weave-typography-weight-${name}`] = value
  }

  for (const [name, value] of Object.entries(tokens?.size ?? {})) {
    output[`--weave-size-${name}`] = scale(value)
  }

  for (const [name, value] of Object.entries(tokens?.spacing ?? {})) {
    output[`--weave-spacing-${name}`] = scale(value)
  }

  for (const [name, value] of Object.entries(tokens?.radius ?? {})) {
    output[`--weave-radius-${name}`] = scale(value)
  }

  for (const [name, value] of Object.entries(tokens?.shadow ?? {})) {
    output[`--weave-shadow-${name}`] = value
  }

  for (const [name, value] of Object.entries(tokens?.motion?.duration ?? {})) {
    output[`--weave-motion-duration-${name}`] = duration(value)
  }

  for (const [name, value] of Object.entries(tokens?.motion?.curve ?? {})) {
    output[`--weave-motion-curve-${name}`] = curve(value)
  }

  for (const [name, value] of Object.entries(theme.layers ?? {})) {
    output[`--weave-layer-${name}`] = value
  }

  return output
}
