import { createContext, type RefObject } from 'react'
import type { Length } from '../../core/view-types'

interface MenuRootContextValue {
  rootId: string
  closeAll(): void
  closeOnSelect: boolean
  submenuOffset: Length
  viewportPadding: Length
}

export const MenuRootContext = createContext<MenuRootContextValue | null>(null)

export interface MenuLevelContextValue {
  levelId: string
  panelRef: RefObject<HTMLDivElement | null>
  parentItemRef?: RefObject<HTMLDivElement | null>
  openSubmenuId: string | null
  setOpenSubmenuId(id: string | null): void
  moveFocus(current: HTMLDivElement | null, move: 'previous' | 'next' | 'first' | 'last'): void
  focusFirst(): void
  focusLast(): void
  closeLevel(): void
}

export const MenuLevelContext = createContext<MenuLevelContextValue | null>(null)
