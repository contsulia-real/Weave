import {
  createContext,
} from 'react'
import type {
  SelectValue,
} from '../../core/select-types'

export interface SelectContextValue {
  listboxId: string
  selectedValue:
    SelectValue | null
  activeValue:
    SelectValue | null
  setActiveValue(
    value: SelectValue,
  ): void
  selectValue(
    value: SelectValue,
  ): void
}

export const SelectContext =
  createContext<SelectContextValue | null>(
    null,
  )
