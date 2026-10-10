import type { SingleLineInputProps } from './input-types'

/** The existing Input date picker, displayed permanently without an input field. */
export type CalendarProps = Pick<
  SingleLineInputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'min'
  | 'max'
  | 'step'
  | 'locale'
  | 'disabled'
  | 'readOnly'
>
