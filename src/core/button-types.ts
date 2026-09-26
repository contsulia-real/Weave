import type {
  ReactElement,
  ReactNode,
  Ref,
  SVGProps,
} from 'react'
import type {
  IconComponent,
} from './icon-types'
import type {
  DefaultBreakpointName,
  ViewCoreProps,
  ViewDynamicBreakpointProps,
  ViewResponsiveStyle,
} from './view-types'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonIconPosition = 'start' | 'end'

export type ButtonIcon =
  | IconComponent
  | ReactElement<SVGProps<SVGSVGElement>>

export interface ButtonResponsiveProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export type ButtonBreakpointProps = Partial<
  Record<DefaultBreakpointName, ButtonResponsiveProps>
>

export type ButtonViewProps<
  TBreakpointName extends string = never,
> = Omit<
  ViewCoreProps<HTMLButtonElement>,
  'children' | 'busy'
> &
  ViewDynamicBreakpointProps<
    ViewResponsiveStyle,
    TBreakpointName
  > & {
    ref?: Ref<HTMLButtonElement>
  }

interface ButtonBaseProps<
  TBreakpointName extends string = never,
> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  viewProps?: ButtonViewProps<TBreakpointName>
}

type ButtonSemanticContent =
  | {
      children?: never
      text: ReactNode
      icon?: ButtonIcon
      iconPosition?: ButtonIconPosition
    }
  | {
      children?: never
      text?: never
      icon: ButtonIcon
      iconPosition?: ButtonIconPosition
    }

type ButtonCustomContent = {
  children: ReactNode
  text?: never
  icon?: never
  iconPosition?: never
}

export type ButtonProps<
  TBreakpointName extends string = never,
> =
  ButtonBaseProps<TBreakpointName> &
  ButtonBreakpointProps &
  ViewDynamicBreakpointProps<
    ButtonResponsiveProps,
    TBreakpointName
  > &
  (ButtonSemanticContent | ButtonCustomContent)
