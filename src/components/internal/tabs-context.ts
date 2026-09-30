import { createContext, useContext } from 'react'
import type { TabsActivation, TabsOrientation, TabsVariant } from '../../core/tabs-types'

export interface TabsContextValue {
  value: string | null
  focusValue: string | null
  orientation: TabsOrientation
  activation: TabsActivation
  variant: TabsVariant
  requestValue(value: string): void
  requestFocus(value: string): void
  tabId(value: string): string
  panelId(value: string): string
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext(component: string): TabsContextValue {
  const context = useContext(TabsContext)

  if (context === null) {
    throw new Error(`${component} must be rendered inside Tabs.`)
  }

  return context
}
