import type { ReactNode } from 'react'
import type { RowProps } from './layout-types'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  variant?: AlertVariant
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  viewProps?: Omit<RowProps, 'children' | 'role'>
}
