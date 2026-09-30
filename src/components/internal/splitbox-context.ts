import { createContext, useContext } from 'react'

export type SplitBoxPanePosition = 'start' | 'end'

export interface SplitBoxPaneContextValue {
  position: SplitBoxPanePosition
  collapsed: boolean
}

export const SplitBoxPaneContext = createContext<SplitBoxPaneContextValue | null>(null)

export function useSplitBoxPaneContext(): SplitBoxPaneContextValue {
  const context = useContext(SplitBoxPaneContext)

  if (context === null) {
    throw new Error('SplitBoxPane must be used inside SplitBox')
  }

  return context
}
