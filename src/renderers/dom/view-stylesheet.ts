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
] as const

type ViewStyleProperty = (typeof VIEW_STYLE_PROPERTIES)[number]

const toKebab = (value: string) =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const variableName = (
  property: ViewStyleProperty,
  state?: string,
): `--weave-${string}` =>
  `--weave-${state === undefined ? '' : `${state}-`}${toKebab(property)}`

const VIEW_STYLE_STATES = [
  'hover',
  'active',
  'focus',
  'focus-visible',
  'disabled',
] as const

const declarationBlock = (state?: string) =>
  VIEW_STYLE_PROPERTIES.map((property) => {
    const cssProperty = toKebab(property)
    const stateVariable = variableName(property, state)

    if (state === undefined) {
      return `${cssProperty}: var(${stateVariable});`
    }

    return `${cssProperty}: var(${stateVariable}, var(${variableName(property)}));`
  }).join('')

const propertyRegistrationBlock = () =>
  VIEW_STYLE_PROPERTIES.flatMap((property) => [
    variableName(property),
    ...VIEW_STYLE_STATES.map((state) => variableName(property, state)),
  ])
    .map(
      (variable) =>
        `@property ${variable} { syntax: "*"; inherits: false; }`,
    )
    .join('')

const stylesheet = `
${propertyRegistrationBlock()}

:root {
  --weave-color-primary: #6d5dfc;
  --weave-color-onPrimary: #ffffff;
  --weave-color-secondary: #8b8b96;
  --weave-color-surface: #ffffff;
  --weave-color-surfaceHover: #f5f5f7;
  --weave-color-success: #20a464;
  --weave-color-warning: #d78b00;
  --weave-color-danger: #d94040;
  --weave-color-outline: #d8d8df;
  --weave-color-focus: #6d5dfc;

  --weave-radius-none: 0;
  --weave-radius-small: 0.375rem;
  --weave-radius-medium: 0.75rem;
  --weave-radius-large: 1rem;
  --weave-radius-full: 9999px;

  --weave-shadow-small: 0 0.125rem 0.375rem rgb(0 0 0 / 0.08);
  --weave-shadow-medium: 0 0.5rem 1.5rem rgb(0 0 0 / 0.12);
  --weave-shadow-large: 0 1rem 3rem rgb(0 0 0 / 0.16);
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

let installed = false

export function ensureViewStylesheet(): void {
  if (installed || typeof document === 'undefined') return

  const existing = document.querySelector('style[data-weave-view-styles]')
  if (existing !== null) {
    installed = true
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveViewStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
  installed = true
}

export { VIEW_STYLE_PROPERTIES, variableName }
