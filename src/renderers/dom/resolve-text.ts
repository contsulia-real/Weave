import type { CSSProperties } from 'react'
import type { TextResponsiveProps, TextStyleProps } from '../../core/text-types'
import { length } from '../../core/values'
import { typographyStyleVariableReference } from '../../theme/theme-css'

type TextVariableStyle = CSSProperties &
  Record<`--weave-text-${string}`, string | number | undefined>

const variable = (property: string, breakpoint?: string): `--weave-text-${string}` =>
  `--weave-text-${breakpoint === undefined ? '' : `${breakpoint}-`}${property}`

function textWrapValues(
  wrap: TextStyleProps['wrap'],
  overflow: TextStyleProps['overflow'],
): { whiteSpace?: string; textWrap?: string } {
  if (wrap === 'nowrap') return { whiteSpace: 'nowrap', textWrap: 'nowrap' }
  if (wrap === 'balance') {
    return {
      whiteSpace: 'normal',
      textWrap: 'balance',
    }
  }
  if (wrap === 'wrap') {
    return {
      whiteSpace: 'normal',
      textWrap: 'wrap',
    }
  }
  if (overflow === 'ellipsis') return { whiteSpace: 'nowrap', textWrap: 'nowrap' }
  return {}
}

function applyTypographyPreset(
  output: TextVariableStyle,
  typo: TextStyleProps['typo'],
  breakpoint?: string,
): void {
  if (typo === undefined) return

  output[variable('font-size', breakpoint)] = typographyStyleVariableReference(typo, 'fontSize')
  output[variable('font-weight', breakpoint)] = typographyStyleVariableReference(typo, 'fontWeight')
  output[variable('line-height', breakpoint)] = typographyStyleVariableReference(typo, 'lineHeight')
  output[variable('letter-spacing', breakpoint)] = typographyStyleVariableReference(
    typo,
    'letterSpacing',
  )
}

function resolveDecoration(props: TextStyleProps | TextResponsiveProps): string | undefined {
  if (
    props.underline === undefined &&
    props.strikethrough === undefined &&
    props.overline === undefined
  ) {
    return undefined
  }

  const lines = [
    props.underline ? 'underline' : undefined,
    props.strikethrough ? 'line-through' : undefined,
    props.overline ? 'overline' : undefined,
  ].filter((value): value is string => value !== undefined)

  return lines.length === 0 ? 'none' : lines.join(' ')
}

function resolveTextStyle(
  props: TextStyleProps | TextResponsiveProps | undefined,
  breakpoint?: string,
): TextVariableStyle {
  const output: TextVariableStyle = {}
  if (props === undefined) return output

  applyTypographyPreset(output, props.typo, breakpoint)

  if (props.size !== undefined) {
    output[variable('font-size', breakpoint)] = `var(--weave-typography-size-${props.size})`
  }

  if (props.bold !== undefined) {
    output[variable('font-weight', breakpoint)] =
      `var(--weave-typography-weight-${props.bold ? 'bold' : 'regular'})`
  }

  if (props.weight !== undefined) {
    output[variable('font-weight', breakpoint)] = `var(--weave-typography-weight-${props.weight})`
  }

  if (props.italic !== undefined) {
    output[variable('font-style', breakpoint)] = props.italic ? 'italic' : 'normal'
  }

  if (props.align !== undefined) {
    output[variable('text-align', breakpoint)] = props.align
  }

  if (props.lineHeight !== undefined) {
    output[variable('line-height', breakpoint)] = length(props.lineHeight)
  }

  if (props.letterSpacing !== undefined) {
    output[variable('letter-spacing', breakpoint)] = length(props.letterSpacing)
  }

  const wrapping = textWrapValues(props.wrap, props.overflow)
  if (wrapping.whiteSpace !== undefined) {
    output[variable('white-space', breakpoint)] = wrapping.whiteSpace
  }
  if (wrapping.textWrap !== undefined) {
    output[variable('text-wrap', breakpoint)] = wrapping.textWrap
  }

  if (props.overflow !== undefined) {
    output[variable('text-overflow', breakpoint)] = props.overflow
  }

  if (props.maxLines !== undefined) {
    output[variable('max-lines', breakpoint)] = props.maxLines
  }

  if (props.case !== undefined) {
    output[variable('text-transform', breakpoint)] = props.case
  }

  const decoration = resolveDecoration(props)
  if (decoration !== undefined) {
    output[variable('text-decoration-line', breakpoint)] = decoration
  }

  return output
}

export function resolveTextResponsiveStyle(input: {
  base: TextStyleProps
  responsive?: Readonly<Record<string, TextResponsiveProps | undefined>>
}): TextVariableStyle {
  const output = resolveTextStyle(input.base)
  const decorationState = {
    underline: input.base.underline,
    strikethrough: input.base.strikethrough,
    overline: input.base.overline,
  }

  for (const [breakpoint, value] of Object.entries(input.responsive ?? {})) {
    if (value === undefined) continue

    const hasDecorationOverride =
      value.underline !== undefined ||
      value.strikethrough !== undefined ||
      value.overline !== undefined

    if (hasDecorationOverride) {
      if (value.underline !== undefined) decorationState.underline = value.underline
      if (value.strikethrough !== undefined) decorationState.strikethrough = value.strikethrough
      if (value.overline !== undefined) decorationState.overline = value.overline

      Object.assign(
        output,
        resolveTextStyle(
          {
            ...value,
            ...decorationState,
          },
          breakpoint,
        ),
      )
      continue
    }

    Object.assign(output, resolveTextStyle(value, breakpoint))
  }

  return output
}

export { variable as textVariableName }
