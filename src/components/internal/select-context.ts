import type { OptionContextValue } from './option-context'
import { createOptionContext } from './option-context'

export type SelectContextValue = OptionContextValue

export const SelectContext = createOptionContext()
