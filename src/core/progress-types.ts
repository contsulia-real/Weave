import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type ProgressSize = 'small' | 'medium' | 'large'
export type ProgressColor = string
export type ProgressSpeed =
  | 'slow'
  | 'normal'
  | 'fast'
  | number
export type ProgressMode = 'spin' | 'linear'

export type ProgressViewProps = Omit<
  ViewCoreProps<HTMLSpanElement>,
  | 'children'
  | 'role'
  | 'busy'
  | 'valueMin'
  | 'valueMax'
  | 'valueNow'
  | 'valueText'
  | 'color'
> & ViewDynamicBreakpointProps

interface ProgressBaseProps {
  mode?: ProgressMode
  tracked?: boolean
  size?: ProgressSize
  color?: ProgressColor
  speed?: ProgressSpeed
  viewProps?: ProgressViewProps
}

export type ProgressProps =
  ProgressBaseProps &
  (
    | {
        undetermined: true
        progress?: never
      }
    | {
        undetermined?: false
        progress: number
      }
  )
