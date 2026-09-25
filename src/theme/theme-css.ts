import type { CSSProperties } from 'react'
import type { ResolvedTheme, ThemeTokens } from './theme-types'

export type ThemeVariableStyle = CSSProperties &
  Record<`--weave-${string}`, string | number>

const toRem = (value: number | string) =>
  typeof value === 'number' ? `${value}rem` : value

const toMs = (value: number | string) =>
  typeof value === 'number' ? `${value}ms` : value

const toCurve = (
  value: string | readonly [number, number, number, number],
) => (typeof value === 'string' ? value : `cubic-bezier(${value.join(', ')})`)

function assignRecord(
  output: ThemeVariableStyle,
  prefix: string,
  values: Readonly<Record<string, string | number>> | undefined,
  convert: (value: string | number) => string | number = (value) => value,
): void {
  if (values === undefined) return

  for (const [name, value] of Object.entries(values)) {
    output[`--weave-${prefix}-${name}`] = convert(value)
  }
}

export function themeTokenVariables(tokens: ThemeTokens): ThemeVariableStyle {
  const output: ThemeVariableStyle = {}

  assignRecord(output, 'color', tokens.color)
  assignRecord(output, 'size', tokens.size, toRem)
  assignRecord(output, 'spacing', tokens.spacing, toRem)
  assignRecord(output, 'radius', tokens.radius, toRem)
  assignRecord(output, 'shadow', tokens.shadow)

  assignRecord(output, 'typography-size', tokens.typography?.size, toRem)
  assignRecord(output, 'typography-weight', tokens.typography?.weight)

  assignRecord(output, 'motion-duration', tokens.motion?.duration, toMs)

  if (tokens.motion?.curve !== undefined) {
    for (const [name, value] of Object.entries(tokens.motion.curve)) {
      output[`--weave-motion-curve-${name}`] = toCurve(value)
    }
  }

  return output
}

export function themeVariables(theme: ResolvedTheme): ThemeVariableStyle {
  const output = themeTokenVariables(theme.tokens)

  for (const [name, value] of Object.entries(theme.layers)) {
    output[`--weave-layer-${name}`] = value
  }

  return output
}

export function themeVariableDeclarations(theme: ResolvedTheme): string {
  return Object.entries(themeVariables(theme))
    .map(([name, value]) => `${name}: ${String(value)};`)
    .join('')
}
