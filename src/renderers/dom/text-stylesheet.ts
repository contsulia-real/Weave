import {
  defaultBreakpoints,
  type DefaultBreakpointName,
} from '../../theme/default-theme'

const TEXT_STYLE_PROPERTIES = [
  'font-size',
  'font-weight',
  'text-align',
  'line-height',
  'letter-spacing',
  'white-space',
  'text-wrap',
  'text-overflow',
  'text-transform',
  'max-lines',
] as const

type TextStyleProperty = (typeof TEXT_STYLE_PROPERTIES)[number]

const BREAKPOINT_NAMES = Object.keys(
  defaultBreakpoints,
) as DefaultBreakpointName[]

const variableName = (
  property: TextStyleProperty,
  breakpoint?: string,
): `--weave-text-${string}` =>
  `--weave-text-${breakpoint === undefined ? '' : `${breakpoint}-`}${property}`

const propertyRegistrationBlock = () =>
  TEXT_STYLE_PROPERTIES.flatMap((property) => [
    variableName(property),
    ...BREAKPOINT_NAMES.map((name) => variableName(property, name)),
  ])
    .map(
      (variable) =>
        `@property ${variable} { syntax: "*"; inherits: false; }`,
    )
    .join('')

const fallbackFor = (property: TextStyleProperty) => {
  switch (property) {
    case 'font-size':
    case 'font-weight':
    case 'text-align':
    case 'line-height':
    case 'letter-spacing':
    case 'white-space':
    case 'text-wrap':
    case 'text-transform':
      return 'inherit'
    case 'text-overflow':
      return 'clip'
    case 'max-lines':
      return 'unset'
  }
}

const cssProperty = (property: TextStyleProperty) =>
  property === 'max-lines' ? '-webkit-line-clamp' : property

const sourceChain = (
  property: TextStyleProperty,
  breakpointIndex?: number,
) => {
  const base = `var(${variableName(property)}, ${fallbackFor(property)})`

  if (breakpointIndex === undefined) return base

  return BREAKPOINT_NAMES.slice(0, breakpointIndex + 1)
    .reverse()
    .reduce(
      (current, name) =>
        `var(${variableName(property, name)}, ${current})`,
      base,
    )
}

const declarationBlock = (breakpointIndex?: number) =>
  TEXT_STYLE_PROPERTIES.map(
    (property) =>
      `${cssProperty(property)}: ${sourceChain(property, breakpointIndex)};`,
  ).join('')

const responsiveBlocks = () =>
  BREAKPOINT_NAMES.map(
    (name, index) => `
@media (min-width: ${defaultBreakpoints[name]}rem) {
  :where([data-weave-text]) {
    ${declarationBlock(index)}
  }

  :where([data-weave-text][data-weave-text-${name}-overflow]),
  :where([data-weave-text][data-weave-text-${name}-max-lines]) {
    overflow: hidden;
  }

  :where([data-weave-text][data-weave-text-${name}-max-lines]) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}
`,
  ).join('')

const stylesheet = `
${propertyRegistrationBlock()}

:where([data-weave-text]) {
  ${declarationBlock()}
}

:where([data-weave-text][data-weave-text-overflow="ellipsis"]),
:where([data-weave-text][data-weave-text-max-lines]) {
  overflow: hidden;
}

:where([data-weave-text][data-weave-text-max-lines]) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

${responsiveBlocks()}
`

export function ensureTextStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-text-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveTextStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
