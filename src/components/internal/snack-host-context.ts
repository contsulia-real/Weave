import { createContext } from 'react'
import type { SnackContainer } from '../../core/snack-types'

interface SnackHostContextValue {
  target: SnackContainer | undefined
  scopeId: string
}

export const SnackHostContext = createContext<SnackHostContextValue | undefined>(undefined)

export function resolveSnackHost(
  target: SnackContainer | undefined,
  document: Document,
): HTMLElement | null {
  if (target === undefined) {
    return document.body
  }

  if (target === null) {
    return null
  }

  if (typeof target === 'function') {
    return target()
  }

  if ('current' in target) {
    return target.current
  }

  return target
}
