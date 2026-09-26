import type {
  DiCViewNode,
  DiCViewPaint,
} from './compile-view'

export interface DiCInteractionState {
  hover?: boolean
  active?: boolean
  focus?: boolean
  focusVisible?: boolean
  disabled?: boolean
}

export interface DiCViewEnvironment {
  viewportWidth: number
  containerWidth?: number
  rem?: number
  state?: DiCInteractionState
}

function mergePaint(
  base: DiCViewPaint,
  override: DiCViewPaint | undefined,
): DiCViewPaint {
  return override === undefined
    ? base
    : {
        ...base,
        ...override,
      }
}

export function resolveDiCViewPaint(
  node: DiCViewNode,
  environment: DiCViewEnvironment,
): DiCViewPaint {
  const rem = environment.rem ?? 16
  let paint: DiCViewPaint = { ...node.paint }

  for (const responsive of node.responsive) {
    const availableWidth =
      responsive.scope === 'viewport'
        ? environment.viewportWidth
        : environment.containerWidth ??
          environment.viewportWidth

    if (availableWidth >= responsive.minWidth * rem) {
      paint = mergePaint(paint, responsive.paint)
    }
  }

  const state = environment.state
  if (state?.hover) {
    paint = mergePaint(paint, node.states.hover)
  }
  if (state?.active) {
    paint = mergePaint(paint, node.states.active)
  }
  if (state?.focus) {
    paint = mergePaint(paint, node.states.focus)
  }
  if (state?.focusVisible) {
    paint = mergePaint(paint, node.states.focusVisible)
  }
  if (state?.disabled) {
    paint = mergePaint(paint, node.states.disabled)
  }

  return paint
}
