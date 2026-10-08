import { createContext, useContext } from 'react'

export const WeaveDocumentContext = createContext<Document | null>(null)

export function useWeaveDocument(): Document | null {
  const ownerDocument = useContext(WeaveDocumentContext)
  if (ownerDocument !== null) return ownerDocument
  return typeof document === 'undefined' ? null : document
}

export function useWeaveWindow(): Window | null {
  return useWeaveDocument()?.defaultView ?? null
}
