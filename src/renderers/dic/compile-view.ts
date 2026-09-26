import type {
  BackgroundValue,
  Dimension,
  Length,
  ViewSemanticProps,
  RadiusValue,
  TransformOperation,
  ViewAlign,
  ViewDirection,
  ViewJustify,
  ViewLayout,
  ViewWrap,
} from '../../core/view-types'
import type {
  ResolvedView,
  ResolvedViewBreakpoint,
  ResolvedViewStyle,
} from '../../core/resolved-view'
import type { ResolvedText } from '../../core/resolved-text'
import type { ResolvedImage } from '../../core/resolved-image'
import type { ResolvedTheme } from '../../theme/theme-types'
import type { DiCImageResourceManager } from './image-resource'

export interface DiCIntrinsicConstraints {
  maxWidth: number
  maxHeight: number
  rem: number
  resolvedWidth?: number
  resolvedHeight?: number
  widthMode?: Dimension
  heightMode?: Dimension
}

export interface DiCIntrinsicSize {
  width: number
  height: number
}

export interface DiCTypographyContext {
  fontFamily: string
  fontSize: number
  fontWeight: number | string
  lineHeight: number
  lineHeightRatio?: number
  letterSpacing: number
  color: string
}

export interface DiCIntrinsicEnvironment {
  context?: CanvasRenderingContext2D
  theme?: ResolvedTheme
  typography?: DiCTypographyContext
  viewportWidth: number
  containerWidth: number
  rem: number
  imageResources?: DiCImageResourceManager
}

export type DiCIntrinsicMeasure = (
  constraints: DiCIntrinsicConstraints,
  environment: DiCIntrinsicEnvironment,
) => DiCIntrinsicSize

export interface DiCTextContent {
  kind: 'text'
  text: string
  style: ResolvedText
}

export interface DiCImageContent {
  kind: 'image'
  image: ResolvedImage
}

export type DiCViewContent =
  | DiCTextContent
  | DiCImageContent

export interface DiCViewPaint {
  layout?: ViewLayout
  direction?: ViewDirection
  wrap?: ViewWrap
  gap?: Length
  align?: ViewAlign
  justify?: ViewJustify
  width?: Dimension
  height?: Dimension
  paddingTop?: Length
  paddingRight?: Length
  paddingBottom?: Length
  paddingLeft?: Length
  background?: BackgroundValue
  color?: string
  radiusTopLeft?: RadiusValue
  radiusTopRight?: RadiusValue
  radiusBottomRight?: RadiusValue
  radiusBottomLeft?: RadiusValue
  opacity?: number
  transform?: readonly TransformOperation[]
  pointerEvents?: string
  cursor?: string
}

export interface DiCViewBreakpoint {
  name: string
  minWidth: number
  scope: 'viewport' | 'container'
  paint: DiCViewPaint
}

export interface DiCEventControl {
  readonly defaultPrevented: boolean
  readonly propagationStopped: boolean
  preventDefault(): void
  stopPropagation(): void
}

export interface DiCPointerEvent extends DiCEventControl {
  readonly type:
    | 'pointerenter'
    | 'pointerleave'
    | 'pointermove'
    | 'pointerdown'
    | 'pointerup'
    | 'pointercancel'
    | 'click'
  readonly pointerId: number
  readonly button: number
  readonly buttons: number
  readonly x: number
  readonly y: number
  readonly target: DiCViewNode
  readonly currentTarget: DiCViewNode
  capturePointer(): void
  releasePointer(): void
}

export interface DiCKeyboardEvent extends DiCEventControl {
  readonly type: 'keydown' | 'keyup'
  readonly key: string
  readonly code: string
  readonly repeat: boolean
  readonly altKey: boolean
  readonly ctrlKey: boolean
  readonly metaKey: boolean
  readonly shiftKey: boolean
  readonly target: DiCViewNode
  readonly currentTarget: DiCViewNode
}

export interface DiCFocusEvent {
  readonly type: 'focus' | 'blur'
  readonly target: DiCViewNode
  readonly currentTarget: DiCViewNode
}

export interface DiCViewInteraction {
  focusable?: boolean
  tabIndex?: number
  onPointerEnter?: (event: DiCPointerEvent) => void
  onPointerLeave?: (event: DiCPointerEvent) => void
  onPointerMove?: (event: DiCPointerEvent) => void
  onPointerDown?: (event: DiCPointerEvent) => void
  onPointerUp?: (event: DiCPointerEvent) => void
  onPointerCancel?: (event: DiCPointerEvent) => void
  onClick?: (event: DiCPointerEvent) => void
  onKeyDown?: (event: DiCKeyboardEvent) => void
  onKeyUp?: (event: DiCKeyboardEvent) => void
  onFocus?: (event: DiCFocusEvent) => void
  onBlur?: (event: DiCFocusEvent) => void
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
  semantics: Readonly<ViewSemanticProps>
  container?: string
  children: readonly DiCViewNode[]
  content?: DiCViewContent
  typography?: {
    typo?: string
  }
  interaction?: DiCViewInteraction
  measure?: DiCIntrinsicMeasure
}

function paint(style: ResolvedViewStyle): DiCViewPaint {
  return Object.fromEntries(
    Object.entries({
      layout: style.layout,
      direction: style.direction,
      wrap: style.wrap,
      gap: style.gap,
      align: style.align,
      justify: style.justify,
      width: style.width,
      height: style.height,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      background: style.background,
      color: style.color,
      radiusTopLeft: style.radiusTopLeft,
      radiusTopRight: style.radiusTopRight,
      radiusBottomRight: style.radiusBottomRight,
      radiusBottomLeft: style.radiusBottomLeft,
      opacity: style.opacity,
      transform: style.transform,
      pointerEvents:
        typeof style.pointerEvents === 'string'
          ? style.pointerEvents
          : undefined,
      cursor:
        typeof style.cursor === 'string'
          ? style.cursor
          : undefined,
    }).filter(([, value]) => value !== undefined),
  ) as DiCViewPaint
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

export interface CompileDiCViewOptions {
  children?: readonly DiCViewNode[]
  content?: DiCViewContent
  typography?: {
    typo?: string
  }
  interaction?: DiCViewInteraction
  measure?: DiCIntrinsicMeasure
}

export function compileDiCView(
  view: ResolvedView,
  options: CompileDiCViewOptions = {},
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
    semantics: view.semantics,
    container: view.container,
    children: options.children ?? [],
    content: options.content,
    typography: options.typography,
    interaction: options.interaction,
    measure: options.measure,
  }
}
