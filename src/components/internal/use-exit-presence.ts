import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export type ExitPresenceState =
  | 'open'
  | 'closing'

export function useExitPresence(
  open: boolean,
  reducedMotion: boolean,
  exitDuration: number,
  onExited?: () => void,
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
  const exitCompletedRef = useRef(!open)

  useEffect(() => {
    openRef.current = open
    onExitedRef.current = onExited
  }, [open, onExited])

  const finishExit = useCallback(() => {
    if (
      openRef.current ||
      exitCompletedRef.current
    ) {
      return
    }

    exitCompletedRef.current = true
    setPresent(false)
    onExitedRef.current?.()
  }, [])

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (open) {
      exitCompletedRef.current = false
      setPresent(true)
      setVisualState('open')
      return
    }

    if (!present) return

    setVisualState('closing')

    if (reducedMotion) {
      finishExit()
      return
    }

    const timer = globalThis.setTimeout(
      finishExit,
      exitDuration + 32,
    )

    return () => {
      globalThis.clearTimeout(timer)
    }
  }, [
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
  }
}
