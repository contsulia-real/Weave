import type { ReactNode, Ref } from 'react'
import type { IconComponent, IconSvg } from './icon-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type AccordionIcon = IconComponent | IconSvg

export type AccordionViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'disabled' | 'layout' | 'direction'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export type AccordionItemViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children' | 'disabled'> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

export type AccordionTriggerViewProps = Omit<
  ViewCoreProps<HTMLButtonElement>,
  'children' | 'disabled' | 'role' | 'expanded' | 'controls'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLButtonElement>
  }

export type AccordionPanelViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'role' | 'labelledBy' | 'hidden'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLDivElement>
  }

interface AccordionBaseProps {
  children: ReactNode
  disabled?: boolean
  viewProps?: AccordionViewProps
}

export interface AccordionSingleProps extends AccordionBaseProps {
  multiple?: false
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  collapsible?: boolean
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  multiple: true
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  collapsible?: never
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps

export interface AccordionItemProps {
  value: string
  children: ReactNode
  disabled?: boolean
  viewProps?: AccordionItemViewProps
}

export interface AccordionTriggerProps {
  children: ReactNode
  expandIcon?: AccordionIcon
  collapseIcon?: AccordionIcon
  viewProps?: AccordionTriggerViewProps
}

export interface AccordionPanelProps {
  children: ReactNode
  viewProps?: AccordionPanelViewProps
}
