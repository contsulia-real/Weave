import {
  createContext,
  type RefObject,
} from 'react'

export interface MenuRootContextValue {
  rootId: string
  closeAll(): void
  closeOnSelect: boolean
  submenuOffset: string
  viewportPadding: string
}

export const MenuRootContext =
  createContext<MenuRootContextValue | null>(
    null,
  )

export interface MenuLevelContextValue {
  levelId: string
  panelRef:
    RefObject<HTMLDivElement | null>
  parentItemRef?:
    RefObject<HTMLDivElement | null>
  openSubmenuId:
    string | null
  setOpenSubmenuId(
    id: string | null,
  ): void
  moveFocus(
    current:
      HTMLDivElement | null,
    move:
      | 'previous'
      | 'next'
      | 'first'
      | 'last',
  ): void
  focusFirst(): void
  focusLast(): void
  closeLevel(): void
}

export const MenuLevelContext =
  createContext<MenuLevelContextValue | null>(
    null,
  )
