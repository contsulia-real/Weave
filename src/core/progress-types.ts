import type { ViewProps } from './view-types'

export type ProgressSize = 'small' | 'medium' | 'large'
export type ProgressColor = string
export type ProgressSpeed =
  | 'slow'
  | 'normal'
  | 'fast'
  | number
export type ProgressMode = 'spin' | 'linear'

export type ProgressViewProps<
  TBreakpoint extends string = never,
> = Omit<
  ViewProps<HTMLDivElement, TBreakpoint>,
  | 'children'
  | 'role'
  | 'busy'
  | 'valueMin'
  | 'valueMax'
  | 'valueNow'
  | 'valueText'
  | 'color'
>

interface ProgressBaseProps<
  TBreakpoint extends string = never,
> {
  mode?: ProgressMode
  tracked?: boolean
  size?: ProgressSize
  color?: ProgressColor
  speed?: ProgressSpeed
  viewProps?: ProgressViewProps<TBreakpoint>
}

export type ProgressProps<
  TBreakpoint extends string = never,
> =
  ProgressBaseProps<TBreakpoint> &
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
