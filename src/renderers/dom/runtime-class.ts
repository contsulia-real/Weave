import { useInsertionEffect } from 'react'
import { useWeaveDocument } from './document-context'
import { createRetainedStylesheetRegistry } from './retained-stylesheet'

export type RuntimeStyleValue = string | number | null | undefined

export type RuntimeStyleDeclarations = Readonly<Record<string, RuntimeStyleValue>>

type RuntimeEntry = readonly [string, string | number]

interface RuntimeClassRule {
  className: string
  signature: string
  declarations: readonly RuntimeEntry[]
}

const runtimeRuleCache = new WeakMap<object, Map<string, RuntimeClassRule | null>>()

function cssPropertyName(name: string): string {
  if (name.startsWith('--') || name.includes('-')) return name
  return name.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
}

function entries(declarations: Readonly<object> | undefined): readonly RuntimeEntry[] {
  if (declarations === undefined) return []

  return Object.entries(declarations)
    .filter(
      (entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== null,
    )
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
}

export function hashRuntimeValue(value: string): string {
  let fnv = 2166136261
  let djb = 5381

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    fnv ^= code
    fnv = Math.imul(fnv, 16777619)
    djb = Math.imul(djb, 33) ^ code
  }

  return `${(fnv >>> 0).toString(36)}-${(djb >>> 0).toString(36)}`
}

function createRuntimeStyleClass(
  prefix: string,
  declarations: Readonly<object> | undefined,
): RuntimeClassRule | undefined {
  if (declarations === undefined) return undefined

  const cacheKey = declarations as object
  const cachedByPrefix = runtimeRuleCache.get(cacheKey)

  if (cachedByPrefix?.has(prefix)) {
    return cachedByPrefix.get(prefix) ?? undefined
  }

  const normalized = entries(declarations)
  if (normalized.length === 0) {
    const next = cachedByPrefix ?? new Map()
    next.set(prefix, null)
    runtimeRuleCache.set(cacheKey, next)
    return undefined
  }

  const signature = JSON.stringify(normalized)
  const className = 'weave-' + prefix + '-' + hashRuntimeValue(signature)

  const rule = {
    className,
    signature,
    declarations: normalized,
  }

  const next = cachedByPrefix ?? new Map()
  next.set(prefix, rule)
  runtimeRuleCache.set(cacheKey, next)

  return rule
}

type RetainRuntimeClass = (rule: RuntimeClassRule) => () => void

const runtimeRegistries = new WeakMap<Document, RetainRuntimeClass>()

function registryFor(ownerDocument: Document): RetainRuntimeClass {
  const existing = runtimeRegistries.get(ownerDocument)
  if (existing !== undefined) return existing

  const registry = createRetainedStylesheetRegistry(
    (rule: RuntimeClassRule) => rule.className,
    (rule) =>
      ownerDocument.querySelector<HTMLStyleElement>(
        'style[data-weave-runtime-class="' + rule.className + '"]',
      ),
    (rule) => {
      const element = ownerDocument.createElement('style')
      element.dataset.weaveRuntimeClass = rule.className
      element.textContent = ':where(.' + rule.className + '){}'
      ownerDocument.head.append(element)

      const cssRule = element.sheet?.cssRules.item(0) as CSSStyleRule | null

      if (cssRule !== null) {
        for (const [name, value] of rule.declarations) {
          cssRule.style.setProperty(cssPropertyName(name), String(value))
        }

        // Serialize through CSSOM so arbitrary public string values can never
        // escape the declaration block and become new CSS rules.
        element.textContent = cssRule.cssText
      }

      return element
    },
    (rule) => rule.signature,
  )
  runtimeRegistries.set(ownerDocument, registry)
  return registry
}

export function useRuntimeStyleClass(
  prefix: string,
  declarations: Readonly<object> | undefined,
): string | undefined {
  const rule = createRuntimeStyleClass(prefix, declarations)
  const ownerDocument = useWeaveDocument()

  useInsertionEffect(() => {
    if (rule === undefined || ownerDocument === null) return

    return registryFor(ownerDocument)(rule)
  }, [ownerDocument, rule?.className, rule?.signature])

  return rule?.className
}
