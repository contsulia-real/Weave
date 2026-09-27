import type { ReactNode, Ref } from 'react'
import type {
  DefaultBreakpointName,
  Length,
  ViewCoreProps,
  ViewDynamicBreakpointProps,
  ViewResponsiveStyle,
} from './view-types'

export type TextSize =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'

export type TextTypo =
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small'

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
  typo?: TextTypo
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
  ViewCoreProps<HTMLSpanElement>,
  'children' | 'color'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLSpanElement>
  }

export type TextBreakpointProps =
  Partial<
    Record<
      DefaultBreakpointName,
      TextResponsiveProps
    >
  >

export type TextProps =
  TextStyleProps &
  TextBreakpointProps &
  ViewDynamicBreakpointProps & {
    children?: ReactNode
    viewProps?: TextViewProps
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
