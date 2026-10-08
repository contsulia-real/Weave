import { useInsertionEffect } from 'react'
import type { ButtonSize, ButtonVariant } from '../../core/button-types'
import { type BreakpointEntry, breakpointEntries } from './breakpoint-utils'
import { buttonSizeDeclarations, buttonVariantDeclarations } from './button-stylesheet'
import { useWeaveDocument } from './document-context'
import { createRetainedStylesheetRegistry } from './retained-stylesheet'
import { hashRuntimeValue } from './runtime-class'
import type { TextStyleProperty } from './text-stylesheet'
import {
  TEXT_STYLE_PROPERTIES,
  textResponsiveVariableName,
  textVariableName,
} from './text-stylesheet'
import type { ViewStyleProperty } from './view-stylesheet'
import { responsiveVariableName, VIEW_STYLE_PROPERTIES, variableName } from './view-stylesheet'

interface BreakpointRule {
  className: string
  signature: string
  stylesheet: string
}

const breakpointRuleCache = new WeakMap<object, BreakpointRule | null>()

function sourceChain(
  entries: readonly BreakpointEntry[],
  index: number,
  variable: (entry: BreakpointEntry) => string,
): string {
  return entries
    .slice(0, index + 1)
    .reduce(
      (current, entry) =>
        current.length === 0 ? `var(${variable(entry)})` : `var(${variable(entry)}, ${current})`,
      '',
    )
}

function viewAssignmentBlock(
  entries: readonly BreakpointEntry[],
  index: number,
  scope: 'viewport' | 'container',
): string {
  return VIEW_STYLE_PROPERTIES.map((property: ViewStyleProperty) => {
    const chain = sourceChain(entries, index, (entry) =>
      variableName(property, scope === 'viewport' ? entry.cssName : `container-${entry.cssName}`),
    )

    return `${responsiveVariableName(scope, property)}: ${chain};`
  }).join('')
}

function textAssignmentBlock(entries: readonly BreakpointEntry[], index: number): string {
  return TEXT_STYLE_PROPERTIES.map((property: TextStyleProperty) => {
    const chain = sourceChain(entries, index, (entry) => textVariableName(property, entry.cssName))

    return `${textResponsiveVariableName(property)}: ${chain};`
  }).join('')
}

function propertyRegistrationBlock(entries: readonly BreakpointEntry[]): string {
  return entries
    .flatMap((entry) => [
      ...VIEW_STYLE_PROPERTIES.flatMap((property) => [
        variableName(property, entry.cssName),
        variableName(property, `container-${entry.cssName}`),
      ]),
      ...TEXT_STYLE_PROPERTIES.map((property) => textVariableName(property, entry.cssName)),
    ])
    .map((variable) => `@property ${variable} { syntax: "*"; inherits: false; }`)
    .join('')
}

function textResponsiveBehavior(className: string, entry: BreakpointEntry): string {
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

const BUTTON_SIZES: readonly ButtonSize[] = ['small', 'medium', 'large']

function buttonResponsiveBehavior(className: string, entry: BreakpointEntry): string {
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

function viewportBlocks(className: string, entries: readonly BreakpointEntry[]): string {
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

function containerBlocks(className: string, entries: readonly BreakpointEntry[]): string {
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
  const cacheKey = breakpoints as object

  if (breakpointRuleCache.has(cacheKey)) {
    return breakpointRuleCache.get(cacheKey) ?? undefined
  }

  const entries = breakpointEntries(breakpoints)
  if (entries.length === 0) {
    breakpointRuleCache.set(cacheKey, null)
    return undefined
  }

  const signature = JSON.stringify(
    entries.map(({ name, cssName, minWidth }) => [name, cssName, minWidth]),
  )
  const className = `weave-breakpoints-${hashRuntimeValue(signature)}`

  const rule = {
    className,
    signature,
    stylesheet: `
${propertyRegistrationBlock(entries)}
${viewportBlocks(className, entries)}
${containerBlocks(className, entries)}
`,
  }

  breakpointRuleCache.set(cacheKey, rule)
  return rule
}

type RetainBreakpointRule = (rule: BreakpointRule) => () => void

const breakpointRegistries = new WeakMap<Document, RetainBreakpointRule>()

function registryFor(ownerDocument: Document): RetainBreakpointRule {
  const existing = breakpointRegistries.get(ownerDocument)
  if (existing !== undefined) return existing

  const registry = createRetainedStylesheetRegistry(
    (rule: BreakpointRule) => rule.className,
    (rule) =>
      ownerDocument.querySelector<HTMLStyleElement>(
        `style[data-weave-breakpoint-styles="${rule.className}"]`,
      ),
    (rule) => {
      const element = ownerDocument.createElement('style')
      element.dataset.weaveBreakpointStyles = rule.className
      element.textContent = rule.stylesheet
      ownerDocument.head.append(element)
      return element
    },
    (rule) => rule.signature,
  )
  breakpointRegistries.set(ownerDocument, registry)
  return registry
}

export function useBreakpointStylesheet(
  breakpoints: Readonly<Record<string, number>>,
): string | undefined {
  const rule = createBreakpointRule(breakpoints)
  const ownerDocument = useWeaveDocument()

  useInsertionEffect(() => {
    if (rule === undefined || ownerDocument === null) return

    return registryFor(ownerDocument)(rule)
  }, [ownerDocument, rule?.className, rule?.signature])

  return rule?.className
}
