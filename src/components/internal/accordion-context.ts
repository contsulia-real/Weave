import { createContext, useContext } from 'react'

interface AccordionContextValue {
  disabled: boolean
  isOpen(value: string): boolean
  requestToggle(value: string): void
  triggerId(value: string): string
  panelId(value: string): string
}

interface AccordionItemContextValue {
  value: string
  disabled: boolean
}

export const AccordionContext = createContext<AccordionContextValue | null>(null)
export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

export function useAccordionContext(component: string): AccordionContextValue {
  const context = useContext(AccordionContext)

  if (context === null) {
    throw new Error(`${component} must be used inside Accordion`)
  }

  return context
}

export function useAccordionItemContext(component: string): AccordionItemContextValue {
  const context = useContext(AccordionItemContext)

  if (context === null) {
    throw new Error(`${component} must be used inside AccordionItem`)
  }

  return context
}
