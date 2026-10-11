import type { ClipboardEvent, KeyboardEvent } from 'react'
import { useCallback, useRef, useState } from 'react'
import type { OTPInputProps } from '../core/otp-input-types'
import { Input } from './Input'
import { useFormReset } from './internal/use-form-reset'
import { Row } from './Row'

const CODE_LENGTH = 6

function digits(value: string): string {
  return value.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH)
}

export function OTPInput({
  label,
  value,
  defaultValue = '',
  onChange,
  name,
  required,
  disabled,
  viewProps = {},
}: OTPInputProps): import('react').JSX.Element {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() => digits(defaultValue))
  const current = digits(value ?? internalValue)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const reset = useCallback(() => {
    if (!controlled) setInternalValue(digits(defaultValue))
  }, [controlled, defaultValue])
  const firstInputRef = useRef<HTMLInputElement | null>(null)
  useFormReset(firstInputRef, reset)

  const request = (next: string) => {
    const normalized = digits(next)
    if (normalized === current) return
    if (!controlled) setInternalValue(normalized)
    onChange?.(normalized)
  }

  const focus = (index: number) => {
    const input = inputs.current[Math.max(0, Math.min(CODE_LENGTH - 1, index))]
    input?.focus()
    input?.select()
  }

  const insert = (index: number, raw: string) => {
    const added = digits(raw)
    if (added.length === 0) return
    const start = Math.min(index, current.length)
    const next = (current.slice(0, start) + added + current.slice(start + added.length)).slice(
      0,
      CODE_LENGTH,
    )
    request(next)
    focus(start + added.length)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      focus(index + (event.key === 'ArrowLeft' ? -1 : 1))
    } else if (event.key === 'Backspace') {
      event.preventDefault()
      const target =
        current[index] === undefined
          ? Math.min(Math.max(0, index - 1), Math.max(0, current.length - 1))
          : index
      request(current.slice(0, target) + current.slice(target + 1))
      focus(target)
    } else if (event.key === 'Delete') {
      event.preventDefault()
      request(current.slice(0, index) + current.slice(index + 1))
    }
  }

  const onPaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault()
    insert(index, event.clipboardData.getData('text'))
  }

  return (
    <Row {...viewProps} role="group" label={viewProps.label ?? label} gap={8}>
      {Array.from({ length: CODE_LENGTH }, (_, index) => (
        <Input
          key={index}
          type="text"
          value={current[index] ?? ''}
          onChange={(next) => insert(index, next)}
          maxLength={1}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          disabled={disabled}
          required={required}
          clearable={false}
          viewProps={{
            width: 44,
            minWidth: 0,
            height: 52,
            inputMode: 'numeric',
            label: `${label} ${index + 1}/${CODE_LENGTH}`,
            style: { textAlign: 'center' },
            ref: (node) => {
              inputs.current[index] = node
              if (index === 0) firstInputRef.current = node
            },
            onKeyDown: (event) => onKeyDown(event, index),
            onPaste: (event) => onPaste(event, index),
            onFocus: (event) => event.currentTarget.select(),
          }}
        />
      ))}
      {name === undefined ? null : (
        <input type="hidden" name={name} value={current} disabled={disabled} />
      )}
    </Row>
  )
}
