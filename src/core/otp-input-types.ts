import type { RowProps } from './layout-types'

export interface OTPInputProps {
  label: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  required?: boolean
  disabled?: boolean
  viewProps?: Omit<RowProps, 'children' | 'role'>
}
