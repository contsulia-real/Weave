import type { CSSProperties } from 'react'
import type {
  TextResponsiveProps,
  TextStyleProps,
} from '../../core/text-types'
import { length } from '../../core/values'

export type TextVariableStyle = CSSProperties &
  Record<`--weave-text-${string}`, string | number | undefined>

const TYPOGRAPHY_PRESETS: Readonly<
  Record<NonNullable<TextStyleProps['typo']>, Omit<TextStyleProps, 'typo'>>
> = {
  display: {
    size: 'display',
    weight: 'bold',
    lineHeight: '0.95',
    letterSpacing: '-0.06em',
  },
  heading: {
    size: 'medium',
    weight: 'semibold',
    lineHeight: '1.25',
  },
  body: {
    size: 'medium',
    weight: 'regular',
    lineHeight: '1.5',
  },
  label: {
    size: 'small',
    weight: 'semibold',
    lineHeight: '1.25',
  },
  caption: {
    size: 'small',
    weight: 'regular',
    lineHeight: '1.5',
  },
}

function withTypographyPreset(
  props: TextStyleProps | TextResponsiveProps,
): TextStyleProps | TextResponsiveProps {
  if (props.typo === undefined) return props

  return {
    ...TYPOGRAPHY_PRESETS[props.typo],
    ...props,
  }
}

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

  const resolved = withTypographyPreset(props)

  if (resolved.size !== undefined) {
    output[variable('font-size', breakpoint)] =
      `var(--weave-typography-size-${resolved.size})`
  }

  if (resolved.weight !== undefined) {
    output[variable('font-weight', breakpoint)] =
      `var(--weave-typography-weight-${resolved.weight})`
  }

  if (resolved.align !== undefined) {
    output[variable('text-align', breakpoint)] = resolved.align
  }

  if (resolved.lineHeight !== undefined) {
    output[variable('line-height', breakpoint)] = length(resolved.lineHeight)
  }

  if (resolved.letterSpacing !== undefined) {
    output[variable('letter-spacing', breakpoint)] = length(
      resolved.letterSpacing,
    )
  }

  const wrapping = textWrapValues(resolved.wrap, resolved.overflow)
  if (wrapping.whiteSpace !== undefined) {
    output[variable('white-space', breakpoint)] = wrapping.whiteSpace
  }
  if (wrapping.textWrap !== undefined) {
    output[variable('text-wrap', breakpoint)] = wrapping.textWrap
  }

  if (resolved.overflow !== undefined) {
    output[variable('text-overflow', breakpoint)] = resolved.overflow
  }

  if (resolved.maxLines !== undefined) {
    output[variable('max-lines', breakpoint)] = resolved.maxLines
  }

  if (resolved.case !== undefined) {
    output[variable('text-transform', breakpoint)] = resolved.case
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
    Object.assign(output, resolveTextStyle(value, breakpoint))
  }

  return output
}

export { variable as textVariableName }
