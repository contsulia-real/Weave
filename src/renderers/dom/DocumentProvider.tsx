import type { ReactNode } from 'react'
import { WeaveDocumentContext } from './document-context'

export function WeaveDocumentProvider({
  ownerDocument,
  children,
}: {
  ownerDocument: Document
  children?: ReactNode
}): import('react').JSX.Element {
  return (
    <WeaveDocumentContext.Provider value={ownerDocument}>{children}</WeaveDocumentContext.Provider>
  )
}
