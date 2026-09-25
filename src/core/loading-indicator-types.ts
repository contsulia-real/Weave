import type { ViewProps } from './view-types'

export type LoadingIndicatorSize = 'small' | 'medium' | 'large'
export type LoadingIndicatorColor = string
export type LoadingIndicatorSpeed =
  | 'slow'
  | 'normal'
  | 'fast'
  | number
export type LoadingIndicatorAnimation = 'spin' | 'pulse' | 'dots'

export type LoadingIndicatorViewProps = Omit<
  ViewProps<HTMLDivElement>,
  | 'children'
  | 'role'
  | 'busy'
  | 'valueMin'
  | 'valueMax'
  | 'valueNow'
  | 'valueText'
  | 'color'
>

interface LoadingIndicatorBaseProps {
  size?: LoadingIndicatorSize
  color?: LoadingIndicatorColor
  speed?: LoadingIndicatorSpeed
  animation?: LoadingIndicatorAnimation
  viewProps?: LoadingIndicatorViewProps
}

export type LoadingIndicatorProps =
  LoadingIndicatorBaseProps &
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
