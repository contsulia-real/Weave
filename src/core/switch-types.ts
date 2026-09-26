import type { ViewCoreProps } from './view-types'

export type SwitchSize = 'small' | 'medium' | 'large'

export type SwitchViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'checked'
>

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  size?: SwitchSize
  viewProps?: SwitchViewProps
}
