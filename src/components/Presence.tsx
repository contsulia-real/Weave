import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  PresenceContext,
  type PresenceContextValue,
} from './internal/presence-context'

export interface PresenceProps {
  present: boolean
  children?: ReactNode
  onExitComplete?: () => void
}

export function Presence({
  present,
  children,
  onExitComplete,
}: PresenceProps) {
  const [mounted, setMounted] = useState(present)
  const [exiting, setExiting] = useState(false)
  const registered = useRef(new Set<symbol>())
  const pending = useRef(new Set<symbol>())
  const exitingRef = useRef(false)

  const finishExit = useCallback(() => {
    pending.current.clear()
    exitingRef.current = false
    setExiting(false)
    setMounted(false)
    onExitComplete?.()
  }, [onExitComplete])

  const registerExit = useCallback(
    (id: symbol) => {
      registered.current.add(id)

      return () => {
        registered.current.delete(id)
        pending.current.delete(id)

        if (
          exitingRef.current &&
          pending.current.size === 0
        ) {
          finishExit()
        }
      }
    },
    [finishExit],
  )

  const completeExit = useCallback(
    (id: symbol) => {
      if (!exitingRef.current) return

      pending.current.delete(id)
      if (pending.current.size === 0) {
        finishExit()
      }
    },
    [finishExit],
  )

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (present) {
      pending.current.clear()
      exitingRef.current = false
      setExiting(false)
      setMounted(true)
      return
    }

    if (!mounted) return

    pending.current = new Set(registered.current)
    if (pending.current.size === 0) {
      finishExit()
      return
    }

    exitingRef.current = true
    setExiting(true)
  }, [finishExit, mounted, present])
  /* oxlint-enable react/set-state-in-effect */

  const context = useMemo<PresenceContextValue>(
    () => ({
      exiting,
      registerExit,
      completeExit,
    }),
    [completeExit, exiting, registerExit],
  )

  if (!mounted) return null

  return (
    <PresenceContext.Provider value={context}>
      {children}
    </PresenceContext.Provider>
  )
}
