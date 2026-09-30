import type { ReactNode, Ref } from 'react'
import type { Length, ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type SplitBoxDirection = 'horizontal' | 'vertical'
export type SplitBoxCollapsible = false | 'start' | 'end' | 'both'

export type SplitBoxViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'layout' | 'direction'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export type SplitBoxPaneViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

interface SplitBoxBaseProps {
  children: ReactNode
  direction?: SplitBoxDirection
  minStart?: Length
  maxStart?: Length
  minEnd?: Length
  maxEnd?: Length
  collapsible?: SplitBoxCollapsible
  collapseThreshold?: Length
  expandThreshold?: Length
  step?: Length
  thickness?: Length
  onChange?: (size: string) => void
  viewProps?: SplitBoxViewProps
}

export interface SplitBoxControlledProps extends SplitBoxBaseProps {
  size: Length
  defaultSize?: never
}

export interface SplitBoxUncontrolledProps extends SplitBoxBaseProps {
  size?: never
  defaultSize: Length
}

export type SplitBoxProps = SplitBoxControlledProps | SplitBoxUncontrolledProps

export interface SplitBoxPaneProps {
  children: ReactNode
  viewProps?: SplitBoxPaneViewProps
}
