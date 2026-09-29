import type {
  Length,
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type DividerDirection =
  | 'horizontal'
  | 'vertical'

export type DividerViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    'children' | 'role' | 'direction'
  > &
  ViewDynamicBreakpointProps

export interface DividerProps {
  direction?: DividerDirection
  gap?: Length
  size?: number
  viewProps?: DividerViewProps
}
