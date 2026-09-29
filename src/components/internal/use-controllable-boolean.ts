import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from 'react'

export interface ControllableBooleanState {
  value: boolean
  requestedValueRef:
    MutableRefObject<boolean>
  request(
    next: boolean,
  ): boolean
}

export function useControllableBoolean(
  value: boolean | undefined,
  defaultValue: boolean,
  onChange:
    | ((value: boolean) => void)
    | undefined,
): ControllableBooleanState {
  const controlled =
    value !== undefined
  const [
    uncontrolledValue,
    setUncontrolledValue,
  ] = useState(defaultValue)
  const resolvedValue =
    value ?? uncontrolledValue
  const requestedValueRef =
    useRef(resolvedValue)
  const controlledRef =
    useRef(controlled)
  const onChangeRef =
    useRef(onChange)

  useEffect(() => {
    controlledRef.current =
      controlled
    onChangeRef.current =
      onChange
  }, [
    controlled,
    onChange,
  ])

  useEffect(() => {
    requestedValueRef.current =
      resolvedValue
  }, [resolvedValue])

  const request =
    useCallback(
      (next: boolean) => {
        if (
          requestedValueRef.current ===
          next
        ) {
          return false
        }

        requestedValueRef.current =
          next

        if (!controlledRef.current) {
          setUncontrolledValue(next)
        }

        onChangeRef.current?.(next)
        return true
      },
      [],
    )

  return {
    value: resolvedValue,
    requestedValueRef,
    request,
  }
}
