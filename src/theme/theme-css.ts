import type { CSSProperties } from 'react'
import type {
  ResolvedTheme,
  ThemeTypographyStyle,
  ThemeTokens,
} from './theme-types'

export type ThemeVariableStyle = CSSProperties &
  Record<`--weave-${string}`, string | number>

const toRem = (value: number | string) =>
  typeof value === 'number' ? `${value}rem` : value

const toMs = (value: number | string) =>
  typeof value === 'number' ? `${value}ms` : value

const toCurve = (
  value: string | readonly [number, number, number, number],
) => (typeof value === 'string' ? value : `cubic-bezier(${value.join(', ')})`)

export type TypographyStyleProperty =
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'letterSpacing'

const toKebab = (value: string) =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

export function typographyStyleVariableName(
  typo: string,
  property: TypographyStyleProperty,
): `--weave-typography-style-${string}` {
  return `--weave-typography-style-${typo}-${toKebab(property)}`
}

export function typographyStyleVariableReference(
  typo: string | undefined,
  property: TypographyStyleProperty,
): string | undefined {
  return typo === undefined
    ? undefined
    : `var(${typographyStyleVariableName(typo, property)})`
}

function typographyStyleVariables(
  output: ThemeVariableStyle,
  name: string,
  style: ThemeTypographyStyle,
): void {
  if (style.fontSize !== undefined) {
    output[typographyStyleVariableName(name, 'fontSize')] =
      toRem(style.fontSize)
  }
  if (style.fontWeight !== undefined) {
    output[typographyStyleVariableName(name, 'fontWeight')] =
      style.fontWeight
  }
  if (style.lineHeight !== undefined) {
    output[typographyStyleVariableName(name, 'lineHeight')] =
      style.lineHeight
  }
  if (style.letterSpacing !== undefined) {
    output[typographyStyleVariableName(name, 'letterSpacing')] =
      toRem(style.letterSpacing)
  }
}

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

  if (tokens.feedback !== undefined) {
    const feedback = tokens.feedback

    if (feedback.restDepth !== undefined) {
      output['--weave-feedback-rest-depth'] = toRem(feedback.restDepth)
    }
    if (feedback.hoverDepth !== undefined) {
      output['--weave-feedback-hover-depth'] = toRem(feedback.hoverDepth)
    }
    if (feedback.hoverLift !== undefined) {
      output['--weave-feedback-hover-lift'] = toRem(feedback.hoverLift)
    }
    if (feedback.pressDepth !== undefined) {
      output['--weave-feedback-press-depth'] = toRem(feedback.pressDepth)
    }
    if (feedback.pressOffset !== undefined) {
      output['--weave-feedback-press-offset'] = toRem(feedback.pressOffset)
    }
    if (feedback.hoverScale !== undefined) {
      output['--weave-feedback-hover-scale'] = feedback.hoverScale
    }
    if (feedback.pressScale !== undefined) {
      output['--weave-feedback-press-scale'] = feedback.pressScale
    }
    if (feedback.dragScale !== undefined) {
      output['--weave-feedback-drag-scale'] = feedback.dragScale
    }
  }

  assignRecord(output, 'typography-family', tokens.typography?.family)
  assignRecord(output, 'typography-size', tokens.typography?.size, toRem)
  assignRecord(output, 'typography-weight', tokens.typography?.weight)
  assignRecord(
    output,
    'typography-line-height',
    tokens.typography?.lineHeight,
  )
  assignRecord(
    output,
    'typography-letter-spacing',
    tokens.typography?.letterSpacing,
    toRem,
  )

  for (const [name, style] of Object.entries(
    tokens.typography?.styles ?? {},
  )) {
    typographyStyleVariables(output, name, style)
  }

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
