import type { ReactNode } from 'react'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type SliderSize = 'small' | 'medium' | 'large'
export type SliderDirection = 'horizontal' | 'vertical'

export type SliderViewProps = Omit<
  ViewCoreProps<HTMLInputElement>,
  'children' | 'onChange' | 'disabled'
> &
  ViewDynamicBreakpointProps

export type RangeSliderValue = [number, number]

export type RangeSliderViewProps = Omit<SliderViewProps, 'id' | 'ref'>

export interface MarkSliderMark {
  flag: number
  label: ReactNode
}

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
  direction?: SliderDirection
  inverse?: boolean
  viewProps?: SliderViewProps
}

export interface MarkSliderProps extends SliderProps {
  marks: readonly MarkSliderMark[]
  restricted?: boolean
}

export interface RangeSliderProps {
  value?: RangeSliderValue
  defaultValue?: RangeSliderValue
  onChange?: (value: RangeSliderValue) => void
  startName?: string
  endName?: string
  startLabel?: string
  endLabel?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: ReactNode
  size?: SliderSize
  direction?: SliderDirection
  inverse?: boolean
  viewProps?: RangeSliderViewProps
}
