import { useCallback, useEffect, useSyncExternalStore } from 'react'

function currentPath(): string {
  if (typeof window === 'undefined') return '/docs'
  return window.location.pathname
}

function subscribe(notify: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener('popstate', notify)
  return () => window.removeEventListener('popstate', notify)
}

function emitRouteChange(): void {
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function docsPath(path: string): string {
  return path === '/docs' || path.startsWith('/docs/') ? path : '/docs'
}

export function useDocsRoute() {
  const pathname = useSyncExternalStore(subscribe, currentPath, () => '/docs')

  useEffect(() => {
    const normalized = docsPath(pathname)
    if (normalized === pathname) return

    window.history.replaceState(null, '', normalized)
    emitRouteChange()
  }, [pathname])

  const navigate = useCallback((path: string, replace = false) => {
    const next = docsPath(path)
    if (replace) window.history.replaceState(null, '', next)
    else window.history.pushState(null, '', next)
    emitRouteChange()
  }, [])

  const normalized = docsPath(pathname)
  const segments = normalized.slice('/docs'.length).split('/').filter(Boolean)

  return {
    pathname: normalized,
    section: segments[0] ?? 'overview',
    segments,
    navigate,
  }
}
