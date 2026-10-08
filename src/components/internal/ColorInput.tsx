import { type PointerEvent, useCallback, useRef, useState } from 'react'
import type { InputProps } from '../../core/input-types'
import { ensureInputStylesheet } from '../../renderers/dom/input-stylesheet'
import { useStaticStylesheet } from '../../renderers/dom/static-stylesheet'
import { Button } from '../Button'
import { Column } from '../Column'
import { Popover } from '../Popover'
import { Row } from '../Row'
import { Slider } from '../Slider'
import { Text } from '../Text'
import { View } from '../View'
import { assignRef } from './assign-ref'
import { useDateLocalization } from './date-localization'
import { useFormReset } from './use-form-reset'

type SingleLineProps = Extract<InputProps, { multiline?: false }>
type ColorInputProps = SingleLineProps & {
  InputHost: (props: SingleLineProps) => import('react').JSX.Element
}
type EyeDropperConstructor = new () => {
  open(): Promise<{ sRGBHex: string }>
}

const eyedropperIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 5 4 4M6 18l-2 2 2-6 9-9 4 4-9 9-4 2Z" />
    <path d="m13 7 4 4M17 3l4 4" />
  </svg>
)

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function normalizeHex(value: string | number | undefined): string {
  const text = String(value ?? '#000000')
    .trim()
    .toLowerCase()
  if (/^#[\da-f]{6}$/.test(text)) return text
  if (/^#[\da-f]{3}$/.test(text)) {
    return '#' + [...text.slice(1)].map((digit) => digit + digit).join('')
  }
  return '#000000'
}

function rgbToHsv(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let hue = 0
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
  }
  return [Math.round((hue * 60 + 360) % 360), max === 0 ? 0 : delta / max, max]
}

function hsvToHex(hue: number, saturation: number, value: number): string {
  const chroma = value * saturation
  const segment = (((hue % 360) + 360) % 360) / 60
  const x = chroma * (1 - Math.abs((segment % 2) - 1))
  let rgb: number[]
  if (segment < 1) rgb = [chroma, x, 0]
  else if (segment < 2) rgb = [x, chroma, 0]
  else if (segment < 3) rgb = [0, chroma, x]
  else if (segment < 4) rgb = [0, x, chroma]
  else if (segment < 5) rgb = [x, 0, chroma]
  else rgb = [chroma, 0, x]
  const offset = value - chroma
  return (
    '#' +
    rgb
      .map((part) =>
        Math.round((part + offset) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

export function ColorInput({
  InputHost,
  value,
  defaultValue,
  onChange,
  disabled = false,
  readOnly = false,
  locale,
  viewProps = {},
  ...inputProps
}: ColorInputProps): import('react').JSX.Element {
  useStaticStylesheet(ensureInputStylesheet)
  const { locale: resolvedLocale, messages } = useDateLocalization(locale)
  const controlled = value !== undefined
  const defaultColor = normalizeHex(defaultValue)
  const [uncontrolledColor, setUncontrolledColor] = useState(defaultColor)
  const color = controlled ? normalizeHex(value) : uncontrolledColor
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(color)
  const [storedHue, setStoredHue] = useState(() => rgbToHsv(normalizeHex(value ?? defaultValue))[0])
  const inputRef = useRef<HTMLInputElement>(null)
  const [derivedHue, saturation, brightness] = rgbToHsv(color)
  const hue = saturation === 0 || brightness === 0 ? storedHue : derivedHue

  const updateColor = (next: string, preserveHue = false) => {
    if (!preserveHue) setStoredHue(rgbToHsv(next)[0])
    if (!controlled) setUncontrolledColor(next)
    setDraft(next)
    if (next !== color) onChange?.(next)
  }

  const reset = useCallback(() => {
    if (!controlled) setUncontrolledColor(defaultColor)
    setStoredHue(rgbToHsv(controlled ? normalizeHex(value) : defaultColor)[0])
    setDraft(controlled ? normalizeHex(value) : defaultColor)
    setOpen(false)
  }, [controlled, defaultColor, value])
  useFormReset(inputRef, reset)

  const changeOpen = (next: boolean) => {
    if (next && (disabled || readOnly)) return
    if (next) setDraft(color)
    setOpen(next)
  }

  const changeArea = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const nextSaturation = clamp((event.clientX - bounds.left) / bounds.width, 0, 1)
    const nextBrightness = 1 - clamp((event.clientY - bounds.top) / bounds.height, 0, 1)
    updateColor(hsvToHex(hue, nextSaturation, nextBrightness), true)
  }

  const EyeDropper = (globalThis as typeof globalThis & { EyeDropper?: EyeDropperConstructor })
    .EyeDropper
  const content = (
    <Column gap={12} width={320} maxWidth="calc(100vw - 32px)">
      <View
        className="weave-color-picker__area"
        role="group"
        label={messages.colorArea}
        tabIndex={0}
        width="fill"
        height={200}
        position="relative"
        style={{
          backgroundColor: `hsl(${hue} 100% 50%)`,
          backgroundImage:
            'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
          touchAction: 'none',
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.preventDefault()
          event.currentTarget.focus()
          event.currentTarget.setPointerCapture(event.pointerId)
          changeArea(event)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) changeArea(event)
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            changeArea(event)
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        }}
        onPointerCancel={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        }}
        onKeyDown={(event) => {
          const nextSaturation =
            event.key === 'ArrowLeft'
              ? saturation - 0.01
              : event.key === 'ArrowRight'
                ? saturation + 0.01
                : saturation
          const nextBrightness =
            event.key === 'ArrowUp'
              ? brightness + 0.01
              : event.key === 'ArrowDown'
                ? brightness - 0.01
                : brightness
          if (nextSaturation === saturation && nextBrightness === brightness) return
          event.preventDefault()
          updateColor(hsvToHex(hue, clamp(nextSaturation, 0, 1), clamp(nextBrightness, 0, 1)), true)
        }}
      >
        <View
          position="absolute"
          className="weave-color-picker__cursor"
          style={{
            left: `${saturation * 100}%`,
            top: `${(1 - brightness) * 100}%`,
          }}
        />
      </View>
      <Row align="center" gap={12} width="fill">
        {typeof EyeDropper === 'function' ? (
          <Button
            icon={eyedropperIcon}
            size="small"
            variant="ghost"
            viewProps={{
              label: messages.eyedropper,
              onClick: () => {
                void new EyeDropper()
                  .open()
                  .then((result) => updateColor(normalizeHex(result.sRGBHex)))
                  .catch(() => {})
              },
            }}
          />
        ) : null}
        <View
          width={36}
          height={36}
          minWidth={36}
          radius="full"
          style={{ backgroundColor: color, border: '1px solid var(--weave-input-border-color)' }}
        />
        <View className="weave-color-picker__hue" width="fill" minWidth={0}>
          <Slider
            label={messages.hue}
            value={hue}
            min={0}
            max={359}
            onChange={(next) => {
              setStoredHue(next)
              updateColor(hsvToHex(next, saturation, brightness), true)
            }}
            viewProps={{ label: messages.hue, width: 'fill' }}
          />
        </View>
      </Row>
      <Column gap={4} width="fill">
        <InputHost
          type="text"
          value={draft}
          clearable={false}
          onChange={(next) => {
            setDraft(next)
            if (/^#[\da-f]{6}$/i.test(next)) updateColor(next.toLowerCase())
          }}
          viewProps={{ width: 'fill', label: messages.hexColor }}
        />
        <Text typo="label-small" color="secondary" viewProps={{ style: { textAlign: 'center' } }}>
          {messages.hexColor}
        </Text>
      </Column>
    </Column>
  )

  return (
    <Popover
      open={open && !disabled && !readOnly}
      onOpenChange={changeOpen}
      placement="bottom-left"
      viewProps={{ label: messages.chooseColor, lang: resolvedLocale }}
      content={content}
    >
      <InputHost
        {...inputProps}
        type="color"
        value={color}
        onChange={updateColor}
        disabled={disabled}
        readOnly={readOnly}
        clearable={false}
        viewProps={{
          ...viewProps,
          className: ['weave-color-input', viewProps.className].filter(Boolean).join(' '),
          label: viewProps.label ?? messages.chooseColor,
          lang: resolvedLocale,
          onPointerDown: (event) => {
            viewProps.onPointerDown?.(event)
            event.preventDefault()
          },
          onClick: (event) => {
            viewProps.onClick?.(event)
            if (event.defaultPrevented) return
            event.preventDefault()
            changeOpen(!open)
          },
          onKeyDown: (event) => {
            viewProps.onKeyDown?.(event)
            if (event.defaultPrevented) return
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              changeOpen(!open)
            }
          },
          ref: (node) => {
            inputRef.current = node
            assignRef(viewProps.ref, node)
          },
        }}
      />
    </Popover>
  )
}
