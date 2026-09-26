import type {
  BackgroundValue,
  Dimension,
  Length,
  RadiusValue,
  TransformOperation,
} from '../../core/view-types'
import type {
  ResolvedView,
  ResolvedViewBreakpoint,
  ResolvedViewStyle,
} from '../../core/resolved-view'

export interface DiCViewPaint {
  width?: Dimension
  height?: Dimension
  paddingTop?: Length
  paddingRight?: Length
  paddingBottom?: Length
  paddingLeft?: Length
  background?: BackgroundValue
  radiusTopLeft?: RadiusValue
  radiusTopRight?: RadiusValue
  radiusBottomRight?: RadiusValue
  radiusBottomLeft?: RadiusValue
  opacity?: number
  transform?: readonly TransformOperation[]
}

export interface DiCViewBreakpoint {
  name: string
  minWidth: number
  scope: 'viewport' | 'container'
  paint: DiCViewPaint
}

export interface DiCViewNode {
  kind: 'view'
  paint: DiCViewPaint
  states: {
    hover?: DiCViewPaint
    active?: DiCViewPaint
    focus?: DiCViewPaint
    focusVisible?: DiCViewPaint
    disabled?: DiCViewPaint
  }
  responsive: readonly DiCViewBreakpoint[]
}

function paint(style: ResolvedViewStyle): DiCViewPaint {
  return {
    width: style.width,
    height: style.height,
    paddingTop: style.paddingTop,
    paddingRight: style.paddingRight,
    paddingBottom: style.paddingBottom,
    paddingLeft: style.paddingLeft,
    background: style.background,
    radiusTopLeft: style.radiusTopLeft,
    radiusTopRight: style.radiusTopRight,
    radiusBottomRight: style.radiusBottomRight,
    radiusBottomLeft: style.radiusBottomLeft,
    opacity: style.opacity,
    transform: style.transform,
  }
}

function breakpoint(
  value: ResolvedViewBreakpoint,
): DiCViewBreakpoint {
  return {
    name: value.name,
    minWidth: value.minWidth,
    scope: value.scope,
    paint: paint(value.style),
  }
}

export function compileDiCView(
  view: ResolvedView,
): DiCViewNode {
  return {
    kind: 'view',
    paint: paint(view.style),
    states: {
      hover:
        view.states.hover === undefined
          ? undefined
          : paint(view.states.hover),
      active:
        view.states.active === undefined
          ? undefined
          : paint(view.states.active),
      focus:
        view.states.focus === undefined
          ? undefined
          : paint(view.states.focus),
      focusVisible:
        view.states.focusVisible === undefined
          ? undefined
          : paint(view.states.focusVisible),
      disabled:
        view.states.disabled === undefined
          ? undefined
          : paint(view.states.disabled),
    },
    responsive: view.responsive.map(breakpoint),
  }
}
