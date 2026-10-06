export const visualAnchorInteractionEvents = [
  'pointerenter',
  'pointerleave',
  'pointerdown',
  'pointerup',
  'pointercancel',
  'focusin',
  'focusout',
] as const

interface VisualAnchorTrackerOptions {
  additionalTargets?: readonly HTMLElement[]
  trackScroll?: boolean
  trackMutations?: boolean
  interactionEvents?: readonly string[]
  continuousAnimations?: boolean
}

function animationRunning(animation: Animation): boolean {
  return animation.playState === 'running' || animation.pending
}

export function trackVisualAnchor(
  target: HTMLElement,
  onUpdate: () => void,
  options: VisualAnchorTrackerOptions = {},
): () => void {
  const view = target.ownerDocument.defaultView
  const additionalTargets = [...new Set(options.additionalTargets ?? [])].filter(
    (element) => element !== target,
  )
  const resizeTargets = [target, ...additionalTargets]
  let frame: number | undefined
  let settleFrames = 0
  let visualEffects = 0

  const hasRunningAnimation = () => {
    if (options.continuousAnimations !== true) return false

    if (
      typeof target.getAnimations === 'function' &&
      target.getAnimations({ subtree: true }).some(animationRunning)
    ) {
      return true
    }

    return additionalTargets.some(
      (element) =>
        typeof element.getAnimations === 'function' &&
        element.getAnimations().some(animationRunning),
    )
  }

  const queueFrame = () => {
    if (frame !== undefined || view === null || typeof view.requestAnimationFrame !== 'function') {
      return
    }

    frame = view.requestAnimationFrame(() => {
      frame = undefined
      onUpdate()

      if (settleFrames > 0) {
        settleFrames -= 1
      }

      if (settleFrames > 0 || visualEffects > 0 || hasRunningAnimation()) {
        queueFrame()
      }
    })
  }

  const schedule = () => {
    settleFrames = 2
    onUpdate()
    queueFrame()
  }

  const scheduleFromScroll = () => {
    settleFrames = 2
    queueFrame()
  }

  const beginVisualEffect = () => {
    visualEffects += 1
    schedule()
  }

  const endVisualEffect = () => {
    visualEffects = Math.max(0, visualEffects - 1)
    schedule()
  }

  const beginAdditionalVisualEffect = (event: Event) => {
    if (event.target === event.currentTarget) {
      beginVisualEffect()
    }
  }

  const endAdditionalVisualEffect = (event: Event) => {
    if (event.target === event.currentTarget) {
      endVisualEffect()
    }
  }

  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)

  for (const element of resizeTargets) {
    resizeObserver?.observe(element)
  }

  const mutationObserver =
    options.trackMutations !== true || typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(schedule)

  mutationObserver?.observe(target, {
    attributes: true,
    childList: true,
    subtree: true,
  })

  for (const element of additionalTargets) {
    mutationObserver?.observe(element, {
      attributes: true,
    })
  }

  for (const eventName of options.interactionEvents ?? []) {
    target.addEventListener(eventName, schedule)
  }

  if (options.continuousAnimations === true) {
    target.addEventListener('transitionrun', beginVisualEffect)
    target.addEventListener('transitionend', endVisualEffect)
    target.addEventListener('transitioncancel', endVisualEffect)
    target.addEventListener('animationstart', beginVisualEffect)
    target.addEventListener('animationend', endVisualEffect)
    target.addEventListener('animationcancel', endVisualEffect)

    for (const element of additionalTargets) {
      element.addEventListener('transitionrun', beginAdditionalVisualEffect)
      element.addEventListener('transitionend', endAdditionalVisualEffect)
      element.addEventListener('transitioncancel', endAdditionalVisualEffect)
      element.addEventListener('animationstart', beginAdditionalVisualEffect)
      element.addEventListener('animationend', endAdditionalVisualEffect)
      element.addEventListener('animationcancel', endAdditionalVisualEffect)
    }
  }

  view?.addEventListener('resize', schedule)

  if (options.trackScroll === true) {
    view?.addEventListener('scroll', scheduleFromScroll, true)
  }

  schedule()

  return () => {
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()

    for (const eventName of options.interactionEvents ?? []) {
      target.removeEventListener(eventName, schedule)
    }

    if (options.continuousAnimations === true) {
      target.removeEventListener('transitionrun', beginVisualEffect)
      target.removeEventListener('transitionend', endVisualEffect)
      target.removeEventListener('transitioncancel', endVisualEffect)
      target.removeEventListener('animationstart', beginVisualEffect)
      target.removeEventListener('animationend', endVisualEffect)
      target.removeEventListener('animationcancel', endVisualEffect)

      for (const element of additionalTargets) {
        element.removeEventListener('transitionrun', beginAdditionalVisualEffect)
        element.removeEventListener('transitionend', endAdditionalVisualEffect)
        element.removeEventListener('transitioncancel', endAdditionalVisualEffect)
        element.removeEventListener('animationstart', beginAdditionalVisualEffect)
        element.removeEventListener('animationend', endAdditionalVisualEffect)
        element.removeEventListener('animationcancel', endAdditionalVisualEffect)
      }
    }

    view?.removeEventListener('resize', schedule)

    if (options.trackScroll === true) {
      view?.removeEventListener('scroll', scheduleFromScroll, true)
    }

    if (frame !== undefined && view !== null && typeof view.cancelAnimationFrame === 'function') {
      view.cancelAnimationFrame(frame)
    }
  }
}
