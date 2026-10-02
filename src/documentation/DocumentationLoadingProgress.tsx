import { useSyncExternalStore } from 'react'
import { Progress } from '../index'

function subscribeToDocumentLoad(notify: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined

  window.addEventListener('load', notify)
  return () => window.removeEventListener('load', notify)
}

function documentIsLoading(): boolean {
  if (typeof document === 'undefined') return true
  return document.readyState !== 'complete'
}

export function DocumentationLoadingProgress() {
  const loading = useSyncExternalStore(subscribeToDocumentLoad, documentIsLoading, () => true)

  if (!loading) return null

  return <Progress mode="linear" indeterminate size="small" viewProps={{ width: 'fill' }} />
}
