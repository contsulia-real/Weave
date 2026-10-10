import type { ReactNode } from 'react'
import type { ColumnProps } from './layout-types'

export type EmptyStateViewProps = Omit<ColumnProps, 'children'>

export interface EmptyStateProps {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  viewProps?: EmptyStateViewProps
}
