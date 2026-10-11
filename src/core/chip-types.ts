import type { RowProps } from './layout-types'

export interface ChipProps {
  text: string
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  onRemove?: () => void
  removeLabel?: string
  disabled?: boolean
  viewProps?: Omit<RowProps, 'children' | 'role'>
}
