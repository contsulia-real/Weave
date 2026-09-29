import { createContext } from 'react'
import type { ListOrientation, ListSelection } from '../../core/list-types'

export type ListFocusMove = 'previous' | 'next' | 'first' | 'last'

interface ListContextValue {
  selection: ListSelection
  orientation: ListOrientation
  disabled: boolean
  selectedIds: ReadonlySet<string>
  focusId: string | null
  setFocusId(id: string): void
  selectItem(id: string): void
  moveFocus(id: string, move: ListFocusMove): void
}

export const ListContext = createContext<ListContextValue | null>(null)
