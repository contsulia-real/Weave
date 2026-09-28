import type {
  ViewAnimationConfig,
} from '../../core/motion-types'
import type { ResolvedTheme } from '../../theme/theme-types'
import {
  cyclePlaybackDirection,
  resolveMotionDurationMs,
  resolveMotionKeyframes,
  resolveMotionTiming,
  totalAnimationCycles,
} from '../../renderers/dom/motion-runtime'

export interface MotionSequence {
  cancel: () => void
  finishCurrentCycle: (callback: () => void) => void
  currentAnimation: () => Animation | undefined
}

interface MotionSequenceOptions {
  capturedFrame?: Keyframe
  onComplete?: () => void
}

function withCapturedStart(
  frames: readonly Keyframe[],
  captured: Keyframe | undefined,
  reverse: boolean,
): Keyframe[] {
  const output = frames.map((frame) => ({ ...frame }))
  if (captured === undefined || output.length === 0) return output

  const index = reverse ? output.length - 1 : 0
  const offset = output[index].offset
  output[index] = {
    ...output[index],
    ...captured,
    offset,
  }
  return output
}

export function createMotionSequence(
  element: HTMLElement,
  config: ViewAnimationConfig,
  theme: ResolvedTheme,
  options: MotionSequenceOptions = {},
): MotionSequence | undefined {
  if (
    typeof element.animate !== 'function' ||
    config.keyframes.length < 2
  ) {
    return undefined
  }

  const baseFrames = resolveMotionKeyframes(config.keyframes)
  const timing = resolveMotionTiming(
    config,
    theme,
    'normal',
    'standard',
  )
  const initialDelay = config.delay === undefined
    ? 0
    : resolveMotionDurationMs(config.delay, theme, 'instant')
  const repeatDelay = config.repeatDelay === undefined
    ? 0
    : resolveMotionDurationMs(config.repeatDelay, theme, 'instant')
  const cycles = totalAnimationCycles(config.repeat)

  let cycle = 0
  let animation: Animation | undefined
  let repeatTimer: ReturnType<typeof setTimeout> | undefined
  let cancelled = false
  let finishCallback: (() => void) | undefined

  const clearRepeatTimer = () => {
    if (repeatTimer !== undefined) {
      globalThis.clearTimeout(repeatTimer)
      repeatTimer = undefined
    }
  }

  const cancel = () => {
    cancelled = true
    finishCallback = undefined
    clearRepeatTimer()
    animation?.cancel()
    animation = undefined
  }

  const finishSequence = () => {
    if (cancelled) return
    options.onComplete?.()
  }

  const startCycle = () => {
    if (cancelled) return

    const playbackDirection = cyclePlaybackDirection(
      config.direction,
      cycle,
    )
    const frames = withCapturedStart(
      baseFrames,
      cycle === 0 ? options.capturedFrame : undefined,
      playbackDirection === 'reverse',
    )

    const current = element.animate(frames, {
      duration: timing.durationMs,
      delay: cycle === 0 ? initialDelay : 0,
      easing: timing.easing,
      direction: playbackDirection,
      fill: 'both',
    })
    animation = current

    current.onfinish = () => {
      if (cancelled || animation !== current) return

      if (finishCallback !== undefined) {
        const callback = finishCallback
        finishCallback = undefined
        current.cancel()
        animation = undefined
        callback()
        return
      }

      cycle += 1
      if (cycle >= cycles) {
        finishSequence()
        return
      }

      const continueSequence = () => {
        repeatTimer = undefined
        current.cancel()
        if (animation === current) animation = undefined
        startCycle()
      }

      if (repeatDelay > 0) {
        repeatTimer = globalThis.setTimeout(
          continueSequence,
          repeatDelay,
        )
      } else {
        continueSequence()
      }
    }
  }

  startCycle()

  return {
    cancel,
    currentAnimation: () => animation,
    finishCurrentCycle(callback) {
      if (cancelled) {
        callback()
        return
      }

      if (repeatTimer !== undefined) {
        clearRepeatTimer()
        animation?.cancel()
        animation = undefined
        callback()
        return
      }

      if (
        animation === undefined ||
        animation.playState === 'finished'
      ) {
        callback()
        return
      }

      finishCallback = callback
    },
  }
}
