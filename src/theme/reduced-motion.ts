import type { ReducedMotionPreference } from '../core/motion-types'
import { useDocumentMediaQuery } from './use-media-query'

export function useResolvedReducedMotion(preference: ReducedMotionPreference): boolean {
  const systemReducedMotion = useDocumentMediaQuery('(prefers-reduced-motion: reduce)')

  if (preference === 'reduce') return true
  if (preference === 'no-preference') return false
  return systemReducedMotion
}
