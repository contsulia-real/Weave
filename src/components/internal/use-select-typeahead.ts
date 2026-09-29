import { useCallback, useEffect, useRef } from 'react'
import type { SelectOptionDescriptor, SelectValue } from '../../core/select-types'
import { findSelectTypeaheadMatch } from './select-navigation'

const TYPEAHEAD_RESET_MS = 500

export function useSelectTypeahead(
  options: readonly SelectOptionDescriptor[],
  current: SelectValue | null,
  onMatch: (value: SelectValue) => void,
) {
  const bufferRef = useRef('')
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (timerRef.current !== undefined) {
        globalThis.clearTimeout(timerRef.current)
      }
    },
    [],
  )

  return useCallback(
    (character: string) => {
      if (timerRef.current !== undefined) {
        globalThis.clearTimeout(timerRef.current)
      }

      const nextBuffer = bufferRef.current + character
      let match = findSelectTypeaheadMatch(options, nextBuffer, current)

      if (match === null && nextBuffer.length > 1) {
        match = findSelectTypeaheadMatch(options, character, current)
        bufferRef.current = character
      } else {
        bufferRef.current = nextBuffer
      }

      if (match !== null) {
        onMatch(match)
      }

      timerRef.current = globalThis.setTimeout(() => {
        bufferRef.current = ''
        timerRef.current = undefined
      }, TYPEAHEAD_RESET_MS)
    },
    [current, onMatch, options],
  )
}
