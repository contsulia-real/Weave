import type { Ref } from 'react'
import type { IconComponent, IconSvg } from './icon-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'date'

export type InputValue = string | number
export type InputIcon = IconComponent | IconSvg

type InputViewProps<TElement extends HTMLElement> = Omit<
  ViewCoreProps<TElement>,
  'children' | 'onChange' | 'readOnly' | 'required' | 'disabled'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<TElement>
  }

interface InputCommonProps {
  value?: InputValue
  defaultValue?: InputValue
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type InputProps =
  | (InputCommonProps & {
      multiline?: false
      rows?: never
      type?: InputType
      min?: string
      max?: string
      clearable?: boolean
      clearLabel?: string
      leadingIcon?: InputIcon
      trailingIcon?: InputIcon
      viewProps?: InputViewProps<HTMLInputElement>
    })
  | (InputCommonProps & {
      multiline: true
      rows?: number
      type?: never
      clearable?: never
      clearLabel?: never
      leadingIcon?: never
      trailingIcon?: never
      viewProps?: InputViewProps<HTMLTextAreaElement>
    })

export type SingleLineInputViewProps = InputViewProps<HTMLInputElement>

export type MultilineInputViewProps = InputViewProps<HTMLTextAreaElement>
