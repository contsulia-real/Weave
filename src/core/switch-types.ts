import type { ViewProps } from './view-types'

export type SwitchSize = 'small' | 'medium' | 'large'

export type SwitchViewProps<
  TBreakpoint extends string = never,
> = Omit<
  ViewProps<HTMLDivElement, TBreakpoint>,
  'children' | 'checked'
>

export interface SwitchProps<
  TBreakpoint extends string = never,
> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  size?: SwitchSize
  viewProps?: SwitchViewProps<TBreakpoint>
}
