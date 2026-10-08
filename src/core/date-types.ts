import type { SingleLineInputViewProps } from './input-types'

export interface DateProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  min?: string
  max?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  autoComplete?: string
  /** BCP 47 language tag. Overrides the current document language for this Date. */
  locale?: string
  viewProps?: SingleLineInputViewProps
}
