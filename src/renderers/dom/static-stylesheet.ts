import { useInsertionEffect } from 'react'
import { useWeaveDocument } from './document-context'

let activeDocument: Document | null = null

export function useStaticStylesheet(ensure: () => void, enabled = true): void {
  const ownerDocument = useWeaveDocument()

  useInsertionEffect(() => {
    if (!enabled || ownerDocument === null) return

    const previousDocument = activeDocument
    activeDocument = ownerDocument
    try {
      ensure()
    } finally {
      activeDocument = previousDocument
    }
  }, [enabled, ensure, ownerDocument])
}

export function ensureStaticStylesheet(name: string, stylesheet: string): void {
  const ownerDocument = activeDocument ?? (typeof document === 'undefined' ? null : document)
  if (ownerDocument === null) return

  const attribute = `data-weave-${name}-styles`
  const existing = ownerDocument.querySelector<HTMLStyleElement>(`style[${attribute}]`)

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = ownerDocument.createElement('style')
  element.setAttribute(attribute, '')
  element.textContent = stylesheet
  ownerDocument.head.append(element)
}
