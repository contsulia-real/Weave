import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type SwitchSize = 'small' | 'medium' | 'large'

export type SwitchViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'checked' | 'disabled'
> & ViewDynamicBreakpointProps

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: SwitchSize
  viewProps?: SwitchViewProps
}
