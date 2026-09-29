import { createContext } from 'react'

export interface OptionContextValue {
  listboxId: string
  selectedValue: string | null
  activeValue: string | null
  setActiveValue(value: string): void
  selectValue(value: string): void
}

export function createOptionContext() {
  return createContext<OptionContextValue | null>(null)
}
