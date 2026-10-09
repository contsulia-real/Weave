import type { ReactNode, Ref } from 'react'
import type { IconComponent, IconSvg } from './icon-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
  | 'file'

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

export type SingleLineInputProps = InputCommonProps & {
  multiline?: false
  rows?: never
  type?: InputType
  min?: string | number
  max?: string | number
  step?: number | 'any'
  /** Optional character(s) to display instead of the native password mask. */
  mask?: string
  /** Accepted file extensions or MIME types for type="file". */
  accept?: string
  /** Allow selecting several files when type="file". */
  multiple?: boolean
  /** Accept files dragged onto type="file"; disabled by default. */
  dropzone?: boolean
  /** BCP 47 language tag for custom color, calendar and clock pickers. */
  locale?: string
  clearable?: boolean
  clearLabel?: string
  leadingIcon?: InputIcon
  trailingIcon?: InputIcon
  /** A focusable action displayed inside the trailing edge of a single-line Input. */
  trailingAction?: ReactNode
  viewProps?: InputViewProps<HTMLInputElement>
}

type NoFileOptions = { accept?: never; multiple?: never; dropzone?: never }
type NoRangeOptions = { min?: never; max?: never; step?: never }
type NoTextValidation = { minLength?: never; maxLength?: never; pattern?: never }
type NoBuiltInActionOverrides = { trailingAction?: never; clearable?: never; clearLabel?: never }

export type InputProps =
  | (SingleLineInputProps &
      (
        | ({
            type?: 'text' | 'email' | 'search' | 'tel' | 'url'
            mask?: never
            locale?: never
          } & NoFileOptions &
            NoRangeOptions)
        | ({
            type: 'password'
            locale?: never
            min?: never
            max?: never
            step?: never
            trailingAction?: never
          } & NoFileOptions)
        | ({
            type: 'number'
            mask?: never
            locale?: never
          } & NoFileOptions &
            NoTextValidation &
            NoBuiltInActionOverrides)
        | ({
            type: 'date' | 'time' | 'datetime-local' | 'month' | 'week'
            mask?: never
          } & NoFileOptions &
            NoTextValidation &
            NoBuiltInActionOverrides)
        | ({
            type: 'color'
            mask?: never
            leadingIcon?: never
            trailingIcon?: never
          } & NoFileOptions &
            NoRangeOptions &
            NoTextValidation &
            NoBuiltInActionOverrides)
        | ({
            type: 'file'
            value?: never
            defaultValue?: never
            readOnly?: never
            mask?: never
            locale?: never
            leadingIcon?: never
            trailingIcon?: never
          } & NoRangeOptions &
            NoTextValidation &
            NoBuiltInActionOverrides)
      ))
  | (InputCommonProps & {
      multiline: true
      rows?: number
      type?: never
      clearable?: never
      clearLabel?: never
      leadingIcon?: never
      trailingIcon?: never
      trailingAction?: never
      viewProps?: InputViewProps<HTMLTextAreaElement>
    })

export type SingleLineInputViewProps = InputViewProps<HTMLInputElement>

export type MultilineInputViewProps = InputViewProps<HTMLTextAreaElement>
