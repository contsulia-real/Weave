export interface VisualAnchorTrackerOptions {
  additionalTargets?: readonly HTMLElement[]
  trackScroll?: boolean
  trackMutations?: boolean
  interactionEvents?: readonly string[]
  continuousAnimations?: boolean
}

export function trackVisualAnchor(
  target: HTMLElement,
  onUpdate: () => void,
  options: VisualAnchorTrackerOptions = {},
): () => void {
  const view =
    target.ownerDocument.defaultView
  let frame:
    | number
    | undefined
  let settleFrames = 0
  let visualEffects = 0

  const hasRunningAnimation = () =>
    options.continuousAnimations === true &&
    typeof target.getAnimations === 'function' &&
    target
      .getAnimations({ subtree: true })
      .some((animation) =>
        animation.playState === 'running' ||
        animation.pending,
      )

  const queueFrame = () => {
    if (
      frame !== undefined ||
      view === null ||
      typeof view.requestAnimationFrame !==
        'function'
    ) {
      return
    }

    frame = view.requestAnimationFrame(() => {
      frame = undefined
      onUpdate()

      if (settleFrames > 0) {
        settleFrames -= 1
      }

      if (
        settleFrames > 0 ||
        visualEffects > 0 ||
        hasRunningAnimation()
      ) {
        queueFrame()
      }
    })
  }

  const schedule = () => {
    settleFrames = 2
    onUpdate()
    queueFrame()
  }

  const beginVisualEffect = () => {
    visualEffects += 1
    schedule()
  }

  const endVisualEffect = () => {
    visualEffects =
      Math.max(0, visualEffects - 1)
    schedule()
  }

  const resizeObserver =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(schedule)

  resizeObserver?.observe(target)
  for (
    const element of
    options.additionalTargets ?? []
  ) {
    resizeObserver?.observe(element)
  }

  const mutationObserver =
    options.trackMutations !== true ||
    typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(schedule)

  mutationObserver?.observe(target, {
    attributes: true,
    childList: true,
    subtree: true,
  })

  for (
    const eventName of
    options.interactionEvents ?? []
  ) {
    target.addEventListener(
      eventName,
      schedule,
    )
  }

  if (
    options.continuousAnimations === true
  ) {
    target.addEventListener(
      'transitionrun',
      beginVisualEffect,
    )
    target.addEventListener(
      'transitionend',
      endVisualEffect,
    )
    target.addEventListener(
      'transitioncancel',
      endVisualEffect,
    )
    target.addEventListener(
      'animationstart',
      beginVisualEffect,
    )
    target.addEventListener(
      'animationend',
      endVisualEffect,
    )
    target.addEventListener(
      'animationcancel',
      endVisualEffect,
    )
  }

  view?.addEventListener(
    'resize',
    schedule,
  )

  if (options.trackScroll === true) {
    view?.addEventListener(
      'scroll',
      schedule,
      true,
    )
  }

  schedule()

  return () => {
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()

    for (
      const eventName of
      options.interactionEvents ?? []
    ) {
      target.removeEventListener(
        eventName,
        schedule,
      )
    }

    if (
      options.continuousAnimations === true
    ) {
      target.removeEventListener(
        'transitionrun',
        beginVisualEffect,
      )
      target.removeEventListener(
        'transitionend',
        endVisualEffect,
      )
      target.removeEventListener(
        'transitioncancel',
        endVisualEffect,
      )
      target.removeEventListener(
        'animationstart',
        beginVisualEffect,
      )
      target.removeEventListener(
        'animationend',
        endVisualEffect,
      )
      target.removeEventListener(
        'animationcancel',
        endVisualEffect,
      )
    }

    view?.removeEventListener(
      'resize',
      schedule,
    )

    if (options.trackScroll === true) {
      view?.removeEventListener(
        'scroll',
        schedule,
        true,
      )
    }

    if (
      frame !== undefined &&
      view !== null &&
      typeof view.cancelAnimationFrame ===
        'function'
    ) {
      view.cancelAnimationFrame(frame)
    }
  }
}
