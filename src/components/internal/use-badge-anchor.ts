import {
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'

interface VisualRect {
  left: number
  top: number
  right: number
  bottom: number
}

function sameRect(
  first: VisualRect | undefined,
  second: VisualRect,
): boolean {
  if (first === undefined) return false

  return (
    Math.abs(first.left - second.left) < 0.01 &&
    Math.abs(first.top - second.top) < 0.01 &&
    Math.abs(first.right - second.right) < 0.01 &&
    Math.abs(first.bottom - second.bottom) < 0.01
  )
}

function setAnchorVariables(
  wrapper: HTMLElement,
  target: HTMLElement,
): VisualRect {
  const wrapperRect = wrapper.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const rect = {
    left: targetRect.left - wrapperRect.left,
    top: targetRect.top - wrapperRect.top,
    right: targetRect.right - wrapperRect.left,
    bottom: targetRect.bottom - wrapperRect.top,
  }

  wrapper.style.setProperty(
    '--weave-badge-target-left',
    `${rect.left}px`,
  )
  wrapper.style.setProperty(
    '--weave-badge-target-top',
    `${rect.top}px`,
  )
  wrapper.style.setProperty(
    '--weave-badge-target-right',
    `${rect.right}px`,
  )
  wrapper.style.setProperty(
    '--weave-badge-target-bottom',
    `${rect.bottom}px`,
  )
  wrapper.style.setProperty(
    '--weave-badge-target-center-x',
    `${(rect.left + rect.right) / 2}px`,
  )
  wrapper.style.setProperty(
    '--weave-badge-target-center-y',
    `${(rect.top + rect.bottom) / 2}px`,
  )

  return rect
}

export function useBadgeAnchor(
  wrapperRef: RefObject<HTMLSpanElement | null>,
  children: ReactNode,
): void {
  const frameRef = useRef<number | undefined>(undefined)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const target = wrapper?.firstElementChild

    if (
      wrapper === null ||
      wrapper === undefined ||
      !(target instanceof HTMLElement)
    ) {
      return
    }

    const view = target.ownerDocument.defaultView
    let lastRect: VisualRect | undefined
    let stableFrames = 0
    let visualEffects = 0

    const hasRunningAnimation = () =>
      typeof target.getAnimations === 'function' &&
      target
        .getAnimations({ subtree: true })
        .some((animation) =>
          animation.playState === 'running' ||
          animation.pending,
        )

    const sync = () => {
      const nextRect = setAnchorVariables(wrapper, target)
      stableFrames = sameRect(lastRect, nextRect)
        ? stableFrames + 1
        : 0
      lastRect = nextRect
    }

    const queueFrame = () => {
      if (
        frameRef.current !== undefined ||
        view === null ||
        typeof view.requestAnimationFrame !== 'function'
      ) {
        return
      }

      frameRef.current = view.requestAnimationFrame(() => {
        frameRef.current = undefined
        sync()

        if (
          visualEffects > 0 ||
          hasRunningAnimation() ||
          stableFrames < 2
        ) {
          queueFrame()
        }
      })
    }

    const startTracking = () => {
      stableFrames = 0
      sync()
      queueFrame()
    }

    const beginVisualEffect = () => {
      visualEffects += 1
      startTracking()
    }

    const endVisualEffect = () => {
      visualEffects = Math.max(0, visualEffects - 1)
      startTracking()
    }

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(startTracking)

    resizeObserver?.observe(wrapper)
    resizeObserver?.observe(target)

    const mutationObserver =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(startTracking)

    mutationObserver?.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    for (const eventName of [
      'pointerenter',
      'pointerleave',
      'pointerdown',
      'pointerup',
      'pointercancel',
      'focusin',
      'focusout',
    ]) {
      target.addEventListener(eventName, startTracking)
    }

    target.addEventListener('transitionrun', beginVisualEffect)
    target.addEventListener('transitionend', endVisualEffect)
    target.addEventListener('transitioncancel', endVisualEffect)
    target.addEventListener('animationstart', beginVisualEffect)
    target.addEventListener('animationend', endVisualEffect)
    target.addEventListener('animationcancel', endVisualEffect)
    view?.addEventListener('resize', startTracking)

    startTracking()

    return () => {
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()

      for (const eventName of [
        'pointerenter',
        'pointerleave',
        'pointerdown',
        'pointerup',
        'pointercancel',
        'focusin',
        'focusout',
      ]) {
        target.removeEventListener(eventName, startTracking)
      }

      target.removeEventListener('transitionrun', beginVisualEffect)
      target.removeEventListener('transitionend', endVisualEffect)
      target.removeEventListener('transitioncancel', endVisualEffect)
      target.removeEventListener('animationstart', beginVisualEffect)
      target.removeEventListener('animationend', endVisualEffect)
      target.removeEventListener('animationcancel', endVisualEffect)
      view?.removeEventListener('resize', startTracking)

      if (
        frameRef.current !== undefined &&
        view !== null &&
        typeof view.cancelAnimationFrame === 'function'
      ) {
        view.cancelAnimationFrame(frameRef.current)
      }
      frameRef.current = undefined
    }
  }, [children, wrapperRef])
}
