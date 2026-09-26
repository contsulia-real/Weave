import type { CSSProperties, HTMLAttributes } from 'react'
import type {
  ViewData,
  ViewProps,
} from '../../core/view-types'
import {
  resolveView,
  type ResolvedView,
  type ResolvedViewStyle,
} from '../../core/resolved-view'
import { VIEW_INTERNAL_PROP_KEYS } from '../../core/view-prop-keys'
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
} from './css-values'
import { defaultBreakpoints } from '../../theme/default-theme'
import {
  breakpointCSSName,
  breakpointEntries,
  containerBreakpointProp,
} from './breakpoint-utils'
import { variableName } from './view-stylesheet'

type CSSVariableStyle = CSSProperties &
  Record<`--weave-${string}`, string | number | undefined>

const NATIVE_OBJECT_PROP_KEYS = new Set<string>([
  'dangerouslySetInnerHTML',
])

function isBreakpointLikeValue(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
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

function resolveStyleProps(
  props: ResolvedViewStyle,
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

  setVariable(output, 'marginTop', length(props.marginTop), state)
  setVariable(output, 'marginRight', length(props.marginRight), state)
  setVariable(output, 'marginBottom', length(props.marginBottom), state)
  setVariable(output, 'marginLeft', length(props.marginLeft), state)

  setVariable(output, 'paddingTop', length(props.paddingTop), state)
  setVariable(output, 'paddingRight', length(props.paddingRight), state)
  setVariable(output, 'paddingBottom', length(props.paddingBottom), state)
  setVariable(output, 'paddingLeft', length(props.paddingLeft), state)
  setVariable(
    output,
    'position',
    props.position ?? (props.layout === 'absolute' ? 'relative' : undefined),
    state,
  )
  setVariable(output, 'top', length(props.top), state)
  setVariable(output, 'right', length(props.right), state)
  setVariable(output, 'bottom', length(props.bottom), state)
  setVariable(output, 'left', length(props.left), state)

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

  const borderTop = length(props.borderTop)
  const borderRight = length(props.borderRight)
  const borderBottom = length(props.borderBottom)
  const borderLeft = length(props.borderLeft)
  setVariable(output, 'borderTopWidth', borderTop, state)
  setVariable(output, 'borderRightWidth', borderRight, state)
  setVariable(output, 'borderBottomWidth', borderBottom, state)
  setVariable(output, 'borderLeftWidth', borderLeft, state)

  setVariable(
    output,
    'borderTopColor',
    color(props.borderTopColor),
    state,
  )
  setVariable(
    output,
    'borderRightColor',
    color(props.borderRightColor),
    state,
  )
  setVariable(
    output,
    'borderBottomColor',
    color(props.borderBottomColor),
    state,
  )
  setVariable(
    output,
    'borderLeftColor',
    color(props.borderLeftColor),
    state,
  )
  setVariable(output, 'borderStyle', props.borderStyle, state)

  setVariable(
    output,
    'borderTopLeftRadius',
    radius(props.radiusTopLeft),
    state,
  )
  setVariable(
    output,
    'borderTopRightRadius',
    radius(props.radiusTopRight),
    state,
  )
  setVariable(
    output,
    'borderBottomRightRadius',
    radius(props.radiusBottomRight),
    state,
  )
  setVariable(
    output,
    'borderBottomLeftRadius',
    radius(props.radiusBottomLeft),
    state,
  )

  setVariable(output, 'boxShadow', shadow(props.shadow), state)
  setVariable(output, 'opacity', props.opacity, state)
  setVariable(output, 'filter', filterValue(props), state)
  setVariable(output, 'backdropFilter', backdropFilterValue(props), state)
  setVariable(
    output,
    'transform',
    transformValue({ transform: props.transform }),
    state,
  )
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
  value: ResolvedViewStyle | undefined,
): void {
  if (value === undefined) return
  Object.assign(output, resolveStyleProps(value, state))
}

function responsiveStyles(
  output: CSSVariableStyle,
  prefix: string,
  value: ResolvedViewStyle | undefined,
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

export function compileDOMView<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  resolvedView: ResolvedView,
  breakpoints: Readonly<Record<string, number>> = defaultBreakpoints,
): ResolvedDOMView<TElement> {
  const domProps: HTMLAttributes<TElement> = {}
  const writableDOMProps = domProps as Record<string, unknown>
  const breakpointList = breakpointEntries(breakpoints)
  const responsivePropKeys = new Set(
    breakpointList.flatMap(({ name }) => [
      name,
      containerBreakpointProp(name),
    ]),
  )

  for (const [key, value] of Object.entries(props)) {
    const inactiveBreakpointLikeProp =
      !NATIVE_OBJECT_PROP_KEYS.has(key) &&
      isBreakpointLikeValue(value)

    if (
      !VIEW_INTERNAL_PROP_KEYS.has(key) &&
      !responsivePropKeys.has(key) &&
      !inactiveBreakpointLikeProp
    ) {
      writableDOMProps[key] = value
    }
  }

  Object.assign(writableDOMProps, dataAttributes(props.data))

  const semantic = resolvedView.semantics

  if (semantic.role !== undefined) domProps.role = semantic.role
  if (semantic.label !== undefined) domProps['aria-label'] = semantic.label
  if (semantic.description !== undefined) {
    domProps['aria-description'] = semantic.description
  }
  if (semantic.level !== undefined) domProps['aria-level'] = semantic.level
  if (semantic.disabled !== undefined) domProps['aria-disabled'] = semantic.disabled
  if (semantic.required !== undefined) domProps['aria-required'] = semantic.required
  if (semantic.invalid !== undefined) domProps['aria-invalid'] = semantic.invalid
  if (semantic.busy !== undefined) domProps['aria-busy'] = semantic.busy
  if (semantic.expanded !== undefined) domProps['aria-expanded'] = semantic.expanded
  if (semantic.selected !== undefined) domProps['aria-selected'] = semantic.selected
  if (semantic.checked !== undefined) domProps['aria-checked'] = semantic.checked
  if (semantic.pressed !== undefined) domProps['aria-pressed'] = semantic.pressed
  if (semantic.readOnly !== undefined) domProps['aria-readonly'] = semantic.readOnly
  if (semantic.valueMin !== undefined) domProps['aria-valuemin'] = semantic.valueMin
  if (semantic.valueMax !== undefined) domProps['aria-valuemax'] = semantic.valueMax
  if (semantic.valueNow !== undefined) domProps['aria-valuenow'] = semantic.valueNow
  if (semantic.valueText !== undefined) domProps['aria-valuetext'] = semantic.valueText
  if (semantic.labelledBy !== undefined) {
    domProps['aria-labelledby'] = semantic.labelledBy
  }
  if (semantic.describedBy !== undefined) {
    domProps['aria-describedby'] = semantic.describedBy
  }
  if (semantic.controls !== undefined) domProps['aria-controls'] = semantic.controls
  if (semantic.owns !== undefined) domProps['aria-owns'] = semantic.owns

  const interaction = resolvedView.interaction

  if (
    (
      interaction.focusable ||
      interaction.autoFocus
    ) &&
    interaction.tabIndex === undefined
  ) {
    domProps.tabIndex = 0
  } else if (interaction.tabIndex !== undefined) {
    domProps.tabIndex = interaction.tabIndex
  }

  if (props.hidden !== undefined) domProps.hidden = props.hidden
  if (props.draggable !== undefined) domProps.draggable = props.draggable

  const attributeStyle = resolveStyleProps(resolvedView.style)

  if (resolvedView.container !== undefined) {
    setVariable(attributeStyle, 'containerType', 'inline-size')
    setVariable(attributeStyle, 'containerName', resolvedView.container)
  }

  for (const responsive of resolvedView.responsive) {
    const cssName = breakpointCSSName(responsive.name)
    responsiveStyles(
      attributeStyle,
      responsive.scope === 'viewport'
        ? cssName
        : `container-${cssName}`,
      responsive.style,
    )
  }

  stateStyles(attributeStyle, 'hover', resolvedView.states.hover)
  stateStyles(attributeStyle, 'active', resolvedView.states.active)
  stateStyles(attributeStyle, 'focus', resolvedView.states.focus)
  stateStyles(
    attributeStyle,
    'focus-visible',
    resolvedView.states.focusVisible,
  )
  stateStyles(attributeStyle, 'disabled', resolvedView.states.disabled)

  return {
    domProps,
    attributeStyle,
    layout: resolvedView.layout,
  }
}

export function resolveDOMView<TElement extends HTMLElement>(
  props: ViewProps<TElement>,
  breakpoints: Readonly<Record<string, number>> = defaultBreakpoints,
): ResolvedDOMView<TElement> {
  return compileDOMView(
    props,
    resolveView(props, breakpoints),
    breakpoints,
  )
}
