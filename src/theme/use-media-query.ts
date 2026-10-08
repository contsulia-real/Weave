import { useMemo, useSyncExternalStore } from 'react'
import { useWeaveWindow } from '../renderers/dom/document-context'

interface MediaQueryStore {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => boolean
}

const stores = new WeakMap<Window, Map<string, MediaQueryStore>>()
const emptySubscribe = () => () => undefined
const falseSnapshot = () => false

function storeFor(view: Window, query: string): MediaQueryStore | null {
  if (typeof view.matchMedia !== 'function') return null

  let windowStores = stores.get(view)
  if (windowStores === undefined) {
    windowStores = new Map()
    stores.set(view, windowStores)
  }

  const existing = windowStores.get(query)
  if (existing !== undefined) return existing

  const media = view.matchMedia(query)
  const listeners = new Set<() => void>()
  const notify = () => {
    for (const listener of listeners) listener()
  }

  const store: MediaQueryStore = {
    subscribe(listener) {
      listeners.add(listener)
      if (listeners.size === 1) media.addEventListener('change', notify)

      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) media.removeEventListener('change', notify)
      }
    },
    getSnapshot: () => media.matches,
  }
  windowStores.set(query, store)
  return store
}

export function useDocumentMediaQuery(query: string | null, serverSnapshot = false): boolean {
  const view = useWeaveWindow()
  const store = useMemo(
    () => (view === null || query === null ? null : storeFor(view, query)),
    [query, view],
  )

  return useSyncExternalStore(
    store?.subscribe ?? emptySubscribe,
    store?.getSnapshot ?? falseSnapshot,
    () => serverSnapshot,
  )
}
