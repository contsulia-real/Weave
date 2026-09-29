import type {
  ReactElement,
  ReactNode,
} from 'react'
import type {
  IconComponent,
  IconSvg,
} from './icon-types'
import type {
  PopoverPlacement,
} from './popover-types'
import type {
  Length,
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type ComboboxValue = string

export type ComboboxIcon =
  | IconComponent
  | IconSvg

export type ComboboxPlacement =
  PopoverPlacement

export type ComboboxInputViewProps =
  Omit<
    ViewCoreProps<HTMLInputElement>,
    | 'children'
    | 'role'
    | 'disabled'
    | 'expanded'
    | 'controls'
    | 'onChange'
  > &
  ViewDynamicBreakpointProps

export type ComboboxListboxViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    | 'children'
    | 'role'
    | 'position'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
  > &
  ViewDynamicBreakpointProps

export type ComboboxOptionViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    | 'children'
    | 'role'
    | 'selected'
    | 'disabled'
  > &
  ViewDynamicBreakpointProps

export interface ComboboxFilterOption {
  value: ComboboxValue
  textValue: string
  disabled: boolean
}

export type ComboboxFilter = (
  option: ComboboxFilterOption,
  inputValue: string,
) => boolean

export interface ComboboxProps {
  children?: ReactNode

  value?: ComboboxValue | null
  defaultValue?: ComboboxValue | null
  onValueChange?: (
    value: ComboboxValue | null,
  ) => void

  inputValue?: string
  defaultInputValue?: string
  onInputValueChange?: (
    value: string,
  ) => void

  filter?: ComboboxFilter
  emptyContent?: ReactNode
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  clearLabel?: string

  placement?: ComboboxPlacement
  offset?: Length
  viewportPadding?: Length

  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void

  viewProps?: ComboboxInputViewProps
  listboxViewProps?:
    ComboboxListboxViewProps
}

export interface ComboboxOptionProps {
  value: ComboboxValue
  text: ReactNode
  textValue?: string
  secondaryText?: ReactNode
  icon?: ComboboxIcon
  disabled?: boolean
  viewProps?:
    ComboboxOptionViewProps
}

export interface ComboboxOptionDescriptor {
  value: ComboboxValue
  text: ReactNode
  textValue: string
  secondaryText?: ReactNode
  icon?: ComboboxIcon
  disabled: boolean
}

export type ComboboxChild =
  ReactElement<ComboboxOptionProps>
