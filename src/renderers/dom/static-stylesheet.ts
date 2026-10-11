import { useInsertionEffect } from 'react'
import { useWeaveDocument } from './document-context'

let activeDocument: Document | null = null

interface InstalledStylesheet {
  element: HTMLStyleElement
  stylesheet: string
  sheet: CSSStyleSheet | null
}

const installedStylesheets = new WeakMap<Document, Map<string, InstalledStylesheet>>()

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

  let documentStyles = installedStylesheets.get(ownerDocument)
  const cached = documentStyles?.get(name)

  // The CSSOM stylesheet identity changes when <style> text is replaced.
  // Avoid repeatedly reading and comparing large static CSS text on every
  // component mount, but revalidate removed or externally replaced styles.
  if (
    cached !== undefined &&
    cached.stylesheet === stylesheet &&
    cached.element.isConnected &&
    cached.sheet !== null &&
    cached.element.sheet === cached.sheet
  ) {
    // A hot-replaced stylesheet may have identical text in a different string.
    // Rebind once so the next component does not compare the full CSS again.
    cached.stylesheet = stylesheet
    return
  }

  const attribute = `data-weave-${name}-styles`
  let element = ownerDocument.querySelector<HTMLStyleElement>(`style[${attribute}]`)

  if (element !== null) {
    if (element.textContent !== stylesheet) {
      element.textContent = stylesheet
    }
  } else {
    element = ownerDocument.createElement('style')
    element.setAttribute(attribute, '')
    element.textContent = stylesheet
    ownerDocument.head.append(element)
  }

  if (documentStyles === undefined) {
    documentStyles = new Map()
    installedStylesheets.set(ownerDocument, documentStyles)
  }
  documentStyles.set(name, { element, stylesheet, sheet: element.sheet })
}
