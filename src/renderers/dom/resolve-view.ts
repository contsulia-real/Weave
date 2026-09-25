import type { CSSProperties, HTMLAttributes } from 'react'
import type {
  ViewData,
  ViewProps,
  ViewStateStyle,
  ViewStyleProps,
} from '../../core/view-types'
import {
  background,
  backdropFilterValue,
  clipPath,
  color,
  dimension,
  filterValue,
  length,
  radius,
  shadow,
  transformOrigin,
  transformValue,
} from '../../core/values'
import { variableName } from './view-stylesheet'

type CSSVariableStyle = CSSProperties &
  Record<`--weave-${string}`, string | number | undefined>

const CUSTOM_PROP_KEYS = new Set<string>([
  'children',
  'ref',
  'className',
  'style',
  'data',
  'focusable',
  'autoFocus',
  'selectable',
  'disabled',
  'required',
  'invalid',
  'busy',
  'expanded',
  'selected',
  'checked',
  'pressed',
  'readOnly',
  'label',
  'description',
  'valueMin',
  'valueMax',
  'valueNow',
  'valueText',
  'labelledBy',
  'describedBy',
  'controls',
  'owns',
  'hover',
  'active',
  'focus',
  'focusVisible',
  'disabledStyle',
  'container',
  'scrollbar',
  'sm',
  'md',
  'lg',
  'xl',
  'containerSm',
  'containerMd',
  'containerLg',
  'containerXl',
  'layout',
  'direction',
  'wrap',
  'gap',
  'align',
  'justify',
  'grow',
  'shrink',
  'basis',
  'alignSelf',
  'justifySelf',
  'order',
  'columns',
  'rows',
  'column',
  'columnSpan',
  'row',
  'rowSpan',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'aspectRatio',
  'margin',
  'marginX',
  'marginY',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingX',
  'paddingY',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'position',
  'inset',
  'insetX',
  'insetY',
  'top',
  'right',
  'bottom',
  'left',
  'overflow',
  'overflowX',
  'overflowY',
  'background',
  'color',
  'border',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderStyle',
  'radius',
  'radiusTopLeft',
  'radiusTopRight',
  'radiusBottomRight',
  'radiusBottomLeft',
  'shadow',
  'opacity',
  'blur',
  'brightness',
  'contrast',
  'saturate',
  'grayscale',
  'sepia',
  'hueRotate',
  'backdropBlur',
  'backdropSaturate',
  'translateX',
  'translateY',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'skewX',
  'skewY',
  'transform',
  'transformOrigin',
  'clip',
  'blend',
  'outlineWidth',
  'outlineColor',
  'outlineStyle',
  'outlineOffset',
  'zIndex',
  'pointerEvents',
  'cursor',
])

function setVariable(
  output: CSSVariableStyle,
  property: Parameters<typeof variableName>[0],
  value: string | number | undefined,
  state?: string,
): void {
  if (value === undefined) return
  output[variableName(property, state)] = value
}

function gridTrack(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number'
    ? `repeat(${value}, minmax(0, 1fr))`
    : value
}

function gridPlacement(
  start: number | undefined,
  span: number | undefined,
): string | undefined {
  if (start !== undefined && span !== undefined) {
    return `${start} / span ${span}`
  }
  if (start !== undefined) return String(start)
  if (span !== undefined) return `span ${span}`
  return undefined
}

function resolveSides(
  all: ViewStyleProps['padding'],
  x: ViewStyleProps['paddingX'],
  y: ViewStyleProps['paddingY'],
  top: ViewStyleProps['paddingTop'],
  right: ViewStyleProps['paddingRight'],
  bottom: ViewStyleProps['paddingBottom'],
  left: ViewStyleProps['paddingLeft'],
): readonly [
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
] {
  return [
    length(top ?? y ?? all),
    length(right ?? x ?? all),
    length(bottom ?? y ?? all),
    length(left ?? x ?? all),
  ]
}

function resolveStyleProps(
  props: ViewStyleProps,
  state?: string,
): CSSVariableStyle {
  const output: CSSVariableStyle = {}

  const display =
    props.layout === 'flex'
      ? 'flex'
      : props.layout === 'grid' || props.layout === 'stack'
        ? 'grid'
        : props.layout === 'absolute'
          ? 'block'
          : undefined

  setVariable(output, 'display', display, state)
  setVariable(output, 'flexDirection', props.direction, state)
  setVariable(
    output,
    'flexWrap',
    props.wrap === true
      ? 'wrap'
      : props.wrap === 'reverse'
        ? 'wrap-reverse'
        : props.wrap === false
          ? 'nowrap'
          : undefined,
    state,
  )
  setVariable(output, 'gap', length(props.gap), state)
  setVariable(output, 'alignItems', props.align, state)
  setVariable(output, 'justifyContent', props.justify, state)

  setVariable(output, 'flexGrow', props.grow, state)
  setVariable(output, 'flexShrink', props.shrink, state)
  setVariable(output, 'flexBasis', length(props.basis), state)
  setVariable(output, 'alignSelf', props.alignSelf, state)
  setVariable(output, 'justifySelf', props.justifySelf, state)
  setVariable(output, 'order', props.order, state)

  setVariable(output, 'gridTemplateColumns', gridTrack(props.columns), state)
  setVariable(output, 'gridTemplateRows', gridTrack(props.rows), state)
  setVariable(
    output,
    'gridColumn',
    gridPlacement(props.column, props.columnSpan),
    state,
  )
  setVariable(output, 'gridRow', gridPlacement(props.row, props.rowSpan), state)

  setVariable(output, 'width', dimension(props.width), state)
  setVariable(output, 'height', dimension(props.height), state)
  setVariable(output, 'minWidth', dimension(props.minWidth), state)
  setVariable(output, 'maxWidth', dimension(props.maxWidth), state)
  setVariable(output, 'minHeight', dimension(props.minHeight), state)
  setVariable(output, 'maxHeight', dimension(props.maxHeight), state)
  setVariable(output, 'aspectRatio', props.aspectRatio, state)

  const [marginTop, marginRight, marginBottom, marginLeft] = resolveSides(
    props.margin,
    props.marginX,
    props.marginY,
    props.marginTop,
    props.marginRight,
    props.marginBottom,
    props.marginLeft,
  )
  setVariable(output, 'marginTop', marginTop, state)
  setVariable(output, 'marginRight', marginRight, state)
  setVariable(output, 'marginBottom', marginBottom, state)
  setVariable(output, 'marginLeft', marginLeft, state)

  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = resolveSides(
    props.padding,
    props.paddingX,
    props.paddingY,
    props.paddingTop,
    props.paddingRight,
    props.paddingBottom,
    props.paddingLeft,
  )
  setVariable(output, 'paddingTop', paddingTop, state)
  setVariable(output, 'paddingRight', paddingRight, state)
  setVariable(output, 'paddingBottom', paddingBottom, state)
  setVariable(output, 'paddingLeft', paddingLeft, state)

  const [top, right, bottom, left] = resolveSides(
    props.inset,
    props.insetX,
    props.insetY,
    props.top,
    props.right,
    props.bottom,
    props.left,
  )
  setVariable(
    output,
    'position',
    props.position ?? (props.layout === 'absolute' ? 'relative' : undefined),
    state,
  )
  setVariable(output, 'top', top, state)
  setVariable(output, 'right', right, state)
  setVariable(output, 'bottom', bottom, state)
  setVariable(output, 'left', left, state)

  setVariable(output, 'overflow', props.overflow, state)
  setVariable(
    output,
    'overflowX',
    props.overflowX ?? props.overflow,
    state,
  )
  setVariable(
    output,
    'overflowY',
    props.overflowY ?? props.overflow,
    state,
  )

  setVariable(output, 'background', background(props.background), state)
  setVariable(output, 'color', color(props.color), state)

  const borderTop = length(props.borderTop ?? props.border)
  const borderRight = length(props.borderRight ?? props.border)
  const borderBottom = length(props.borderBottom ?? props.border)
  const borderLeft = length(props.borderLeft ?? props.border)
  setVariable(output, 'borderTopWidth', borderTop, state)
  setVariable(output, 'borderRightWidth', borderRight, state)
  setVariable(output, 'borderBottomWidth', borderBottom, state)
  setVariable(output, 'borderLeftWidth', borderLeft, state)

  setVariable(
    output,
    'borderTopColor',
    color(props.borderTopColor ?? props.borderColor),
    state,
  )
  setVariable(
    output,
    'borderRightColor',
    color(props.borderRightColor ?? props.borderColor),
    state,
  )
  setVariable(
    output,
    'borderBottomColor',
    color(props.borderBottomColor ?? props.borderColor),
    state,
  )
  setVariable(
    output,
    'borderLeftColor',
    color(props.borderLeftColor ?? props.borderColor),
    state,
  )
  setVariable(output, 'borderStyle', props.borderStyle, state)

  setVariable(
    output,
    'borderTopLeftRadius',
    radius(props.radiusTopLeft ?? props.radius),
    state,
  )
  setVariable(
    output,
    'borderTopRightRadius',
    radius(props.radiusTopRight ?? props.radius),
    state,
  )
  setVariable(
    output,
    'borderBottomRightRadius',
    radius(props.radiusBottomRight ?? props.radius),
    state,
  )
  setVariable(
    output,
    'borderBottomLeftRadius',
    radius(props.radiusBottomLeft ?? props.radius),
    state,
  )

  setVariable(output, 'boxShadow', shadow(props.shadow), state)
  setVariable(output, 'opacity', props.opacity, state)
  setVariable(output, 'filter', filterValue(props), state)
  setVariable(output, 'backdropFilter', backdropFilterValue(props), state)
  setVariable(output, 'transform', transformValue(props), state)
  setVariable(
    output,
    'transformOrigin',
    transformOrigin(props.transformOrigin),
    state,
  )
  setVariable(output, 'clipPath', clipPath(props.clip), state)
  setVariable(output, 'mixBlendMode', props.blend, state)

  setVariable(output, 'outlineWidth', length(props.outlineWidth), state)
  setVariable(output, 'outlineColor', color(props.outlineColor), state)
  setVariable(output, 'outlineStyle', props.outlineStyle, state)
  setVariable(output, 'outlineOffset', length(props.outlineOffset), state)

  setVariable(output, 'zIndex', props.zIndex, state)
  setVariable(output, 'pointerEvents', props.pointerEvents, state)
  setVariable(output, 'cursor', props.cursor, state)
  setVariable(
    output,
    'userSelect',
    props.selectable === undefined
      ? undefined
      : props.selectable
        ? 'text'
        : 'none',
    state,
  )

  return output
}

function stateStyles(
  output: CSSVariableStyle,
  state: string,
  value: ViewStateStyle | undefined,
): void {
  if (value === undefined) return
  Object.assign(output, resolveStyleProps(value, state))
}

function responsiveStyles(
  output: CSSVariableStyle,
  prefix: string,
  value: ViewStyleProps | undefined,
): void {
  if (value === undefined) return
  Object.assign(output, resolveStyleProps(value, prefix))
}

function dataAttributes(data: ViewData | undefined): Record<string, string> {
  if (data === undefined) return {}

  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [`data-${key}`, String(value)]),
  )
}

export interface ResolvedDOMView<TElement extends HTMLElement> {
  domProps: HTMLAttributes<TElement>
  attributeStyle: CSSVariableStyle
  layout: ViewProps<TElement>['layout']
}

export function resolveDOMView<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
): ResolvedDOMView<TElement> {
  const domProps: HTMLAttributes<TElement> = {}
  const writableDOMProps = domProps as Record<string, unknown>

  for (const [key, value] of Object.entries(props)) {
    if (!CUSTOM_PROP_KEYS.has(key)) writableDOMProps[key] = value
  }

  Object.assign(writableDOMProps, dataAttributes(props.data))

  if (props.role !== undefined) domProps.role = props.role
  if (props.label !== undefined) domProps['aria-label'] = props.label
  if (props.description !== undefined) {
    domProps['aria-description'] = props.description
  }
  if (props.disabled !== undefined) domProps['aria-disabled'] = props.disabled
  if (props.required !== undefined) domProps['aria-required'] = props.required
  if (props.invalid !== undefined) domProps['aria-invalid'] = props.invalid
  if (props.busy !== undefined) domProps['aria-busy'] = props.busy
  if (props.expanded !== undefined) domProps['aria-expanded'] = props.expanded
  if (props.selected !== undefined) domProps['aria-selected'] = props.selected
  if (props.checked !== undefined) domProps['aria-checked'] = props.checked
  if (props.pressed !== undefined) domProps['aria-pressed'] = props.pressed
  if (props.readOnly !== undefined) domProps['aria-readonly'] = props.readOnly
  if (props.valueMin !== undefined) domProps['aria-valuemin'] = props.valueMin
  if (props.valueMax !== undefined) domProps['aria-valuemax'] = props.valueMax
  if (props.valueNow !== undefined) domProps['aria-valuenow'] = props.valueNow
  if (props.valueText !== undefined) domProps['aria-valuetext'] = props.valueText
  if (props.labelledBy !== undefined) {
    domProps['aria-labelledby'] = props.labelledBy
  }
  if (props.describedBy !== undefined) {
    domProps['aria-describedby'] = props.describedBy
  }
  if (props.controls !== undefined) domProps['aria-controls'] = props.controls
  if (props.owns !== undefined) domProps['aria-owns'] = props.owns

  if ((props.focusable || props.autoFocus) && props.tabIndex === undefined) {
    domProps.tabIndex = 0
  } else if (props.tabIndex !== undefined) {
    domProps.tabIndex = props.tabIndex
  }

  if (props.hidden !== undefined) domProps.hidden = props.hidden
  if (props.draggable !== undefined) domProps.draggable = props.draggable

  const attributeStyle = resolveStyleProps(props)

  if (props.container !== undefined) {
    setVariable(attributeStyle, 'containerType', 'inline-size')
    setVariable(attributeStyle, 'containerName', props.container)
  }

  responsiveStyles(attributeStyle, 'sm', props.sm)
  responsiveStyles(attributeStyle, 'md', props.md)
  responsiveStyles(attributeStyle, 'lg', props.lg)
  responsiveStyles(attributeStyle, 'xl', props.xl)

  responsiveStyles(attributeStyle, 'container-sm', props.containerSm)
  responsiveStyles(attributeStyle, 'container-md', props.containerMd)
  responsiveStyles(attributeStyle, 'container-lg', props.containerLg)
  responsiveStyles(attributeStyle, 'container-xl', props.containerXl)

  stateStyles(attributeStyle, 'hover', props.hover)
  stateStyles(attributeStyle, 'active', props.active)
  stateStyles(attributeStyle, 'focus', props.focus)
  stateStyles(attributeStyle, 'focus-visible', props.focusVisible)
  stateStyles(attributeStyle, 'disabled', props.disabledStyle)

  return {
    domProps,
    attributeStyle,
    layout: props.layout,
  }
}
