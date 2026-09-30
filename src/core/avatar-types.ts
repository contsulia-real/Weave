import type { ReactNode } from 'react'
import type { ImageSource } from './image-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type AvatarViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children'> &
  ViewDynamicBreakpointProps

export interface AvatarProps {
  src?: ImageSource
  name?: string
  fallback?: ReactNode
  viewProps?: AvatarViewProps
}
