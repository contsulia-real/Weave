import type { RefObject } from 'react'
import { useLayoutEffect, useRef } from 'react'
import type {
  MotionStaggerConfig,
  ViewEnterExit,
  ViewEnterExitConfig,
} from '../../core/motion-types'
import {
  motionStyleToKeyframe,
  resolveMotionDurationMs,
  resolveMotionTiming,
} from '../../renderers/dom/motion-runtime'
import { resolveViewEnterExitDefinition } from '../../renderers/dom/resolve-motion'
import type { ResolvedTheme } from '../../theme/theme-types'

function staggerConfig(definition: ViewEnterExitConfig): MotionStaggerConfig | undefined {
  if (definition.children !== undefined) return definition.children
  if (definition.stagger === undefined) return undefined

  return {
    stagger: definition.stagger,
    delay: definition.delay,
  }
}

function staggerIndex(index: number, count: number, from: MotionStaggerConfig['from']): number {
  if (from === 'last') return count - 1 - index
  if (from === 'center') {
    return Math.abs(index - (count - 1) / 2)
  }
  return index
}

function directViewChildren(element: HTMLElement): HTMLElement[] {
  const HTMLElementConstructor = element.ownerDocument.defaultView?.HTMLElement
  if (HTMLElementConstructor === undefined) return []

  return Array.from(element.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElementConstructor && child.hasAttribute('data-weave-view'),
  )
}

export function useViewEnterStagger<TElement extends HTMLElement>(
  elementRef: RefObject<TElement | null>,
  enter: ViewEnterExit | undefined,
  theme: ResolvedTheme,
  reducedMotion: boolean,
): void {
  const started = useRef(false)

  useLayoutEffect(() => {
    if (started.current) return
    if (enter === undefined || reducedMotion) {
      started.current = true
      return
    }

    const element = elementRef.current
    if (element === null) return

    const definition = resolveViewEnterExitDefinition(enter, 'enter')
    const stagger = staggerConfig(definition)
    if (stagger === undefined || definition.from === undefined || definition.to === undefined) {
      started.current = true
      return
    }

    const children = directViewChildren(element)
    if (children.length === 0) {
      started.current = true
      return
    }

    const timing = resolveMotionTiming(definition, theme, 'normal', 'enter')
    const staggerMs = resolveMotionDurationMs(stagger.stagger, theme, 'instant')
    const delayMs =
      stagger.delay === undefined ? 0 : resolveMotionDurationMs(stagger.delay, theme, 'instant')
    const frames = [motionStyleToKeyframe(definition.from), motionStyleToKeyframe(definition.to)]

    for (let index = 0; index < children.length; index += 1) {
      const child = children[index]
      if (typeof child.animate !== 'function') continue

      const order = staggerIndex(index, children.length, stagger.from)
      const animation = child.animate(frames, {
        duration: timing.durationMs,
        delay: delayMs + order * staggerMs,
        easing: timing.easing,
        fill: 'both',
      })
      animation.onfinish = () => animation.cancel()
    }

    started.current = true
  }, [elementRef, enter, reducedMotion, theme])
}
