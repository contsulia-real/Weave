import type { RefObject } from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import type { MotionInterruption, ViewAnimationConfig } from '../../core/motion-types'
import {
  captureComputedMotionKeyframe,
  cyclePlaybackDirection,
  motionStyleProperties,
  resolveMotionKeyframes,
  resolveViewAnimation,
} from '../../renderers/dom/motion-runtime'
import type { ResolvedTheme } from '../../theme/theme-types'
import { createMotionSequence, type MotionSequence } from './motion-sequence'

function animationKey(
  config: ViewAnimationConfig | undefined,
  theme: ResolvedTheme,
  reducedMotion: boolean,
): string {
  return JSON.stringify([
    config ?? null,
    theme.tokens.motion?.duration ?? null,
    theme.tokens.motion?.curve ?? null,
    theme.tokens.motion?.spring ?? null,
    reducedMotion,
  ])
}

function finalFrame(config: ViewAnimationConfig): Keyframe | undefined {
  const frames = resolveMotionKeyframes(config.keyframes)
  if (frames.length === 0) return undefined

  if (config.repeat === 'infinite') return { ...frames[0] }

  const lastCycle = Math.max(0, Math.floor(config.repeat ?? 0))
  const reverse = cyclePlaybackDirection(config.direction, lastCycle) === 'reverse'
  return { ...(reverse ? frames[0] : frames[frames.length - 1]) }
}

function applyReducedMotionFrame(
  element: HTMLElement,
  config: ViewAnimationConfig | undefined,
): Animation | undefined {
  if (config === undefined || typeof element.animate !== 'function') {
    return undefined
  }

  const frame = finalFrame(config)
  if (frame === undefined) return undefined

  return element.animate([frame, frame], {
    duration: 0,
    fill: 'both',
  })
}

export function useViewAnimation<TElement extends HTMLElement>(
  elementRef: RefObject<TElement | null>,
  value: Parameters<typeof resolveViewAnimation>[0],
  theme: ResolvedTheme,
  reducedMotion: boolean,
): void {
  const sequence = useRef<MotionSequence | undefined>(undefined)
  const reducedAnimation = useRef<Animation | undefined>(undefined)
  const activeKey = useRef<string | undefined>(undefined)
  const pendingKey = useRef<string | undefined>(undefined)
  const pendingStart = useRef<(() => void) | undefined>(undefined)
  const waitingForFinish = useRef(false)

  useLayoutEffect(() => {
    const element = elementRef.current
    if (element === null) return

    const config = resolveViewAnimation(value, theme)
    const key = animationKey(config, theme, reducedMotion)

    // A finish interruption may already have a queued target. If the newest
    // render returns to the animation that is currently active, that active
    // animation is now the latest target and the old queued retarget is stale.
    if (waitingForFinish.current && activeKey.current === key) {
      pendingKey.current = undefined
      pendingStart.current = undefined
      return
    }

    if (activeKey.current === key || pendingKey.current === key) return

    const start = (capturedFrame?: Keyframe) => {
      sequence.current?.cancel()
      sequence.current = undefined
      reducedAnimation.current?.cancel()
      reducedAnimation.current = undefined
      waitingForFinish.current = false
      pendingKey.current = undefined
      pendingStart.current = undefined
      activeKey.current = key

      if (config === undefined) return

      if (reducedMotion) {
        reducedAnimation.current = applyReducedMotionFrame(element, config)
        return
      }

      sequence.current = createMotionSequence(element, config, theme, { capturedFrame })
    }

    const current = sequence.current
    if (current === undefined) {
      start()
      return
    }

    const interruption: MotionInterruption = config?.interruption ?? 'continue'

    if (interruption === 'finish') {
      pendingKey.current = key
      pendingStart.current = () => start()

      if (!waitingForFinish.current) {
        waitingForFinish.current = true
        current.finishCurrentCycle(() => {
          waitingForFinish.current = false
          const next = pendingStart.current
          if (next === undefined) return false
          next()
          return true
        })
      }
      return
    }

    let capturedFrame: Keyframe | undefined
    if (interruption === 'continue' && config !== undefined) {
      capturedFrame = captureComputedMotionKeyframe(
        element,
        motionStyleProperties(config.keyframes),
      )
    }

    current.cancel()
    sequence.current = undefined
    start(capturedFrame)
  })

  useEffect(
    () => () => {
      pendingStart.current = undefined
      pendingKey.current = undefined
      waitingForFinish.current = false
      activeKey.current = undefined
      sequence.current?.cancel()
      sequence.current = undefined
      reducedAnimation.current?.cancel()
      reducedAnimation.current = undefined
    },
    [],
  )
}
