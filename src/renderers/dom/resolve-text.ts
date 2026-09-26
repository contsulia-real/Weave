import type { CSSProperties } from 'react'
import type {
  TextResponsiveProps,
  TextStyleProps,
} from '../../core/text-types'
import type { ResolvedText } from '../../core/resolved-text'
import { breakpointCSSName } from './breakpoint-utils'
import { length } from './css-values'
import { typographyStyleVariableReference } from '../../theme/theme-css'

export type TextVariableStyle = CSSProperties &
  Record<`--weave-text-${string}`, string | number | undefined>

const variable = (
  property: string,
  breakpoint?: string,
): `--weave-text-${string}` =>
  `--weave-text-${breakpoint === undefined ? '' : `${breakpoint}-`}${property}`

function textWrapValues(
  wrap: TextStyleProps['wrap'],
  overflow: TextStyleProps['overflow'],
): { whiteSpace?: string; textWrap?: string } {
  if (wrap === 'nowrap') return { whiteSpace: 'nowrap' }
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
  if (overflow === 'ellipsis') return { whiteSpace: 'nowrap' }
  return {}
}

function applyTypographyPreset(
  output: TextVariableStyle,
  typo: TextStyleProps['typo'],
  breakpoint?: string,
): void {
  if (typo === undefined) return

  output[variable('font-size', breakpoint)] =
    typographyStyleVariableReference(typo, 'fontSize')
  output[variable('font-weight', breakpoint)] =
    typographyStyleVariableReference(typo, 'fontWeight')
  output[variable('line-height', breakpoint)] =
    typographyStyleVariableReference(typo, 'lineHeight')
  output[variable('letter-spacing', breakpoint)] =
    typographyStyleVariableReference(typo, 'letterSpacing')
}

export function resolveTextStyle(
  props: TextStyleProps | TextResponsiveProps | undefined,
  breakpoint?: string,
): TextVariableStyle {
  const output: TextVariableStyle = {}
  if (props === undefined) return output

  applyTypographyPreset(output, props.typo, breakpoint)

  if (props.size !== undefined) {
    output[variable('font-size', breakpoint)] =
      `var(--weave-typography-size-${props.size})`
  }

  if (props.weight !== undefined) {
    output[variable('font-weight', breakpoint)] =
      `var(--weave-typography-weight-${props.weight})`
  }

  if (props.align !== undefined) {
    output[variable('text-align', breakpoint)] = props.align
  }

  if (props.lineHeight !== undefined) {
    output[variable('line-height', breakpoint)] = length(props.lineHeight)
  }

  if (props.letterSpacing !== undefined) {
    output[variable('letter-spacing', breakpoint)] = length(
      props.letterSpacing,
    )
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

  return output
}

export function resolveTextResponsiveStyle(input: {
  base: TextStyleProps
  responsive?: Readonly<
    Record<string, TextResponsiveProps | undefined>
  >
}): TextVariableStyle {
  const output = resolveTextStyle(input.base)

  for (const [breakpoint, value] of Object.entries(
    input.responsive ?? {},
  )) {
    Object.assign(
      output,
      resolveTextStyle(value, breakpoint),
    )
  }

  return output
}

export function compileDOMText(
  text: ResolvedText,
): TextVariableStyle {
  const output = resolveTextStyle(text.base)

  for (const responsive of text.responsive) {
    Object.assign(
      output,
      resolveTextStyle(
        responsive.style,
        breakpointCSSName(responsive.name),
      ),
    )
  }

  return output
}

export { variable as textVariableName }
