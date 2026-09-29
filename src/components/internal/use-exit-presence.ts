import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export type ExitPresenceState =
  | 'open'
  | 'closing'

export function finishExitOnTransition(
  event: {
    target: EventTarget | null
    currentTarget: EventTarget | null
  },
  open: boolean,
  visualState: ExitPresenceState,
  finishExit: () => void,
): void {
  if (
    event.target !==
      event.currentTarget ||
    open ||
    visualState !== 'closing'
  ) {
    return
  }

  finishExit()
}

export function useExitPresence(
  open: boolean,
  reducedMotion: boolean,
  exitDuration: number,
  onExited?: () => void,
  coordinateRegisteredExits = false,
) {
  const [
    present,
    setPresent,
  ] = useState(open)
  const [
    visualState,
    setVisualState,
  ] = useState<ExitPresenceState>('open')
  const openRef = useRef(open)
  const onExitedRef = useRef(onExited)
  const exitCompletedRef =
    useRef(!open)
  const registered =
    useRef(new Set<symbol>())
  const pending =
    useRef(new Set<symbol>())
  const closingRef =
    useRef(false)

  useEffect(() => {
    openRef.current = open
    onExitedRef.current = onExited
  }, [open, onExited])

  const finishExit =
    useCallback(() => {
      if (
        openRef.current ||
        exitCompletedRef.current
      ) {
        return
      }

      exitCompletedRef.current = true
      closingRef.current = false
      pending.current.clear()
      setPresent(false)
      onExitedRef.current?.()
    }, [])

  const registerExit =
    useCallback(
      (id: symbol) => {
        registered.current.add(id)

        return () => {
          registered.current.delete(id)
          pending.current.delete(id)

          if (
            coordinateRegisteredExits &&
            closingRef.current &&
            pending.current.size === 0
          ) {
            finishExit()
          }
        }
      },
      [
        coordinateRegisteredExits,
        finishExit,
      ],
    )

  const completeExit =
    useCallback(
      (id: symbol) => {
        if (
          !coordinateRegisteredExits ||
          !closingRef.current
        ) {
          return
        }

        pending.current.delete(id)

        if (
          pending.current.size === 0
        ) {
          finishExit()
        }
      },
      [
        coordinateRegisteredExits,
        finishExit,
      ],
    )

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (open) {
      exitCompletedRef.current = false
      closingRef.current = false
      pending.current.clear()
      setPresent(true)
      setVisualState('open')
      return
    }

    if (!present) return

    if (coordinateRegisteredExits) {
      pending.current =
        new Set(registered.current)
      closingRef.current = true
      setVisualState('closing')

      if (
        pending.current.size === 0
      ) {
        finishExit()
      }

      return
    }

    closingRef.current = true
    setVisualState('closing')

    if (reducedMotion) {
      finishExit()
      return
    }

    const timer =
      globalThis.setTimeout(
        finishExit,
        exitDuration + 32,
      )

    return () => {
      globalThis.clearTimeout(timer)
    }
  }, [
    coordinateRegisteredExits,
    exitDuration,
    finishExit,
    open,
    present,
    reducedMotion,
  ])
  /* oxlint-enable react/set-state-in-effect */

  return {
    present,
    visualState,
    finishExit,
    registerExit,
    completeExit,
  }
}
