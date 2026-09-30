import type { ReactNode, Ref } from 'react'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivation = 'automatic' | 'manual'
export type TabsVariant = 'underline' | 'pill'

export type TabsViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export type TabListViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children' | 'role'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export type TabViewProps = Omit<
  ViewCoreProps<HTMLButtonElement>,
  'children' | 'disabled' | 'role' | 'selected'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLButtonElement>
  }

export type TabPanelViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'role' | 'hidden'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export interface TabsProps {
  children: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
  activation?: TabsActivation
  variant?: TabsVariant
  indicatorThickness?: number
  viewProps?: TabsViewProps
}

export interface TabListProps {
  children: ReactNode
  viewProps?: TabListViewProps
}

export interface TabProps {
  value: string
  children: ReactNode
  disabled?: boolean
  viewProps?: TabViewProps
}

export interface TabPanelProps {
  value: string
  children: ReactNode
  viewProps?: TabPanelViewProps
}
