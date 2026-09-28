import { createContext } from 'react'

export interface PresenceContextValue {
  exiting: boolean
  registerExit: (id: symbol) => () => void
  completeExit: (id: symbol) => void
}

export const PresenceContext =
  createContext<PresenceContextValue | null>(null)
