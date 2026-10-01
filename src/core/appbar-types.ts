import type { ReactElement, ReactNode } from 'react'
import type { Text } from '../components/Text'
import type { TextProps } from './text-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type AppBarSize = 'small' | 'medium' | 'large'
export type AppBarMode = 'full' | 'floating'
export type AppBarTitleAlign = 'start' | 'center' | 'end'
export type AppBarTitle = ReactElement<TextProps, typeof Text>

export type AppBarViewProps = Omit<ViewCoreProps<HTMLElement>, 'children'> &
  ViewDynamicBreakpointProps

export interface AppBarProps {
  leading?: ReactNode
  title: AppBarTitle
  trailing?: ReactNode
  size?: AppBarSize
  mode?: AppBarMode
  titleAlign?: AppBarTitleAlign
  sticky?: boolean
  viewProps?: AppBarViewProps
}
