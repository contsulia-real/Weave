import {
  useEffect,
  useRef,
  useState,
} from 'react'

export const SNACK_PROGRESS_UPDATE_MS = 50

export function useSnackLifetime(
  open: boolean,
  durationMs: number,
  persistent: boolean,
  progress: boolean,
  onExpire: () => void,
) {
  const [
    paused,
    setPaused,
  ] = useState(false)
  const [
    remainingMs,
    setRemainingMs,
  ] = useState(durationMs)
  const previousOpenRef =
    useRef(open)
  const remainingMsRef =
    useRef(durationMs)
  const activeStartedAtRef =
    useRef<number | null>(null)
  const onExpireRef =
    useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    const wasOpen =
      previousOpenRef.current
    previousOpenRef.current = open

    if (
      open &&
      !wasOpen
    ) {
      remainingMsRef.current =
        durationMs
      activeStartedAtRef.current =
        null
      setRemainingMs(durationMs)
    }
  }, [
    durationMs,
    open,
  ])

  useEffect(() => {
    if (
      !open ||
      persistent ||
      paused
    ) {
      return
    }

    const startRemaining =
      remainingMsRef.current

    if (startRemaining <= 0) {
      onExpireRef.current()
      return
    }

    const startedAt =
      Date.now()
    activeStartedAtRef.current =
      startedAt

    const updateProgress = () => {
      const elapsed =
        Math.max(
          0,
          Date.now() - startedAt,
        )
      const nextRemaining =
        Math.max(
          0,
          startRemaining - elapsed,
        )

      setRemainingMs(
        nextRemaining,
      )
    }

    if (progress) {
      updateProgress()
    }

    const progressTimer =
      progress
        ? globalThis.setInterval(
            updateProgress,
            SNACK_PROGRESS_UPDATE_MS,
          )
        : undefined

    const closeTimer =
      globalThis.setTimeout(
        () => {
          remainingMsRef.current = 0
          activeStartedAtRef.current =
            null
          setRemainingMs(0)
          onExpireRef.current()
        },
        startRemaining,
      )

    return () => {
      if (
        progressTimer !== undefined
      ) {
        globalThis.clearInterval(
          progressTimer,
        )
      }
      globalThis.clearTimeout(
        closeTimer,
      )

      if (
        activeStartedAtRef.current !==
        startedAt
      ) {
        return
      }

      const elapsed =
        Math.max(
          0,
          Date.now() - startedAt,
        )
      const nextRemaining =
        Math.max(
          0,
          startRemaining - elapsed,
        )

      remainingMsRef.current =
        nextRemaining
      activeStartedAtRef.current =
        null
      setRemainingMs(
        nextRemaining,
      )
    }
  }, [
    open,
    paused,
    persistent,
    progress,
  ])

  const lifetimeProgress =
    durationMs <= 0
      ? 0
      : Math.min(
          1,
          Math.max(
            0,
            remainingMs /
              durationMs,
          ),
        )

  return {
    paused,
    setPaused,
    remainingMs,
    lifetimeProgress,
  }
}
