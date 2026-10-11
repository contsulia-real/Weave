import type { ClipboardEvent, KeyboardEvent } from 'react'
import { useCallback, useRef, useState } from 'react'
import type { OTPInputProps } from '../core/otp-input-types'
import { Input } from './Input'
import { useFormReset } from './internal/use-form-reset'
import { Row } from './Row'

function normalizeCode(
  value: string,
  mode: NonNullable<OTPInputProps['mode']>,
  length: number,
): string {
  const filtered = value
    .replace(mode === 'numeric' ? /[^0-9]/g : /[^a-z0-9]/gi, '')
    .slice(0, length)
  return mode === 'uppercase' ? filtered.toUpperCase() : filtered
}

export function OTPInput({
  label,
  mode = 'numeric',
  length = 6,
  value,
  defaultValue = '',
  onChange,
  name,
  required,
  disabled,
  viewProps = {},
}: OTPInputProps): import('react').JSX.Element {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() => normalizeCode(defaultValue, mode, length))
  const current = normalizeCode(value ?? internalValue, mode, length)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const reset = useCallback(() => {
    if (!controlled) setInternalValue(normalizeCode(defaultValue, mode, length))
  }, [controlled, defaultValue, length, mode])
  const firstInputRef = useRef<HTMLInputElement | null>(null)
  useFormReset(firstInputRef, reset)

  const request = (next: string) => {
    const normalized = normalizeCode(next, mode, length)
    if (normalized === current) return
    if (!controlled) setInternalValue(normalized)
    onChange?.(normalized)
  }

  const focus = (index: number) => {
    const input = inputs.current[Math.max(0, Math.min(length - 1, index))]
    input?.focus()
    input?.select()
  }

  const insert = (index: number, raw: string) => {
    const added = normalizeCode(raw, mode, length)
    if (added.length === 0) return
    const start = Math.min(index, current.length)
    const next = (current.slice(0, start) + added + current.slice(start + added.length)).slice(
      0,
      length,
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
      {Array.from({ length }, (_, index) => (
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
            inputMode: mode === 'numeric' ? 'numeric' : 'text',
            label: `${label} ${index + 1}/${length}`,
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
