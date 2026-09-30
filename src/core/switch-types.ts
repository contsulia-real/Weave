import type { ReactNode } from 'react'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type SwitchSize = 'small' | 'medium' | 'large'

export type SwitchViewProps = Omit<
  ViewCoreProps<HTMLButtonElement>,
  'children' | 'checked' | 'disabled'
> &
  ViewDynamicBreakpointProps

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  name?: string
  value?: string
  disabled?: boolean
  label?: ReactNode
  size?: SwitchSize
  viewProps?: SwitchViewProps
}
