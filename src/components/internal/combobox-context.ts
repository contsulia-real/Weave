import {
  createContext,
} from 'react'
import type {
  ComboboxValue,
} from '../../core/combobox-types'

export interface ComboboxContextValue {
  listboxId: string
  selectedValue:
    ComboboxValue | null
  activeValue:
    ComboboxValue | null
  setActiveValue(
    value: ComboboxValue,
  ): void
  selectValue(
    value: ComboboxValue,
  ): void
}

export const ComboboxContext =
  createContext<ComboboxContextValue | null>(
    null,
  )
