import { type RefObject, useEffect } from 'react'

export function useFormReset(controlRef: RefObject<HTMLElement | null>, onReset: () => void): void {
  useEffect(() => {
    const form = controlRef.current?.closest('form')
    if (form === null || form === undefined) return

    const handleReset = (event: Event) => {
      queueMicrotask(() => {
        if (!event.defaultPrevented) {
          onReset()
        }
      })
    }

    form.addEventListener('reset', handleReset)
    return () => form.removeEventListener('reset', handleReset)
  }, [controlRef, onReset])
}
