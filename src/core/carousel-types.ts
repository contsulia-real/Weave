import type { ReactNode } from 'react'
import type { RowProps } from './layout-types'

export interface CarouselProps {
  children?: ReactNode
  gap?: RowProps['gap']
  label?: string
  previousLabel?: string
  nextLabel?: string
  viewProps?: Omit<RowProps, 'children' | 'role'>
}
