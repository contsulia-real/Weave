import {
  defaultTheme,
} from '../../theme/default-theme'
import { themeVariableDeclarations } from '../../theme/theme-css'

const VIEW_STYLE_PROPERTIES = [
  'display',
  'flexDirection',
  'flexWrap',
  'gap',
  'alignItems',
  'justifyContent',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
  'justifySelf',
  'order',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridColumn',
  'gridRow',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'aspectRatio',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'overflow',
  'overflowX',
  'overflowY',
  'background',
  'color',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderStyle',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'boxShadow',
  'opacity',
  'filter',
  'backdropFilter',
  'transform',
  'transformOrigin',
  'clipPath',
  'mixBlendMode',
  'outlineWidth',
  'outlineColor',
  'outlineStyle',
  'outlineOffset',
  'zIndex',
  'pointerEvents',
  'cursor',
  'userSelect',
  'containerType',
  'containerName',
] as const

export type ViewStyleProperty = (typeof VIEW_STYLE_PROPERTIES)[number]

const VIEW_STYLE_STATES = [
  'hover',
  'active',
  'focus',
  'focus-visible',
  'disabled',
] as const

const toKebab = (value: string) =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const variableName = (
  property: ViewStyleProperty,
  prefix?: string,
): `--weave-${string}` =>
  `--weave-${prefix === undefined ? '' : `${prefix}-`}${toKebab(property)}`

const componentVariableName = (
  property: ViewStyleProperty,
): `--weave-component-${string}` =>
  `--weave-component-${toKebab(property)}`

const responsiveVariableName = (
  scope: 'viewport' | 'container',
  property: ViewStyleProperty,
): `--weave-${string}` =>
  `--weave-${scope}-responsive-${toKebab(property)}`

const componentFallback = (property: ViewStyleProperty) =>
  `var(${componentVariableName(property)})`

const baseValue = (property: ViewStyleProperty, state?: string) => {
  const base =
    `var(${variableName(property)}, ${componentFallback(property)})`

  if (state === undefined) return base

  return `var(${variableName(property, state)}, ${base})`
}

const resolvedValue = (property: ViewStyleProperty, state?: string) =>
  `var(${responsiveVariableName('container', property)}, var(${responsiveVariableName('viewport', property)}, ${baseValue(property, state)}))`

const declarationBlock = (state?: string) =>
  VIEW_STYLE_PROPERTIES.map(
    (property) => `${toKebab(property)}: ${resolvedValue(property, state)};`,
  ).join('')

const propertyRegistrationBlock = () =>
  VIEW_STYLE_PROPERTIES.flatMap((property) => [
    componentVariableName(property),
    variableName(property),
    ...VIEW_STYLE_STATES.map((state) => variableName(property, state)),
    responsiveVariableName('viewport', property),
    responsiveVariableName('container', property),
  ])
    .map(
      (variable) =>
        `@property ${variable} { syntax: "*"; inherits: false; }`,
    )
    .join('')

const stylesheet = `
${propertyRegistrationBlock()}

:root {
  ${themeVariableDeclarations(defaultTheme)}
}

:where([data-weave-view]) {
  box-sizing: border-box;
  font-family: var(--weave-typography-family-body);
  font-size: var(--weave-typography-size-medium);
  font-weight: var(--weave-typography-weight-regular);
  line-height: var(--weave-typography-line-height-body);
  letter-spacing: var(--weave-typography-letter-spacing-normal);
  ${declarationBlock()}
}

:where([data-weave-view]:hover) {
  ${declarationBlock('hover')}
}

:where([data-weave-view]:active) {
  ${declarationBlock('active')}
}

:where([data-weave-view]:focus) {
  ${declarationBlock('focus')}
}

:where([data-weave-view]:focus-visible) {
  ${declarationBlock('focus-visible')}
}

:where([data-weave-view][aria-disabled="true"]) {
  ${declarationBlock('disabled')}
}

:where(.weave-scroll-host--overflow-auto) {
  overflow: auto;
}

:where(.weave-scroll-host--overflow-scroll) {
  overflow: scroll;
}

:where(.weave-scroll-host--overflow-x-auto) {
  overflow-x: auto;
}

:where(.weave-scroll-host--overflow-x-scroll) {
  overflow-x: scroll;
}

:where(.weave-scroll-host--overflow-y-auto) {
  overflow-y: auto;
}

:where(.weave-scroll-host--overflow-y-scroll) {
  overflow-y: scroll;
}

:where([data-weave-layout="stack"]) > :where(*) {
  grid-area: 1 / 1;
}

:where([data-weave-layout="absolute"]) > :where(*) {
  position: absolute;
}

:where([data-weave-layout="absolute"]) > :where([data-weave-view]) {
  position: var(--weave-position, var(--weave-component-position, absolute));
}
`

export function ensureViewStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-view-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveViewStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}

export {
  VIEW_STYLE_PROPERTIES,
  componentVariableName,
  responsiveVariableName,
  variableName,
}
