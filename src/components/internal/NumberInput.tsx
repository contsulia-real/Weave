import { IconSelector } from '@tabler/icons-react'
import { type KeyboardEvent, type PointerEvent, useEffect, useRef } from 'react'
import type { InputProps } from '../../core/input-types'
import { Icon } from '../Icon'
import { assignRef } from './assign-ref'

type SingleLineProps = Extract<InputProps, { multiline?: false }>
type NumberInputProps = SingleLineProps & {
  InputHost: (props: SingleLineProps) => import('react').JSX.Element
}

const PIXELS_PER_STEP = 8

export function NumberInput({
  InputHost,
  disabled,
  readOnly,
  min,
  max,
  step,
  viewProps = {},
  ...inputProps
}: NumberInputProps): import('react').JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const scrubRef = useRef<HTMLSpanElement>(null)
  const dragRef = useRef<{ pointerId: number; lastX: number; remaining: number } | null>(null)

  const increment = (steps: number) => {
    const input = inputRef.current
    if (input === null || disabled || readOnly || steps === 0) return

    const low = min === undefined || min === '' ? -Infinity : Number(min)
    const high = max === undefined || max === '' ? Infinity : Number(max)
    const size = typeof step === 'number' && step > 0 && Number.isFinite(step) ? step : 1
    const original = input.value.trim() === '' ? Number.NaN : Number(input.value)
    const base = Number.isFinite(original) ? original : Number.isFinite(low) ? low : 0
    const raw = base + steps * size
    const next = Math.min(high, Math.max(low, Number(raw.toPrecision(14))))
    if (!Number.isFinite(next) || (Number.isFinite(original) && original === next)) return

    const view = input.ownerDocument.defaultView
    const setter =
      view && Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, String(next))
    input.dispatchEvent(new (view?.Event ?? Event)('input', { bubbles: true }))
  }

  const endDrag = () => {
    dragRef.current = null
    const icon = scrubRef.current
    const doc = icon?.ownerDocument
    if (doc?.pointerLockElement === icon) doc.exitPointerLock()
  }

  useEffect(() => {
    const icon = scrubRef.current
    const doc = icon?.ownerDocument
    if (!doc) return
    const onPointerUp = () => endDrag()
    const onLockChange = () => {
      if (doc.pointerLockElement === null) dragRef.current = null
    }
    doc.addEventListener('pointerup', onPointerUp)
    doc.addEventListener('pointercancel', onPointerUp)
    doc.addEventListener('pointerlockchange', onLockChange)
    return () => {
      doc.removeEventListener('pointerup', onPointerUp)
      doc.removeEventListener('pointercancel', onPointerUp)
      doc.removeEventListener('pointerlockchange', onLockChange)
      if (doc.pointerLockElement === icon) doc.exitPointerLock()
    }
  }, [])

  const startDrag = (event: PointerEvent<HTMLSpanElement>) => {
    if (disabled || readOnly || event.button !== 0) return
    event.preventDefault()
    const icon = event.currentTarget
    icon.focus()
    dragRef.current = { pointerId: event.pointerId, lastX: event.clientX, remaining: 0 }
    icon.setPointerCapture?.(event.pointerId)
    void Promise.resolve(icon.requestPointerLock?.()).catch(() => {})
  }

  const moveDrag = (event: PointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return
    const locked = event.currentTarget.ownerDocument.pointerLockElement === event.currentTarget
    const movement = locked ? event.movementX : event.clientX - drag.lastX
    drag.lastX = event.clientX
    drag.remaining += movement
    const steps = Math.trunc(drag.remaining / PIXELS_PER_STEP)
    if (steps !== 0) {
      drag.remaining -= steps * PIXELS_PER_STEP
      increment(steps)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Escape' && dragRef.current !== null) {
      event.preventDefault()
      endDrag()
      return
    }
    if (disabled || readOnly) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      increment(event.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return (
    <InputHost
      {...inputProps}
      type="number"
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      clearable={false}
      trailingAction={
        <Icon
          icon={IconSelector}
          size="small"
          viewProps={{
            ref: scrubRef,
            className: 'weave-number-input__scrub',
            label: 'Drag horizontally to adjust number',
            role: 'button',
            tabIndex: disabled || readOnly ? -1 : 0,
            onPointerDown: startDrag,
            onPointerMove: moveDrag,
            onPointerCancel: endDrag,
            onKeyDown: handleKeyDown,
          }}
        />
      }
      viewProps={{
        ...viewProps,
        className: ['weave-number-input', viewProps.className].filter(Boolean).join(' '),
        ref: (node) => {
          inputRef.current = node
          assignRef(viewProps.ref, node)
        },
      }}
    />
  )
}
