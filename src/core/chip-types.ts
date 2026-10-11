import type { ButtonSize } from './button-types'
import type { RowProps } from './layout-types'

export interface ChipProps {
  text: string
  selectable?: boolean
  size?: ButtonSize
  pill?: boolean
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  onRemove?: () => void
  removeLabel?: string
  disabled?: boolean
  viewProps?: Omit<RowProps, 'children' | 'role'>
}
