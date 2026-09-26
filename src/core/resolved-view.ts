import type {
  TransformOperation,
  ViewEventProps,
  ViewEventTarget,
  ViewProps,
  ViewSemanticProps,
  ViewStateStyle,
  ViewStyleProps,
} from './view-types'
import {
  breakpointEntries,
  containerBreakpointProp,
} from './breakpoints'
import { VIEW_STYLE_PROP_KEYS } from './view-prop-keys'

type ViewStyleAlias =
  | 'margin'
  | 'marginX'
  | 'marginY'
  | 'padding'
  | 'paddingX'
  | 'paddingY'
  | 'inset'
  | 'insetX'
  | 'insetY'
  | 'border'
  | 'borderColor'
  | 'radius'
  | 'translateX'
  | 'translateY'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'rotate'
  | 'skewX'
  | 'skewY'

export type ResolvedViewStyle = Readonly<
  Omit<ViewStyleProps, ViewStyleAlias>
>

export interface ResolvedViewBreakpoint {
  name: string
  minWidth: number
  scope: 'viewport' | 'container'
  style: ResolvedViewStyle
}

export interface ResolvedViewStates {
  hover?: ResolvedViewStyle
  active?: ResolvedViewStyle
  focus?: ResolvedViewStyle
  focusVisible?: ResolvedViewStyle
  disabled?: ResolvedViewStyle
}

export interface ResolvedViewInteraction {
  focusable?: boolean
  autoFocus?: boolean
  tabIndex?: number
}

export interface ResolvedView {
  style: ResolvedViewStyle
  states: ResolvedViewStates
  responsive: readonly ResolvedViewBreakpoint[]
  semantics: Readonly<ViewSemanticProps>
  events: Readonly<ViewEventProps>
  eventTarget: Readonly<ViewEventTarget>
  interaction: Readonly<ResolvedViewInteraction>
  container?: string
  layout: ViewStyleProps['layout']
}

function pickStyleProps(
  input: Partial<ViewStyleProps>,
): ViewStyleProps {
  const output: Partial<ViewStyleProps> = {}
  const writable = output as Record<string, unknown>
  const record = input as Record<string, unknown>

  for (const key of VIEW_STYLE_PROP_KEYS) {
    const value = record[key]
    if (value !== undefined) writable[key] = value
  }

  return output as ViewStyleProps
}

function canonicalSides<T>(
  all: T | undefined,
  x: T | undefined,
  y: T | undefined,
  top: T | undefined,
  right: T | undefined,
  bottom: T | undefined,
  left: T | undefined,
): readonly [
  T | undefined,
  T | undefined,
  T | undefined,
  T | undefined,
] {
  return [
    top ?? y ?? all,
    right ?? x ?? all,
    bottom ?? y ?? all,
    left ?? x ?? all,
  ]
}

function canonicalTransform(
  props: ViewStyleProps,
): readonly TransformOperation[] | undefined {
  if (props.transform !== undefined) return props.transform

  const output: TransformOperation[] = []

  if (props.translateX !== undefined || props.translateY !== undefined) {
    output.push({
      translate: [
        props.translateX ?? 0,
        props.translateY ?? 0,
      ],
    })
  }
  if (props.rotate !== undefined) output.push({ rotate: props.rotate })
  if (props.skewX !== undefined) output.push({ skewX: props.skewX })
  if (props.skewY !== undefined) output.push({ skewY: props.skewY })

  if (props.scale !== undefined) {
    output.push({ scale: props.scale })
  } else {
    if (props.scaleX !== undefined) output.push({ scaleX: props.scaleX })
    if (props.scaleY !== undefined) output.push({ scaleY: props.scaleY })
  }

  return output.length === 0 ? undefined : output
}

export function resolveViewStyle(
  input: Partial<ViewStyleProps> | undefined,
): ResolvedViewStyle {
  const props = pickStyleProps(input ?? {})
  const {
    margin,
    marginX,
    marginY,
    padding,
    paddingX,
    paddingY,
    inset,
    insetX,
    insetY,
    border,
    borderColor,
    radius,
    translateX: _translateX,
    translateY: _translateY,
    scale: _scale,
    scaleX: _scaleX,
    scaleY: _scaleY,
    rotate: _rotate,
    skewX: _skewX,
    skewY: _skewY,
    ...rest
  } = props

  const [marginTop, marginRight, marginBottom, marginLeft] =
    canonicalSides(
      margin,
      marginX,
      marginY,
      props.marginTop,
      props.marginRight,
      props.marginBottom,
      props.marginLeft,
    )

  const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
    canonicalSides(
      padding,
      paddingX,
      paddingY,
      props.paddingTop,
      props.paddingRight,
      props.paddingBottom,
      props.paddingLeft,
    )

  const [top, right, bottom, left] = canonicalSides(
    inset,
    insetX,
    insetY,
    props.top,
    props.right,
    props.bottom,
    props.left,
  )

  return {
    ...rest,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    top,
    right,
    bottom,
    left,
    borderTop: props.borderTop ?? border,
    borderRight: props.borderRight ?? border,
    borderBottom: props.borderBottom ?? border,
    borderLeft: props.borderLeft ?? border,
    borderTopColor: props.borderTopColor ?? borderColor,
    borderRightColor: props.borderRightColor ?? borderColor,
    borderBottomColor: props.borderBottomColor ?? borderColor,
    borderLeftColor: props.borderLeftColor ?? borderColor,
    radiusTopLeft: props.radiusTopLeft ?? radius,
    radiusTopRight: props.radiusTopRight ?? radius,
    radiusBottomRight: props.radiusBottomRight ?? radius,
    radiusBottomLeft: props.radiusBottomLeft ?? radius,
    transform: canonicalTransform(props),
  }
}

function resolvedState(
  value: ViewStateStyle | undefined,
): ResolvedViewStyle | undefined {
  return value === undefined ? undefined : resolveViewStyle(value)
}

function semantics<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
): Readonly<ViewSemanticProps> {
  return {
    role: props.role,
    label: props.label,
    description: props.description,
    level: props.level,
    disabled: props.disabled,
    required: props.required,
    invalid: props.invalid,
    busy: props.busy,
    expanded: props.expanded,
    selected: props.selected,
    checked: props.checked,
    pressed: props.pressed,
    readOnly: props.readOnly,
    valueMin: props.valueMin,
    valueMax: props.valueMax,
    valueNow: props.valueNow,
    valueText: props.valueText,
    labelledBy: props.labelledBy,
    describedBy: props.describedBy,
    controls: props.controls,
    owns: props.owns,
  }
}

function events<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
): Readonly<ViewEventProps> {
  return {
    onClick: props.onClick,
    onPointerEnter: props.onPointerEnter,
    onPointerLeave: props.onPointerLeave,
    onPointerMove: props.onPointerMove,
    onPointerDown: props.onPointerDown,
    onPointerUp: props.onPointerUp,
    onPointerCancel: props.onPointerCancel,
    onKeyDown: props.onKeyDown,
    onKeyUp: props.onKeyUp,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
  }
}

export function resolveView<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  breakpoints: Readonly<Record<string, number>>,
): ResolvedView {
  const record = props as Record<string, unknown>
  const responsive: ResolvedViewBreakpoint[] = []

  for (const breakpoint of breakpointEntries(breakpoints)) {
    const viewportValue = record[breakpoint.name]
    if (
      typeof viewportValue === 'object' &&
      viewportValue !== null &&
      !Array.isArray(viewportValue)
    ) {
      responsive.push({
        ...breakpoint,
        scope: 'viewport',
        style: resolveViewStyle(
          viewportValue as ViewStyleProps,
        ),
      })
    }

    const containerValue = record[
      containerBreakpointProp(breakpoint.name)
    ]
    if (
      typeof containerValue === 'object' &&
      containerValue !== null &&
      !Array.isArray(containerValue)
    ) {
      responsive.push({
        ...breakpoint,
        scope: 'container',
        style: resolveViewStyle(
          containerValue as ViewStyleProps,
        ),
      })
    }
  }

  return {
    style: resolveViewStyle(props),
    states: {
      hover: resolvedState(props.hover),
      active: resolvedState(props.active),
      focus: resolvedState(props.focus),
      focusVisible: resolvedState(props.focusVisible),
      disabled: resolvedState(props.disabledStyle),
    },
    responsive,
    semantics: semantics(props),
    events: events(props),
    eventTarget: {
      id: props.id,
    },
    interaction: {
      focusable: props.focusable,
      autoFocus: props.autoFocus,
      tabIndex: props.tabIndex,
    },
    container: props.container,
    layout: props.layout,
  }
}
