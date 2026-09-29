import type { RefObject } from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import type {
  MotionInterruption,
  ViewLayoutAnimation,
  ViewLayoutAnimationConfig,
} from '../../core/motion-types'
import { resolveMotionTiming } from '../../renderers/dom/motion-runtime'
import type { ResolvedTheme } from '../../theme/theme-types'
import { scheduleAnimationFrame } from './schedule-animation-frame'

interface LayoutRect {
  left: number
  top: number
  width: number
  height: number
}

const POSITION_EPSILON = 0.5
const SCALE_EPSILON = 0.002

function snapshot(element: HTMLElement): LayoutRect {
  const rect = element.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  }
}

function config(value: Exclude<ViewLayoutAnimation, false>): ViewLayoutAnimationConfig {
  return value === true ? {} : value
}

function nearlyEqual(previous: LayoutRect, next: LayoutRect): boolean {
  return (
    Math.abs(previous.left - next.left) < POSITION_EPSILON &&
    Math.abs(previous.top - next.top) < POSITION_EPSILON &&
    Math.abs(previous.width - next.width) < POSITION_EPSILON &&
    Math.abs(previous.height - next.height) < POSITION_EPSILON
  )
}

function scale(previous: number, next: number): number {
  if (previous <= 0 || next <= 0) return 1
  return previous / next
}

function layoutKeyframes(previous: LayoutRect, next: LayoutRect): Keyframe[] {
  const x = previous.left - next.left
  const y = previous.top - next.top
  const scaleX = scale(previous.width, next.width)
  const scaleY = scale(previous.height, next.height)

  return [
    {
      translate: `${x}px ${y}px`,
      scale:
        `${Math.abs(scaleX - 1) < SCALE_EPSILON ? 1 : scaleX} ` +
        `${Math.abs(scaleY - 1) < SCALE_EPSILON ? 1 : scaleY}`,
    },
    {
      translate: '0px 0px',
      scale: '1 1',
    },
  ]
}

export function useViewLayoutAnimation<TElement extends HTMLElement>(
  elementRef: RefObject<TElement | null>,
  value: ViewLayoutAnimation | undefined,
  theme: ResolvedTheme,
  reducedMotion: boolean,
): void {
  const targetRect = useRef<LayoutRect | undefined>(undefined)
  const visualRect = useRef<LayoutRect | undefined>(undefined)
  const animation = useRef<Animation | undefined>(undefined)
  const cancelSample = useRef<(() => void) | undefined>(undefined)

  const stopSampling = () => {
    cancelSample.current?.()
    cancelSample.current = undefined
  }

  const cancelAnimation = () => {
    const current = animation.current
    animation.current = undefined
    stopSampling()
    current?.cancel()
  }

  useLayoutEffect(() => {
    const element = elementRef.current
    if (element === null) return

    const running = animation.current
    const resolved = value === undefined || value === false ? undefined : config(value)
    const interruption: MotionInterruption = resolved?.interruption ?? 'continue'
    const logicalPrevious = targetRect.current
    const previous =
      running === undefined
        ? logicalPrevious
        : interruption === 'continue'
          ? (visualRect.current ?? logicalPrevious)
          : logicalPrevious

    if (running !== undefined) {
      if (interruption === 'finish') {
        try {
          running.finish()
        } catch {
          // A detached or already-finished animation can be cancelled safely.
        }
      }
      cancelAnimation()
      delete element.dataset.weaveLayoutAnimating
    }

    const next = snapshot(element)
    targetRect.current = next

    if (
      resolved === undefined ||
      reducedMotion ||
      previous === undefined ||
      nearlyEqual(previous, next) ||
      typeof element.animate !== 'function'
    ) {
      visualRect.current = next
      return
    }

    const timing = resolveMotionTiming(resolved, theme, 'normal', 'standard')
    element.dataset.weaveLayoutAnimating = 'true'
    visualRect.current = previous

    const current = element.animate(layoutKeyframes(previous, next), {
      duration: timing.durationMs,
      easing: timing.easing,
      fill: 'both',
    })
    animation.current = current

    const sample = () => {
      if (animation.current !== current) return
      visualRect.current = snapshot(element)
      cancelSample.current = scheduleAnimationFrame(sample)
    }
    cancelSample.current = scheduleAnimationFrame(sample)

    current.onfinish = () => {
      if (animation.current !== current) return
      animation.current = undefined
      stopSampling()
      current.cancel()
      delete element.dataset.weaveLayoutAnimating
      const finalRect = snapshot(element)
      targetRect.current = finalRect
      visualRect.current = finalRect
    }
  })

  useEffect(() => {
    const element = elementRef.current
    if (element === null) return

    const document = element.ownerDocument
    const view = document.defaultView
    let cancelBaselineSync: (() => void) | undefined

    const syncBaseline = () => {
      if (animation.current !== undefined) return

      cancelBaselineSync?.()
      cancelBaselineSync = scheduleAnimationFrame(() => {
        cancelBaselineSync = undefined
        const current = elementRef.current
        if (current === null || animation.current !== undefined) {
          return
        }

        const currentRect = snapshot(current)
        targetRect.current = currentRect
        visualRect.current = currentRect
      })
    }

    document.addEventListener('scroll', syncBaseline, true)
    view?.addEventListener('resize', syncBaseline)

    const observer =
      typeof ResizeObserver === 'function' ? new ResizeObserver(syncBaseline) : undefined
    observer?.observe(element)

    return () => {
      document.removeEventListener('scroll', syncBaseline, true)
      view?.removeEventListener('resize', syncBaseline)
      observer?.disconnect()
      cancelBaselineSync?.()
      cancelAnimation()
    }
  }, [elementRef])
}
