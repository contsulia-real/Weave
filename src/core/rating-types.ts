import type { ButtonSize } from './button-types'
import type { RowProps } from './layout-types'

export interface RatingProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  /** Number of stars; defaults to five. */
  max?: number
  /** Star and interaction target size; defaults to large. */
  size?: ButtonSize
  /** Display the selected stars without interactive controls. */
  readOnly?: boolean
  /** Accessible name. */
  label?: string
  viewProps?: Omit<RowProps, 'children' | 'role' | 'label'>
}
