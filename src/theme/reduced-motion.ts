import { useSyncExternalStore } from 'react'
import type { ReducedMotionPreference } from '../core/motion-types'

const listeners = new Set<() => void>()
let media: MediaQueryList | undefined
let listening = false

function getMedia(): MediaQueryList | undefined {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return undefined
  }

  media ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return media
}

function notify(): void {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  const target = getMedia()
  if (target !== undefined && !listening) {
    target.addEventListener('change', notify)
    listening = true
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && media !== undefined && listening) {
      media.removeEventListener('change', notify)
      listening = false
    }
  }
}

function systemSnapshot(): boolean {
  return getMedia()?.matches ?? false
}

export function useResolvedReducedMotion(preference: ReducedMotionPreference): boolean {
  const systemReducedMotion = useSyncExternalStore(subscribe, systemSnapshot, () => false)

  if (preference === 'reduce') return true
  if (preference === 'no-preference') return false
  return systemReducedMotion
}
