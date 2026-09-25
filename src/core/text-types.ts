import type { ReactNode, Ref } from 'react'
import type {
  Length,
  ViewProps,
  ViewResponsiveStyle,
} from './view-types'

export type TextSize =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'

export type TextWeight =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'

export type TextColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'disabled'
  | (string & {})

export type TextAlign = 'start' | 'center' | 'end' | 'justify'
export type TextWrap = 'wrap' | 'nowrap' | 'balance'
export type TextOverflow = 'clip' | 'ellipsis'
export type TextCase = 'none' | 'uppercase' | 'lowercase' | 'capitalize'

export interface TextStyleProps {
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  align?: TextAlign
  lineHeight?: Length
  letterSpacing?: Length
  wrap?: TextWrap
  overflow?: TextOverflow
  maxLines?: number
  case?: TextCase
}

export type TextResponsiveProps = Partial<TextStyleProps>

export type TextViewProps = Omit<
  ViewProps<HTMLSpanElement>,
  'children' | 'color'
> & {
  ref?: Ref<HTMLSpanElement>
}

export interface TextProps extends TextStyleProps {
  children?: ReactNode
  viewProps?: TextViewProps

  sm?: TextResponsiveProps
  md?: TextResponsiveProps
  lg?: TextResponsiveProps
  xl?: TextResponsiveProps
}

export function mergeTextColorResponsive(
  base: ViewResponsiveStyle | undefined,
  text: TextResponsiveProps | undefined,
): ViewResponsiveStyle | undefined {
  if (text?.color === undefined) return base
  return {
    ...base,
    color: text.color,
  }
}
