import type { Ref } from 'react'
import type { ViewProps } from './view-types'

export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'

export type InputValue = string | number

type InputViewProps<
  TElement extends HTMLElement,
  TBreakpoint extends string = never,
> = Omit<
  ViewProps<TElement, TBreakpoint>,
  'children' | 'onChange' | 'readOnly' | 'required'
> & {
  ref?: Ref<TElement>
}

interface InputCommonProps {
  value?: InputValue
  defaultValue?: InputValue
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  name?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type InputProps<
  TBreakpoint extends string = never,
> =
  | (InputCommonProps & {
      multiline?: false
      rows?: never
      type?: InputType
      viewProps?: InputViewProps<HTMLInputElement, TBreakpoint>
    })
  | (InputCommonProps & {
      multiline: true
      rows?: number
      type?: never
      viewProps?: InputViewProps<HTMLTextAreaElement, TBreakpoint>
    })

export type SingleLineInputViewProps<
  TBreakpoint extends string = never,
> = InputViewProps<HTMLInputElement, TBreakpoint>

export type MultilineInputViewProps<
  TBreakpoint extends string = never,
> = InputViewProps<HTMLTextAreaElement, TBreakpoint>
