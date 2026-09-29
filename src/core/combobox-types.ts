import type { ReactNode } from 'react'
import type { PopoverPlacement } from './popover-types'
import type { SelectIcon, SelectOptionDescriptor, SelectOptionProps } from './select-types'
import type { Length, ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type ComboboxValue = string

export type ComboboxIcon = SelectIcon

export type ComboboxPlacement = PopoverPlacement

export type ComboboxInputViewProps = Omit<
  ViewCoreProps<HTMLInputElement>,
  'children' | 'role' | 'disabled' | 'expanded' | 'controls' | 'onChange'
> &
  ViewDynamicBreakpointProps

export type ComboboxListboxViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'role' | 'position' | 'top' | 'right' | 'bottom' | 'left'
> &
  ViewDynamicBreakpointProps

export type ComboboxOptionViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'role' | 'selected' | 'disabled'
> &
  ViewDynamicBreakpointProps

export interface ComboboxFilterOption {
  value: ComboboxValue
  textValue: string
  disabled: boolean
}

export type ComboboxFilter = (option: ComboboxFilterOption, inputValue: string) => boolean

export interface ComboboxProps {
  children?: ReactNode

  value?: ComboboxValue | null
  defaultValue?: ComboboxValue | null
  onValueChange?: (value: ComboboxValue | null) => void

  inputValue?: string
  defaultInputValue?: string
  onInputValueChange?: (value: string) => void

  filter?: ComboboxFilter
  emptyContent?: ReactNode
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  clearLabel?: string

  placement?: ComboboxPlacement
  offset?: Length
  overlapTrigger?: boolean
  viewportPadding?: Length

  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void

  viewProps?: ComboboxInputViewProps
  listboxViewProps?: ComboboxListboxViewProps
}

export type ComboboxOptionProps = Omit<SelectOptionProps, 'viewProps'> & {
  viewProps?: ComboboxOptionViewProps
}

export type ComboboxOptionDescriptor = SelectOptionDescriptor
