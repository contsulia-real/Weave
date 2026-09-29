import { useCallback, useLayoutEffect, useRef, useState } from 'react'

interface ControllableBooleanState {
  value: boolean
  request(next: boolean): boolean
}

export function useControllableBoolean(
  value: boolean | undefined,
  defaultValue: boolean,
  onChange: ((value: boolean) => void) | undefined,
): ControllableBooleanState {
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const resolvedValue = value ?? uncontrolledValue
  const resolvedValueRef = useRef(resolvedValue)
  const controlledRef = useRef(controlled)
  const onChangeRef = useRef(onChange)

  useLayoutEffect(() => {
    resolvedValueRef.current = resolvedValue
    controlledRef.current = controlled
    onChangeRef.current = onChange
  }, [controlled, onChange, resolvedValue])

  const request = useCallback((next: boolean) => {
    if (resolvedValueRef.current === next) {
      return false
    }

    if (!controlledRef.current) {
      resolvedValueRef.current = next
      setUncontrolledValue(next)
    }

    onChangeRef.current?.(next)
    return true
  }, [])

  return {
    value: resolvedValue,
    request,
  }
}
