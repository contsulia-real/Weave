import type { CSSProperties, HTMLAttributes } from 'react'
import {
  backdropFilterValue,
  background,
  clipPath,
  color,
  dimension,
  filterValue,
  length,
  maskImage,
  radius,
  shadow,
  transformOrigin,
  transformValue,
} from '../../core/values'
import { VIEW_INTERNAL_PROP_KEYS } from '../../core/view-prop-keys'
import type { ViewData, ViewProps, ViewStateStyle, ViewStyleProps } from '../../core/view-types'
import { defaultBreakpoints } from '../../theme/default-theme'
import { breakpointEntries, containerBreakpointProp } from './breakpoint-utils'
import { variableName } from './view-stylesheet'

type CSSVariableStyle = CSSProperties & Record<`--weave-${string}`, string | number | undefined>

const NATIVE_OBJECT_PROP_KEYS = new Set<string>(['dangerouslySetInnerHTML'])
const NATIVE_FORWARD_PROP_KEYS = new Set<string>([
  'accessKey',
  'about',
  'autoCapitalize',
  'autoCorrect',
  'autoSave',
  'content',
  'contentEditable',
  'contextMenu',
  'datatype',
  'defaultChecked',
  'defaultValue',
  'dir',
  'enterKeyHint',
  'exportparts',
  'inert',
  'inlist',
  'id',
  'inputMode',
  'is',
  'itemID',
  'itemProp',
  'itemRef',
  'itemScope',
  'itemType',
  'lang',
  'nonce',
  'part',
  'popover',
  'popoverTarget',
  'popoverTargetAction',
  'prefix',
  'property',
  'radioGroup',
  'rel',
  'resource',
  'results',
  'rev',
  'security',
  'slot',
  'spellCheck',
  'suppressContentEditableWarning',
  'suppressHydrationWarning',
  'title',
  'translate',
  'typeof',
  'unselectable',
  'vocab',
])

function isNativePassThroughProp(key: string): boolean {
  return (
    NATIVE_OBJECT_PROP_KEYS.has(key) ||
    NATIVE_FORWARD_PROP_KEYS.has(key) ||
    key.startsWith('aria-') ||
    key.startsWith('data-') ||
    /^on[A-Z]/.test(key)
  )
}

function isBreakpointLikeValue(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

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
  return typeof value === 'number' ? `repeat(${value}, minmax(0, 1fr))` : value
}

function gridPlacement(start: number | undefined, span: number | undefined): string | undefined {
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
): readonly [string | undefined, string | undefined, string | undefined, string | undefined] {
  return [
    length(top ?? y ?? all),
    length(right ?? x ?? all),
    length(bottom ?? y ?? all),
    length(left ?? x ?? all),
  ]
}

function resolveStyleProps(props: ViewStyleProps, state?: string): CSSVariableStyle {
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
  setVariable(output, 'gridColumn', gridPlacement(props.column, props.columnSpan), state)
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
  setVariable(output, 'overflowX', props.overflowX ?? props.overflow, state)
  setVariable(output, 'overflowY', props.overflowY ?? props.overflow, state)

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

  setVariable(output, 'borderTopColor', color(props.borderTopColor ?? props.borderColor), state)
  setVariable(output, 'borderRightColor', color(props.borderRightColor ?? props.borderColor), state)
  setVariable(
    output,
    'borderBottomColor',
    color(props.borderBottomColor ?? props.borderColor),
    state,
  )
  setVariable(output, 'borderLeftColor', color(props.borderLeftColor ?? props.borderColor), state)
  setVariable(output, 'borderStyle', props.borderStyle, state)

  setVariable(output, 'borderTopLeftRadius', radius(props.radiusTopLeft ?? props.radius), state)
  setVariable(output, 'borderTopRightRadius', radius(props.radiusTopRight ?? props.radius), state)
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
  setVariable(output, 'transformOrigin', transformOrigin(props.transformOrigin), state)
  setVariable(output, 'maskImage', maskImage(props.mask), state)
  setVariable(output, 'clipPath', clipPath(props.clip), state)
  setVariable(output, 'mixBlendMode', props.blend, state)

  setVariable(output, 'outlineWidth', length(props.outlineWidth), state)
  setVariable(output, 'outlineColor', color(props.outlineColor), state)
  setVariable(output, 'outlineStyle', props.outlineStyle, state)
  setVariable(output, 'outlineOffset', length(props.outlineOffset), state)

  setVariable(
    output,
    'zIndex',
    props.zIndex ?? (props.layer === undefined ? undefined : `var(--weave-layer-${props.layer})`),
    state,
  )
  setVariable(output, 'pointerEvents', props.pointerEvents, state)
  setVariable(output, 'cursor', props.cursor, state)
  setVariable(
    output,
    'userSelect',
    props.selectable === undefined ? undefined : props.selectable ? 'text' : 'none',
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
  breakpoints: Readonly<Record<string, number>> = defaultBreakpoints,
): ResolvedDOMView<TElement> {
  const domProps: HTMLAttributes<TElement> = {}
  const writableDOMProps = domProps as Record<string, unknown>
  const breakpointList = breakpointEntries(breakpoints)
  const responsivePropKeys = new Set(
    breakpointList.flatMap(({ name }) => [name, containerBreakpointProp(name)]),
  )

  for (const [key, value] of Object.entries(props)) {
    const inactiveBreakpointLikeProp =
      !NATIVE_OBJECT_PROP_KEYS.has(key) && isBreakpointLikeValue(value)

    if (
      !VIEW_INTERNAL_PROP_KEYS.has(key) &&
      !responsivePropKeys.has(key) &&
      !inactiveBreakpointLikeProp &&
      isNativePassThroughProp(key)
    ) {
      writableDOMProps[key] = value
    }
  }

  Object.assign(writableDOMProps, dataAttributes(props.data))

  if (props.role !== undefined) domProps.role = props.role
  if (props.label !== undefined) domProps['aria-label'] = props.label
  if (props.description !== undefined) {
    domProps['aria-description'] = props.description
  }
  if (props.level !== undefined) domProps['aria-level'] = props.level
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
  if (typeof props.labelledBy === 'string') {
    domProps['aria-labelledby'] = props.labelledBy
  }
  if (typeof props.describedBy === 'string') {
    domProps['aria-describedby'] = props.describedBy
  }
  if (typeof props.controls === 'string') domProps['aria-controls'] = props.controls
  if (typeof props.owns === 'string') domProps['aria-owns'] = props.owns

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

  const responsiveProps = props as Record<string, unknown>

  for (const breakpoint of breakpointList) {
    responsiveStyles(
      attributeStyle,
      breakpoint.cssName,
      responsiveProps[breakpoint.name] as ViewStyleProps | undefined,
    )
    responsiveStyles(
      attributeStyle,
      `container-${breakpoint.cssName}`,
      responsiveProps[containerBreakpointProp(breakpoint.name)] as ViewStyleProps | undefined,
    )
  }

  stateStyles(
    attributeStyle,
    'hover',
    props.clickable ? { background: 'surfaceHover', ...props.hover } : props.hover,
  )
  stateStyles(
    attributeStyle,
    'active',
    props.clickable
      ? {
          background:
            'color-mix(in srgb, var(--weave-color-outline) 44%, var(--weave-color-surface))',
          ...props.active,
        }
      : props.active,
  )
  stateStyles(attributeStyle, 'focus', props.focus)
  stateStyles(attributeStyle, 'focus-visible', props.focusVisible)
  stateStyles(attributeStyle, 'disabled', props.disabledStyle)

  return {
    domProps,
    attributeStyle,
    layout: props.layout,
  }
}
