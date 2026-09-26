import type {
  ViewEventProps,
  ViewSemanticProps,
  ViewStyleProps,
} from './view-types'

export const VIEW_STYLE_PROP_KEYS = [
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
  'selectable',
] as const satisfies readonly (keyof ViewStyleProps)[]

export type ViewStylePropKey =
  (typeof VIEW_STYLE_PROP_KEYS)[number]

export const VIEW_STYLE_PROP_KEYS_COMPLETE:
  Exclude<keyof ViewStyleProps, ViewStylePropKey> extends never
    ? true
    : never = true

export const VIEW_SEMANTIC_PROP_KEYS = [
  'role',
  'label',
  'description',
  'level',
  'disabled',
  'required',
  'invalid',
  'busy',
  'expanded',
  'selected',
  'checked',
  'pressed',
  'readOnly',
  'valueMin',
  'valueMax',
  'valueNow',
  'valueText',
  'labelledBy',
  'describedBy',
  'controls',
  'owns',
] as const satisfies readonly (keyof ViewSemanticProps)[]

export type ViewSemanticPropKey =
  (typeof VIEW_SEMANTIC_PROP_KEYS)[number]

export const VIEW_SEMANTIC_PROP_KEYS_COMPLETE:
  Exclude<
    keyof ViewSemanticProps,
    ViewSemanticPropKey
  > extends never
    ? true
    : never = true

export const VIEW_EVENT_PROP_KEYS = [
  'onClick',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerMove',
  'onPointerDown',
  'onPointerUp',
  'onPointerCancel',
  'onKeyDown',
  'onKeyUp',
  'onFocus',
  'onBlur',
] as const satisfies readonly (keyof ViewEventProps)[]

export type ViewEventPropKey =
  (typeof VIEW_EVENT_PROP_KEYS)[number]

export const VIEW_EVENT_PROP_KEYS_COMPLETE:
  Exclude<keyof ViewEventProps, ViewEventPropKey> extends never
    ? true
    : never = true

export const VIEW_DEFAULT_BREAKPOINT_PROP_KEYS = [
  'sm',
  'md',
  'lg',
  'xl',
  'containerSm',
  'containerMd',
  'containerLg',
  'containerXl',
] as const

export const VIEW_CONTROL_PROP_KEYS = [
  'children',
  'ref',
  'className',
  'style',
  'data',
  'focusable',
  'autoFocus',
  'hidden',
  'draggable',
  'tabIndex',
  'hover',
  'active',
  'focus',
  'focusVisible',
  'disabledStyle',
  'container',
  'scrollbar',
] as const

export const VIEW_INTERNAL_PROP_KEYS = new Set<string>([
  ...VIEW_STYLE_PROP_KEYS,
  ...VIEW_SEMANTIC_PROP_KEYS,
  ...VIEW_EVENT_PROP_KEYS,
  ...VIEW_DEFAULT_BREAKPOINT_PROP_KEYS,
  ...VIEW_CONTROL_PROP_KEYS,
])
