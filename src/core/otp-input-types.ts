import type { RowProps } from './layout-types'

export interface OTPInputProps {
  label: string
  mode?: 'numeric' | 'alphanumeric' | 'uppercase'
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  required?: boolean
  disabled?: boolean
  viewProps?: Omit<RowProps, 'children' | 'role'>
}
