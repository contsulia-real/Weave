import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  Ref,
} from 'react'

export type Length = number | string
export type Dimension = Length | 'fill' | 'fit' | 'content'
export type ColorValue = string
export type RadiusValue =
  | Length
  | 'none'
  | 'small'
  | 'medium'
  | 'large'
  | 'full'

export type ScrollbarSize = 'small' | 'medium' | 'large'

export interface ScrollbarConfig {
  size?: ScrollbarSize
  tracked?: boolean
  color?: ColorValue
  trackColor?: ColorValue
  radius?: RadiusValue
  opacity?: number
}

export type ViewLayout = 'flex' | 'grid' | 'stack' | 'absolute'
export type ViewDirection =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse'
export type ViewWrap = boolean | 'reverse'
export type ViewAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type ViewJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

export type GradientStop = readonly [ColorValue, number]

export interface LinearGradient {
  type: 'linear'
  angle?: number
  stops: readonly GradientStop[]
}

export interface RadialGradient {
  type: 'radial'
  stops: readonly GradientStop[]
}

export type Gradient = LinearGradient | RadialGradient
export type BackgroundValue = ColorValue | Gradient

export interface ShadowDefinition {
  x?: Length
  y?: Length
  blur?: Length
  spread?: Length
  color?: ColorValue
  opacity?: number
}

export type ShadowValue =
  | 'none'
  | 'small'
  | 'medium'
  | 'large'
  | ShadowDefinition
  | readonly ShadowDefinition[]

export type TransformOperation =
  | { translateX: Length }
  | { translateY: Length }
  | { translate: readonly [Length, Length] }
  | { rotate: number | string }
  | { scale: number }
  | { scaleX: number }
  | { scaleY: number }
  | { skewX: number | string }
  | { skewY: number | string }

export type TransformOriginValue =
  | string
  | {
      x: Length
      y: Length
    }

export type ClipValue =
  | string
  | {
      type: 'circle'
      radius: Length
    }
  | {
      type: 'polygon'
      points: readonly (readonly [Length, Length])[]
    }
  | {
      type: 'path'
      path: string
    }

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

export interface ViewStyleProps {
  layout?: ViewLayout
  direction?: ViewDirection
  wrap?: ViewWrap
  gap?: Length
  align?: ViewAlign
  justify?: ViewJustify

  grow?: number
  shrink?: number
  basis?: Length
  alignSelf?: ViewAlign | 'auto'
  justifySelf?: ViewAlign | 'auto'
  order?: number

  columns?: number | string
  rows?: number | string
  column?: number
  columnSpan?: number
  row?: number
  rowSpan?: number

  width?: Dimension
  height?: Dimension
  minWidth?: Dimension
  maxWidth?: Dimension
  minHeight?: Dimension
  maxHeight?: Dimension
  aspectRatio?: number | string

  margin?: Length
  marginX?: Length
  marginY?: Length
  marginTop?: Length
  marginRight?: Length
  marginBottom?: Length
  marginLeft?: Length

  padding?: Length
  paddingX?: Length
  paddingY?: Length
  paddingTop?: Length
  paddingRight?: Length
  paddingBottom?: Length
  paddingLeft?: Length

  position?: CSSProperties['position']
  inset?: Length
  insetX?: Length
  insetY?: Length
  top?: Length
  right?: Length
  bottom?: Length
  left?: Length

  overflow?: CSSProperties['overflow']
  overflowX?: CSSProperties['overflowX']
  overflowY?: CSSProperties['overflowY']

  background?: BackgroundValue
  color?: ColorValue

  border?: Length
  borderTop?: Length
  borderRight?: Length
  borderBottom?: Length
  borderLeft?: Length
  borderColor?: ColorValue
  borderTopColor?: ColorValue
  borderRightColor?: ColorValue
  borderBottomColor?: ColorValue
  borderLeftColor?: ColorValue
  borderStyle?: CSSProperties['borderStyle']

  radius?: RadiusValue
  radiusTopLeft?: RadiusValue
  radiusTopRight?: RadiusValue
  radiusBottomRight?: RadiusValue
  radiusBottomLeft?: RadiusValue

  shadow?: ShadowValue
  opacity?: number

  blur?: Length
  brightness?: number
  contrast?: number
  saturate?: number
  grayscale?: number
  sepia?: number
  hueRotate?: number | string

  backdropBlur?: Length
  backdropSaturate?: number

  translateX?: Length
  translateY?: Length
  scale?: number
  scaleX?: number
  scaleY?: number
  rotate?: number | string
  skewX?: number | string
  skewY?: number | string
  transform?: readonly TransformOperation[]
  transformOrigin?: TransformOriginValue

  clip?: ClipValue
  blend?: BlendMode

  outlineWidth?: Length
  outlineColor?: ColorValue
  outlineStyle?: CSSProperties['outlineStyle']
  outlineOffset?: Length

  zIndex?: number
  pointerEvents?: CSSProperties['pointerEvents']
  cursor?: CSSProperties['cursor']
  selectable?: boolean
}

export type ViewStateStyle = Partial<ViewStyleProps>
export type ViewResponsiveStyle = Partial<ViewStyleProps>

export type DefaultBreakpointName = 'sm' | 'md' | 'lg' | 'xl'

export type ViewBreakpointProps =
  Partial<Record<DefaultBreakpointName, ViewResponsiveStyle>> &
  Partial<
    Record<
      `container${Capitalize<DefaultBreakpointName>}`,
      ViewResponsiveStyle
    >
  >

export type ViewDynamicBreakpointProps =
  Readonly<Record<string, unknown>>

export interface ViewSemanticProps {
  role?: HTMLAttributes<HTMLDivElement>['role']
  label?: string
  description?: string

  disabled?: boolean
  required?: boolean
  invalid?: boolean
  busy?: boolean
  expanded?: boolean
  selected?: boolean
  checked?: boolean | 'mixed'
  pressed?: boolean | 'mixed'
  readOnly?: boolean

  valueMin?: number
  valueMax?: number
  valueNow?: number
  valueText?: string

  labelledBy?: string
  describedBy?: string
  controls?: string
  owns?: string
}

export type ViewDataValue = string | number | boolean | null | undefined
export type ViewData = Readonly<Record<string, ViewDataValue>>

type NativeElementProps<TElement extends HTMLElement> = Omit<
  HTMLAttributes<TElement>,
  | 'children'
  | 'className'
  | 'style'
  | 'color'
  | 'role'
  | 'hidden'
  | 'draggable'
  | 'tabIndex'
>

export type ViewCoreProps<
  TElement extends HTMLElement = HTMLDivElement,
> =
  NativeElementProps<TElement> &
  ViewStyleProps &
  ViewSemanticProps &
  ViewBreakpointProps & {
  children?: ReactNode
  ref?: Ref<TElement>
  className?: string
  style?: CSSProperties

  id?: string
  data?: ViewData

  focusable?: boolean
  hidden?: boolean
  draggable?: boolean
  tabIndex?: number
  autoFocus?: boolean

  container?: string
  scrollbar?: ScrollbarConfig

  hover?: ViewStateStyle
  active?: ViewStateStyle
  focus?: ViewStateStyle
  focusVisible?: ViewStateStyle
  disabledStyle?: ViewStateStyle
}

export type ViewProps<
  TElement extends HTMLElement = HTMLDivElement,
> =
  ViewCoreProps<TElement> &
  ViewDynamicBreakpointProps
