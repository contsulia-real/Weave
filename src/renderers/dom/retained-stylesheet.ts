interface RetainedStylesheetEntry {
  count: number
  element: HTMLStyleElement
  identity: string | undefined
}

export function createRetainedStylesheetRegistry<TRule>(
  key: (rule: TRule) => string,
  findExisting: (rule: TRule) => HTMLStyleElement | null,
  createElement: (rule: TRule) => HTMLStyleElement,
  identity?: (rule: TRule) => string,
): (rule: TRule) => () => void {
  const entries = new Map<string, RetainedStylesheetEntry>()

  const release = (ruleKey: string) => {
    const current = entries.get(ruleKey)
    if (current === undefined) return

    current.count -= 1

    if (current.count <= 0) {
      current.element.remove()
      entries.delete(ruleKey)
    }
  }

  return (rule) => {
    const ruleKey = key(rule)
    const ruleIdentity = identity?.(rule)
    const current = entries.get(ruleKey)

    if (current !== undefined) {
      if (current.identity !== ruleIdentity) {
        throw new Error(`Weave retained stylesheet key collision: ${ruleKey}`)
      }

      current.count += 1
      return () => release(ruleKey)
    }

    const element = findExisting(rule) ?? createElement(rule)

    entries.set(ruleKey, {
      count: 1,
      element,
      identity: ruleIdentity,
    })

    return () => release(ruleKey)
  }
}
