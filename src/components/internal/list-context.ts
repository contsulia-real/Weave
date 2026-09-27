import {
  createContext,
} from 'react'
import type {
  ListOrientation,
  ListSelection,
} from '../../core/list-types'

export type ListFocusMove =
  | 'previous'
  | 'next'
  | 'first'
  | 'last'

export interface ListContextValue {
  selection: ListSelection
  orientation: ListOrientation
  selectedIds: ReadonlySet<string>
  activeId: string | null
  setActiveId(id: string): void
  selectItem(id: string): void
  moveFocus(
    id: string,
    move: ListFocusMove,
  ): void
}

export const ListContext =
  createContext<ListContextValue | null>(
    null,
  )
