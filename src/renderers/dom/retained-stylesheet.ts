interface RetainedStylesheetEntry {
  count: number
  element: HTMLStyleElement
}

export function createRetainedStylesheetRegistry<TRule>(
  key: (rule: TRule) => string,
  findExisting: (rule: TRule) => HTMLStyleElement | null,
  createElement: (rule: TRule) => HTMLStyleElement,
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
    const current = entries.get(ruleKey)

    if (current !== undefined) {
      current.count += 1
      return () => release(ruleKey)
    }

    const element = findExisting(rule) ?? createElement(rule)

    entries.set(ruleKey, {
      count: 1,
      element,
    })

    return () => release(ruleKey)
  }
}
