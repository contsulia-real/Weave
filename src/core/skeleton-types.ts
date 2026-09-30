import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type SkeletonShape = 'rect' | 'circle' | 'text'

export type SkeletonViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children'> &
  ViewDynamicBreakpointProps

export interface SkeletonProps {
  shape?: SkeletonShape
  viewProps?: SkeletonViewProps
}
