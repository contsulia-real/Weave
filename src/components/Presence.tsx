import { type ReactNode, useMemo } from 'react'
import { PresenceContext, type PresenceContextValue } from './internal/presence-context'
import { useExitPresence } from './internal/use-exit-presence'

export interface PresenceProps {
  present: boolean
  children?: ReactNode
  onExitComplete?: () => void
}

export function Presence({ present, children, onExitComplete }: PresenceProps) {
  const {
    present: mounted,
    visualState,
    registerExit,
    completeExit,
  } = useExitPresence(present, false, 0, onExitComplete, true)

  const context = useMemo<PresenceContextValue>(
    () => ({
      exiting: visualState === 'closing',
      registerExit,
      completeExit,
    }),
    [completeExit, registerExit, visualState],
  )

  if (!mounted) return null

  return <PresenceContext.Provider value={context}>{children}</PresenceContext.Provider>
}
