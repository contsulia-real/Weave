import { useContext, useEffect, useRef, useState } from 'react'
import type { ViewProps } from '../../core/view-types'
import {
  resolveViewEnterExit,
  resolveViewTransition,
  type ViewMotionState,
} from '../../renderers/dom/resolve-motion'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import type { ResolvedTheme } from '../../theme/theme-types'
import { PresenceContext } from './presence-context'
import { scheduleAnimationFrame } from './schedule-animation-frame'

interface ViewMotionHostResult {
  className: string | undefined
  state: ViewMotionState | undefined
}

function definitionKey(value: unknown): string {
  return JSON.stringify(value ?? null)
}

function scheduleAfterPaint(callback: () => void): () => void {
  let cancelSecond: (() => void) | undefined
  const cancelFirst = scheduleAnimationFrame(() => {
    cancelSecond = scheduleAnimationFrame(() => {
      callback()
    })
  })

  return () => {
    cancelFirst()
    cancelSecond?.()
  }
}

export function useViewMotion<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  theme: ResolvedTheme,
  reducedMotion: boolean,
): ViewMotionHostResult {
  const presence = useContext(PresenceContext)
  const [exitId] = useState(() => Symbol('weave-motion-exit'))
  const enterCommitted = useRef(false)
  const exitKey = definitionKey(props.exit)

  const enterMotion = resolveViewEnterExit(props.enter, 'enter', theme, reducedMotion)
  const exitMotion = resolveViewEnterExit(props.exit, 'exit', theme, reducedMotion)

  const [state, setState] = useState<ViewMotionState | undefined>(() =>
    enterMotion !== undefined && !reducedMotion ? 'enter-from' : undefined,
  )
  const stateRef = useRef<ViewMotionState | undefined>(state)

  const framesClassName = useRuntimeStyleClass(
    'motion-frames',
    enterMotion === undefined && exitMotion === undefined
      ? undefined
      : {
          ...enterMotion?.frames,
          ...exitMotion?.frames,
        },
  )

  const activeTransition =
    state?.startsWith('enter') === true
      ? enterMotion?.transition
      : state?.startsWith('exit') === true
        ? exitMotion?.transition
        : resolveViewTransition(props.transition, theme, reducedMotion)

  const transitionClassName = useRuntimeStyleClass('motion', activeTransition)

  const registerExit = presence?.registerExit
  const completeExit = presence?.completeExit
  const exiting = presence?.exiting === true
  const hasExit = props.exit !== undefined
  const hasEnterMotion = enterMotion !== undefined
  const hasExitMotion = exitMotion !== undefined
  const enterMilliseconds = enterMotion?.totalMilliseconds ?? 0
  const exitMilliseconds = exitMotion?.totalMilliseconds ?? 0

  useEffect(() => {
    if (registerExit === undefined || !hasExit) return
    return registerExit(exitId)
  }, [exitId, hasExit, registerExit])

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    let cancelPaintBarrier: (() => void) | undefined
    let completionTimer: ReturnType<typeof setTimeout> | undefined
    let watchdogTimer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const clearTimers = () => {
      cancelPaintBarrier?.()
      if (completionTimer !== undefined) {
        globalThis.clearTimeout(completionTimer)
      }
      if (watchdogTimer !== undefined) {
        globalThis.clearTimeout(watchdogTimer)
      }
    }

    if (exiting) {
      if (!hasExitMotion) {
        completeExit?.(exitId)
        return clearTimers
      }

      if (reducedMotion) {
        stateRef.current = undefined
        setState(undefined)
        completeExit?.(exitId)
        return clearTimers
      }

      stateRef.current = 'exit-to'
      setState('exit-to')
      watchdogTimer = globalThis.setTimeout(() => {
        if (!cancelled) completeExit?.(exitId)
      }, exitMilliseconds + 250)
      completionTimer = globalThis.setTimeout(() => {
        if (cancelled) return
        if (watchdogTimer !== undefined) {
          globalThis.clearTimeout(watchdogTimer)
        }
        completeExit?.(exitId)
      }, exitMilliseconds + 20)

      return () => {
        cancelled = true
        clearTimers()
      }
    }

    if (enterCommitted.current) {
      if (stateRef.current?.startsWith('exit') === true) {
        if (hasEnterMotion && !reducedMotion) {
          stateRef.current = 'enter-to'
          setState('enter-to')
          completionTimer = globalThis.setTimeout(() => {
            if (cancelled) return
            stateRef.current = undefined
            setState(undefined)
          }, enterMilliseconds + 20)
        } else {
          stateRef.current = undefined
          setState(undefined)
        }
      }
      return clearTimers
    }

    if (!hasEnterMotion || reducedMotion) {
      enterCommitted.current = true
      stateRef.current = undefined
      setState(undefined)
      return clearTimers
    }

    stateRef.current = 'enter-from'
    setState('enter-from')
    watchdogTimer = globalThis.setTimeout(() => {
      if (cancelled) return
      enterCommitted.current = true
      stateRef.current = undefined
      setState(undefined)
    }, enterMilliseconds + 250)
    cancelPaintBarrier = scheduleAfterPaint(() => {
      if (cancelled) return
      enterCommitted.current = true
      stateRef.current = 'enter-to'
      setState('enter-to')
      completionTimer = globalThis.setTimeout(() => {
        if (cancelled) return
        if (watchdogTimer !== undefined) {
          globalThis.clearTimeout(watchdogTimer)
        }
        stateRef.current = undefined
        setState(undefined)
      }, enterMilliseconds + 20)
    })

    return () => {
      cancelled = true
      clearTimers()
    }
  }, [
    completeExit,
    enterMilliseconds,
    exitId,
    exitKey,
    exitMilliseconds,
    exiting,
    hasEnterMotion,
    hasExitMotion,
    reducedMotion,
  ])
  /* oxlint-enable react/set-state-in-effect */

  return {
    className: [framesClassName, transitionClassName].filter(Boolean).join(' ') || undefined,
    state,
  }
}
