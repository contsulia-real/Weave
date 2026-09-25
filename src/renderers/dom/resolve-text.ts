import type { CSSProperties } from 'react'
import type {
  TextResponsiveProps,
  TextStyleProps,
} from '../../core/text-types'
import { length } from '../../core/values'

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

export function resolveTextStyle(
  props: TextStyleProps | TextResponsiveProps | undefined,
  breakpoint?: string,
): TextVariableStyle {
  const output: TextVariableStyle = {}
  if (props === undefined) return output

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
  sm?: TextResponsiveProps
  md?: TextResponsiveProps
  lg?: TextResponsiveProps
  xl?: TextResponsiveProps
}): TextVariableStyle {
  return {
    ...resolveTextStyle(input.base),
    ...resolveTextStyle(input.sm, 'sm'),
    ...resolveTextStyle(input.md, 'md'),
    ...resolveTextStyle(input.lg, 'lg'),
    ...resolveTextStyle(input.xl, 'xl'),
  }
}

export { variable as textVariableName }
