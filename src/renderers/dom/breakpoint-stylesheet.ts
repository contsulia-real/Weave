import { useInsertionEffect } from 'react'
import type {
  ButtonSize,
  ButtonVariant,
} from '../../core/button-types'
import {
  buttonSizeDeclarations,
  buttonVariantDeclarations,
} from './button-stylesheet'
import type { ViewStyleProperty } from './view-stylesheet'
import {
  VIEW_STYLE_PROPERTIES,
  responsiveVariableName,
  variableName,
} from './view-stylesheet'
import type { TextStyleProperty } from './text-stylesheet'
import {
  TEXT_STYLE_PROPERTIES,
  textResponsiveVariableName,
  textVariableName,
} from './text-stylesheet'
import {
  breakpointEntries,
  type BreakpointEntry,
} from './breakpoint-utils'
import { hashRuntimeValue } from './runtime-class'

interface BreakpointRule {
  className: string
  signature: string
  stylesheet: string
}

interface BreakpointRuleEntry {
  count: number
  element: HTMLStyleElement
}

const breakpointRules = new Map<string, BreakpointRuleEntry>()

function sourceChain(
  entries: readonly BreakpointEntry[],
  index: number,
  variable: (entry: BreakpointEntry) => string,
): string {
  return entries
    .slice(0, index + 1)
    .reduce(
      (current, entry) =>
        current.length === 0
          ? `var(${variable(entry)})`
          : `var(${variable(entry)}, ${current})`,
      '',
    )
}

function viewAssignmentBlock(
  entries: readonly BreakpointEntry[],
  index: number,
  scope: 'viewport' | 'container',
): string {
  return VIEW_STYLE_PROPERTIES.map((property: ViewStyleProperty) => {
    const chain = sourceChain(
      entries,
      index,
      (entry) =>
        variableName(
          property,
          scope === 'viewport'
            ? entry.cssName
            : `container-${entry.cssName}`,
        ),
    )

    return `${responsiveVariableName(scope, property)}: ${chain};`
  }).join('')
}

function textAssignmentBlock(
  entries: readonly BreakpointEntry[],
  index: number,
): string {
  return TEXT_STYLE_PROPERTIES.map((property: TextStyleProperty) => {
    const chain = sourceChain(
      entries,
      index,
      (entry) => textVariableName(property, entry.cssName),
    )

    return `${textResponsiveVariableName(property)}: ${chain};`
  }).join('')
}

function propertyRegistrationBlock(
  entries: readonly BreakpointEntry[],
): string {
  return entries
    .flatMap((entry) => [
      ...VIEW_STYLE_PROPERTIES.flatMap((property) => [
        variableName(property, entry.cssName),
        variableName(property, `container-${entry.cssName}`),
      ]),
      ...TEXT_STYLE_PROPERTIES.map((property) =>
        textVariableName(property, entry.cssName),
      ),
    ])
    .map(
      (variable) =>
        `@property ${variable} { syntax: "*"; inherits: false; }`,
    )
    .join('')
}

function textResponsiveBehavior(
  className: string,
  entry: BreakpointEntry,
): string {
  return `
  :where(.${className}[data-weave-text][data-weave-text-${entry.cssName}-overflow="ellipsis"]),
  :where(.${className}[data-weave-text][data-weave-text-${entry.cssName}-max-lines]) {
    overflow: hidden;
  }

  :where(.${className}[data-weave-text][data-weave-text-${entry.cssName}-max-lines]) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
`
}


const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'danger',
]

const BUTTON_SIZES: readonly ButtonSize[] = [
  'small',
  'medium',
  'large',
]

function buttonResponsiveBehavior(
  className: string,
  entry: BreakpointEntry,
): string {
  const variants = BUTTON_VARIANTS.map(
    (variant) => `
  .${className}[data-weave-button][data-weave-button-${entry.cssName}-variant="${variant}"] {
    ${buttonVariantDeclarations(variant)}
  }
`,
  ).join('')

  const sizes = BUTTON_SIZES.map(
    (size) => `
  .${className}[data-weave-button][data-weave-button-${entry.cssName}-size="${size}"] {
    ${buttonSizeDeclarations(size)}
  }
`,
  ).join('')

  return variants + sizes
}

function viewportBlocks(
  className: string,
  entries: readonly BreakpointEntry[],
): string {
  return entries
    .map(
      (entry, index) => `
@media (min-width: ${entry.minWidth}rem) {
  :where(.${className}[data-weave-view]) {
    ${viewAssignmentBlock(entries, index, 'viewport')}
  }

  :where(.${className}[data-weave-text]) {
    ${textAssignmentBlock(entries, index)}
  }

  ${textResponsiveBehavior(className, entry)}
  ${buttonResponsiveBehavior(className, entry)}
}
`,
    )
    .join('')
}

function containerBlocks(
  className: string,
  entries: readonly BreakpointEntry[],
): string {
  return entries
    .map(
      (entry, index) => `
@container (min-width: ${entry.minWidth}rem) {
  :where(.${className}[data-weave-view]) {
    ${viewAssignmentBlock(entries, index, 'container')}
  }
}
`,
    )
    .join('')
}

function createBreakpointRule(
  breakpoints: Readonly<Record<string, number>>,
): BreakpointRule | undefined {
  const entries = breakpointEntries(breakpoints)
  if (entries.length === 0) return undefined

  const signature = JSON.stringify(
    entries.map(({ name, cssName, minWidth }) => [
      name,
      cssName,
      minWidth,
    ]),
  )
  const className =
    `weave-breakpoints-${hashRuntimeValue(signature)}`

  return {
    className,
    signature,
    stylesheet: `
${propertyRegistrationBlock(entries)}
${viewportBlocks(className, entries)}
${containerBlocks(className, entries)}
`,
  }
}

function createStyleElement(rule: BreakpointRule): HTMLStyleElement {
  const element = document.createElement('style')
  element.dataset.weaveBreakpointStyles = rule.className
  element.textContent = rule.stylesheet
  document.head.append(element)
  return element
}

function releaseBreakpointRule(className: string): void {
  const current = breakpointRules.get(className)
  if (current === undefined) return

  current.count -= 1

  if (current.count <= 0) {
    current.element.remove()
    breakpointRules.delete(className)
  }
}

function retainBreakpointRule(rule: BreakpointRule): () => void {
  const current = breakpointRules.get(rule.className)

  if (current !== undefined) {
    current.count += 1
    return () => releaseBreakpointRule(rule.className)
  }

  const existing = document.querySelector<HTMLStyleElement>(
    `style[data-weave-breakpoint-styles="${rule.className}"]`,
  )
  const element = existing ?? createStyleElement(rule)

  breakpointRules.set(rule.className, {
    count: 1,
    element,
  })

  return () => releaseBreakpointRule(rule.className)
}

export function useBreakpointStylesheet(
  breakpoints: Readonly<Record<string, number>>,
): string | undefined {
  const rule = createBreakpointRule(breakpoints)

  useInsertionEffect(() => {
    if (rule === undefined || typeof document === 'undefined') return

    return retainBreakpointRule(rule)
  }, [rule?.className, rule?.signature])

  return rule?.className
}
