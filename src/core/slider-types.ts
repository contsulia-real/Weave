import type { ReactNode } from 'react'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type SliderSize = 'small' | 'medium' | 'large'

export type SliderViewProps = Omit<
  ViewCoreProps<HTMLInputElement>,
  'children' | 'onChange' | 'disabled'
> &
  ViewDynamicBreakpointProps

export interface SliderProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  name?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: ReactNode
  size?: SliderSize
  viewProps?: SliderViewProps
}
