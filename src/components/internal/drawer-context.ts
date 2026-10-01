import { createContext, type PointerEvent, useContext } from 'react'
import type { DrawerSide } from '../../core/drawer-types'

interface DrawerHandleContextValue {
  active: boolean
  dragging: boolean
  side: DrawerSide
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void
}

export const DrawerHandleContext = createContext<DrawerHandleContextValue | null>(null)

export function useDrawerHandleContext(): DrawerHandleContextValue {
  const context = useContext(DrawerHandleContext)

  if (context === null) {
    throw new Error('DrawerHandle must be rendered inside Drawer drawer content')
  }

  return context
}
