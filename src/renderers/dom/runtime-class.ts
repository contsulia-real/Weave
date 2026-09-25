import { useInsertionEffect } from 'react'

export type RuntimeStyleValue =
  | string
  | number
  | null
  | undefined

export type RuntimeStyleDeclarations = Readonly<
  Record<string, RuntimeStyleValue>
>

type RuntimeEntry = readonly [string, string | number]

interface RuntimeClassRule {
  className: string
  signature: string
  declarations: readonly RuntimeEntry[]
}

interface RuntimeClassEntry {
  count: number
  element: HTMLStyleElement
}

const runtimeClasses = new Map<string, RuntimeClassEntry>()

function entries(
  declarations: Readonly<object> | undefined,
): readonly RuntimeEntry[] {
  if (declarations === undefined) return []

  return Object.entries(declarations)
    .filter(
      (entry): entry is [string, string | number] =>
        entry[1] !== undefined && entry[1] !== null,
    )
    .sort(([left], [right]) => left.localeCompare(right))
}

export function hashRuntimeValue(value: string): string {
  let output = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    output ^= value.charCodeAt(index)
    output = Math.imul(output, 16777619)
  }

  return (output >>> 0).toString(36)
}

export function createRuntimeStyleClass(
  prefix: string,
  declarations: Readonly<object> | undefined,
): RuntimeClassRule | undefined {
  const normalized = entries(declarations)
  if (normalized.length === 0) return undefined

  const signature = JSON.stringify(normalized)
  const className =
    'weave-' + prefix + '-' + hashRuntimeValue(signature)

  return {
    className,
    signature,
    declarations: normalized,
  }
}

function createStyleElement(rule: RuntimeClassRule): HTMLStyleElement {
  const element = document.createElement('style')
  element.dataset.weaveRuntimeClass = rule.className
  element.textContent = ':where(.' + rule.className + '){}'
  document.head.append(element)

  const cssRule = element.sheet?.cssRules.item(0) as CSSStyleRule | null

  if (cssRule !== null) {
    for (const [name, value] of rule.declarations) {
      cssRule.style.setProperty(name, String(value))
    }

    // Serialize through CSSOM so arbitrary public string values can never
    // escape the declaration block and become new CSS rules.
    element.textContent = cssRule.cssText
  }

  return element
}

function retainRuntimeClass(rule: RuntimeClassRule): () => void {
  const current = runtimeClasses.get(rule.className)

  if (current !== undefined) {
    current.count += 1
    return () => releaseRuntimeClass(rule.className)
  }

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-runtime-class="' + rule.className + '"]',
  )
  const element = existing ?? createStyleElement(rule)

  runtimeClasses.set(rule.className, {
    count: 1,
    element,
  })

  return () => releaseRuntimeClass(rule.className)
}

function releaseRuntimeClass(className: string): void {
  const current = runtimeClasses.get(className)
  if (current === undefined) return

  current.count -= 1

  if (current.count <= 0) {
    current.element.remove()
    runtimeClasses.delete(className)
  }
}

export function useRuntimeStyleClass(
  prefix: string,
  declarations: Readonly<object> | undefined,
): string | undefined {
  const rule = createRuntimeStyleClass(prefix, declarations)

  useInsertionEffect(() => {
    if (rule === undefined || typeof document === 'undefined') return

    return retainRuntimeClass(rule)
  }, [rule?.className, rule?.signature])

  return rule?.className
}
