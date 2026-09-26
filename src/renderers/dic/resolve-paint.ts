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
  if (override === undefined) return base

  const definedOverride = Object.fromEntries(
    Object.entries(override).filter(
      ([, value]) => value !== undefined,
    ),
  ) as DiCViewPaint

  return {
    ...base,
    ...definedOverride,
  }
}

export function resolveDiCViewPaint(
  node: DiCViewNode,
  environment: DiCViewEnvironment,
): DiCViewPaint {
  const rem = environment.rem ?? 16
  let paint: DiCViewPaint = { ...node.paint }
  const activeResponsive: Array<
    (typeof node.responsive)[number]
  > = []

  for (const responsive of node.responsive) {
    const availableWidth =
      responsive.scope === 'viewport'
        ? environment.viewportWidth
        : environment.containerWidth ??
          environment.viewportWidth

    if (availableWidth >= responsive.minWidth * rem) {
      paint = mergePaint(paint, responsive.paint)
      activeResponsive.push(responsive)
    }
  }

  const mergeState = (
    key:
      | 'hover'
      | 'active'
      | 'focus'
      | 'focusVisible'
      | 'disabled',
  ) => {
    paint = mergePaint(
      paint,
      node.states[key],
    )

    for (const responsive of activeResponsive) {
      paint = mergePaint(
        paint,
        responsive.states?.[key],
      )
    }
  }

  const state = environment.state
  if (state?.hover) {
    mergeState('hover')
  }
  if (state?.active) {
    mergeState('active')
  }
  if (state?.focus) {
    mergeState('focus')
  }
  if (state?.focusVisible) {
    mergeState('focusVisible')
  }
  if (state?.disabled) {
    mergeState('disabled')
  }

  return paint
}
