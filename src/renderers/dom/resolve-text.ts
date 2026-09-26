import type { CSSProperties } from 'react'
import type {
  TextResponsiveProps,
  TextStyleProps,
  TextTypo,
} from '../../core/text-types'
import { length } from '../../core/values'
import type { ThemeTypographyStyle } from '../../theme/theme-types'

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

function typographyPreset(
  typo: TextTypo | undefined,
  styles: Readonly<Record<string, ThemeTypographyStyle>> | undefined,
): ThemeTypographyStyle | undefined {
  return typo === undefined ? undefined : styles?.[typo]
}

function applyTypographyPreset(
  output: TextVariableStyle,
  preset: ThemeTypographyStyle | undefined,
  breakpoint?: string,
): void {
  if (preset?.fontSize !== undefined) {
    output[variable('font-size', breakpoint)] = length(preset.fontSize)
  }
  if (preset?.fontWeight !== undefined) {
    output[variable('font-weight', breakpoint)] = preset.fontWeight
  }
  if (preset?.lineHeight !== undefined) {
    output[variable('line-height', breakpoint)] = preset.lineHeight
  }
  if (preset?.letterSpacing !== undefined) {
    output[variable('letter-spacing', breakpoint)] =
      length(preset.letterSpacing)
  }
}

export function resolveTextStyle(
  props: TextStyleProps | TextResponsiveProps | undefined,
  typographyStyles?: Readonly<Record<string, ThemeTypographyStyle>>,
  breakpoint?: string,
): TextVariableStyle {
  const output: TextVariableStyle = {}
  if (props === undefined) return output

  applyTypographyPreset(
    output,
    typographyPreset(props.typo, typographyStyles),
    breakpoint,
  )

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
  typographyStyles?: Readonly<Record<string, ThemeTypographyStyle>>
}): TextVariableStyle {
  const output = resolveTextStyle(
    input.base,
    input.typographyStyles,
  )

  for (const [breakpoint, value] of Object.entries(
    input.responsive ?? {},
  )) {
    Object.assign(
      output,
      resolveTextStyle(
        value,
        input.typographyStyles,
        breakpoint,
      ),
    )
  }

  return output
}

export { variable as textVariableName }
