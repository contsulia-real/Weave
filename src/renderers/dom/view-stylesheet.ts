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
  'maskImage',
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

const VIEW_MOTION_STATES = [
  'motion-enter-from',
  'motion-enter-to',
  'motion-exit-from',
  'motion-exit-to',
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
    ...VIEW_MOTION_STATES.map((state) => variableName(property, state)),
    responsiveVariableName('viewport', property),
    responsiveVariableName('container', property),
  ])
    .map(
      (variable) =>
        `@property ${variable} { syntax: "*"; inherits: false; }`,
    )
    .join('')

const motionPropertyRegistrationBlock = () => [
  '--weave-component-transition-property',
  '--weave-component-transition-duration',
  '--weave-component-transition-timing-function',
  '--weave-component-transition-delay',
  '--weave-transition-property',
  '--weave-transition-duration',
  '--weave-transition-timing-function',
  '--weave-transition-delay',
]
  .map(
    (variable) =>
      `@property ${variable} { syntax: "*"; inherits: false; }`,
  )
  .join('')

const stylesheet = `
${propertyRegistrationBlock()}
${motionPropertyRegistrationBlock()}

:root {
  ${themeVariableDeclarations(defaultTheme)}
  font-family: var(--weave-typography-family-body);
  font-size: var(--weave-typography-style-body-large-font-size);
  font-weight: var(--weave-typography-style-body-large-font-weight);
  line-height: var(--weave-typography-style-body-large-line-height);
  letter-spacing: var(--weave-typography-style-body-large-letter-spacing);
}

:where([data-weave-view]) {
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  ${declarationBlock()}
  transition-property: var(
    --weave-transition-property,
    var(--weave-component-transition-property, none)
  );
  transition-duration: var(
    --weave-transition-duration,
    var(--weave-component-transition-duration, 0ms)
  );
  transition-timing-function: var(
    --weave-transition-timing-function,
    var(--weave-component-transition-timing-function, ease)
  );
  transition-delay: var(
    --weave-transition-delay,
    var(--weave-component-transition-delay, 0ms)
  );
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

:where([data-weave-view][data-weave-motion-state="enter-from"]) {
  ${declarationBlock('motion-enter-from')}
}

:where([data-weave-view][data-weave-motion-state="enter-to"]) {
  ${declarationBlock('motion-enter-to')}
}

:where([data-weave-view][data-weave-motion-state="exit-from"]) {
  ${declarationBlock('motion-exit-from')}
}

:where([data-weave-view][data-weave-motion-state="exit-to"]) {
  ${declarationBlock('motion-exit-to')}
}

:where([data-weave-view][data-weave-layout-animating="true"]) {
  transform-origin: 0 0;
  will-change: translate, scale;
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

:where([data-weave-layout="stack"]) {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  justify-content: stretch;
  justify-items: var(
    --weave-container-responsive-justify-content,
    var(
      --weave-viewport-responsive-justify-content,
      var(
        --weave-justify-content,
        var(--weave-component-justify-content, stretch)
      )
    )
  );
}

:where([data-weave-layout="stack"]:hover) {
  justify-items: var(
    --weave-container-responsive-justify-content,
    var(
      --weave-viewport-responsive-justify-content,
      var(
        --weave-hover-justify-content,
        var(
          --weave-justify-content,
          var(--weave-component-justify-content, stretch)
        )
      )
    )
  );
}

:where([data-weave-layout="stack"]:active) {
  justify-items: var(
    --weave-container-responsive-justify-content,
    var(
      --weave-viewport-responsive-justify-content,
      var(
        --weave-active-justify-content,
        var(
          --weave-justify-content,
          var(--weave-component-justify-content, stretch)
        )
      )
    )
  );
}

:where([data-weave-layout="stack"]:focus) {
  justify-items: var(
    --weave-container-responsive-justify-content,
    var(
      --weave-viewport-responsive-justify-content,
      var(
        --weave-focus-justify-content,
        var(
          --weave-justify-content,
          var(--weave-component-justify-content, stretch)
        )
      )
    )
  );
}

:where([data-weave-layout="stack"]:focus-visible) {
  justify-items: var(
    --weave-container-responsive-justify-content,
    var(
      --weave-viewport-responsive-justify-content,
      var(
        --weave-focus-visible-justify-content,
        var(
          --weave-justify-content,
          var(--weave-component-justify-content, stretch)
        )
      )
    )
  );
}

:where([data-weave-layout="stack"][aria-disabled="true"]) {
  justify-items: var(
    --weave-container-responsive-justify-content,
    var(
      --weave-viewport-responsive-justify-content,
      var(
        --weave-disabled-justify-content,
        var(
          --weave-justify-content,
          var(--weave-component-justify-content, stretch)
        )
      )
    )
  );
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
