import {
  defaultBreakpoints,
  defaultTheme,
  type DefaultBreakpointName,
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

type ViewStyleProperty = (typeof VIEW_STYLE_PROPERTIES)[number]

const VIEW_STYLE_STATES = [
  'hover',
  'active',
  'focus',
  'focus-visible',
  'disabled',
] as const

const BREAKPOINT_NAMES = Object.keys(
  defaultBreakpoints,
) as DefaultBreakpointName[]

const toKebab = (value: string) =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const variableName = (
  property: ViewStyleProperty,
  prefix?: string,
): `--weave-${string}` =>
  `--weave-${prefix === undefined ? '' : `${prefix}-`}${toKebab(property)}`

const responsiveVariableName = (
  scope: 'viewport' | 'container',
  property: ViewStyleProperty,
): `--weave-${string}` =>
  `--weave-${scope}-responsive-${toKebab(property)}`

const baseValue = (property: ViewStyleProperty, state?: string) => {
  if (state === undefined) {
    return `var(${variableName(property)})`
  }

  return `var(${variableName(property, state)}, var(${variableName(property)}))`
}

const resolvedValue = (property: ViewStyleProperty, state?: string) =>
  `var(${responsiveVariableName('container', property)}, var(${responsiveVariableName('viewport', property)}, ${baseValue(property, state)}))`

const declarationBlock = (state?: string) =>
  VIEW_STYLE_PROPERTIES.map(
    (property) => `${toKebab(property)}: ${resolvedValue(property, state)};`,
  ).join('')

const responsiveSourceNames = (property: ViewStyleProperty) =>
  BREAKPOINT_NAMES.flatMap((name) => [
    variableName(property, name),
    variableName(property, `container-${name}`),
  ])

const propertyRegistrationBlock = () =>
  VIEW_STYLE_PROPERTIES.flatMap((property) => [
    variableName(property),
    ...VIEW_STYLE_STATES.map((state) => variableName(property, state)),
    ...responsiveSourceNames(property),
    responsiveVariableName('viewport', property),
    responsiveVariableName('container', property),
  ])
    .map(
      (variable) =>
        `@property ${variable} { syntax: "*"; inherits: false; }`,
    )
    .join('')

const sourceChain = (
  property: ViewStyleProperty,
  breakpointIndex: number,
  scope: 'viewport' | 'container',
) => {
  const names = BREAKPOINT_NAMES.slice(0, breakpointIndex + 1).reverse()
  const prefixes = names.map((name) =>
    scope === 'viewport' ? name : `container-${name}`,
  )

  const fallback =
    scope === 'viewport' ? `var(${variableName(property)})` : undefined

  return prefixes.reduceRight<string>(
    (current, prefix) =>
      current.length === 0
        ? `var(${variableName(property, prefix)})`
        : `var(${variableName(property, prefix)}, ${current})`,
    fallback ?? '',
  )
}

const responsiveAssignmentBlock = (
  breakpointIndex: number,
  scope: 'viewport' | 'container',
) =>
  VIEW_STYLE_PROPERTIES.map(
    (property) =>
      `${responsiveVariableName(scope, property)}: ${sourceChain(property, breakpointIndex, scope)};`,
  ).join('')

const viewportBlocks = () =>
  BREAKPOINT_NAMES.map(
    (name, index) => `
@media (min-width: ${defaultBreakpoints[name]}rem) {
  :where([data-weave-view]) {
    ${responsiveAssignmentBlock(index, 'viewport')}
  }
}
`,
  ).join('')

const containerBlocks = () =>
  BREAKPOINT_NAMES.map(
    (name, index) => `
@container (min-width: ${defaultBreakpoints[name]}rem) {
  :where([data-weave-view]) {
    ${responsiveAssignmentBlock(index, 'container')}
  }
}
`,
  ).join('')

const stylesheet = `
${propertyRegistrationBlock()}

:root {
  ${themeVariableDeclarations(defaultTheme)}
}

:where([data-weave-view]) {
  box-sizing: border-box;
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

${viewportBlocks()}
${containerBlocks()}

:where([data-weave-layout="stack"]) > :where(*) {
  grid-area: 1 / 1;
}

:where([data-weave-layout="absolute"]) > :where(*) {
  position: absolute;
}

:where([data-weave-layout="absolute"]) > :where([data-weave-view]) {
  position: var(--weave-position, absolute);
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

export { VIEW_STYLE_PROPERTIES, variableName }
