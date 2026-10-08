import { useCallback, useRef, useState } from 'react'
import type { InputProps } from '../../core/input-types'
import { Button } from '../Button'
import { Column } from '../Column'
import { FormField } from '../FormField'
import { Grid } from '../Grid'
import { Popover } from '../Popover'
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

const swatches = [
  '#e76b94',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#ffffff',
  '#94a3b8',
  '#64748b',
  '#334155',
  '#000000',
  '#78350f',
  '#f5e6c8',
]

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

function rgbToHsl(hex: string): [number, number, number] {
  const rgb = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
  const [r, g, b] = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const lightness = (max + min) / 2
  if (delta === 0) return [0, 0, Math.round(lightness * 100)]
  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0
  if (max === r) hue = ((g - b) / delta) % 6
  else if (max === g) hue = (b - r) / delta + 2
  else hue = (r - g) / delta + 4
  return [
    Math.round((hue * 60 + 360) % 360),
    Math.round(saturation * 100),
    Math.round(lightness * 100),
  ]
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const s = saturation / 100
  const l = lightness / 100
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const segment = (((hue % 360) + 360) % 360) / 60
  const x = chroma * (1 - Math.abs((segment % 2) - 1))
  let channels: number[]
  if (segment < 1) channels = [chroma, x, 0]
  else if (segment < 2) channels = [x, chroma, 0]
  else if (segment < 3) channels = [0, chroma, x]
  else if (segment < 4) channels = [0, x, chroma]
  else if (segment < 5) channels = [x, 0, chroma]
  else channels = [chroma, 0, x]
  const offset = l - chroma / 2
  return (
    '#' +
    channels
      .map((c) =>
        Math.round((c + offset) * 255)
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
  const { locale: resolvedLocale, messages } = useDateLocalization(locale)
  const controlled = value !== undefined
  const defaultColor = normalizeHex(defaultValue)
  const [uncontrolledColor, setUncontrolledColor] = useState(defaultColor)
  const color = controlled ? normalizeHex(value) : uncontrolledColor
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(color)
  const inputRef = useRef<HTMLInputElement>(null)
  const [hue, saturation, lightness] = rgbToHsl(color)

  const updateColor = (next: string) => {
    if (!controlled) setUncontrolledColor(next)
    setDraft(next)
    if (next !== color) onChange?.(next)
  }

  const reset = useCallback(() => {
    if (!controlled) setUncontrolledColor(defaultColor)
    setDraft(controlled ? normalizeHex(value) : defaultColor)
    setOpen(false)
  }, [controlled, defaultColor, value])

  useFormReset(inputRef, reset)

  const changeOpen = (next: boolean) => {
    if (next && (disabled || readOnly)) return
    if (next) setDraft(color)
    setOpen(next)
  }

  const content = (
    <Column gap={12} width={304}>
      <Grid columns={6} gap={8}>
        {swatches.map((swatch) => (
          <Button
            key={swatch}
            variant={swatch === color ? 'secondary' : 'ghost'}
            size="small"
            viewProps={{
              minWidth: 0,
              width: 'fill',
              label: `${messages.chooseColor}: ${swatch}`,
              onClick: () => updateColor(swatch),
            }}
          >
            <View
              width={24}
              height={24}
              style={{
                backgroundColor: swatch,
                borderRadius: '50%',
                border: '1px solid currentColor',
              }}
            />
          </Button>
        ))}
      </Grid>
      <Slider
        label={messages.hue}
        value={hue}
        min={0}
        max={359}
        step={1}
        onChange={(next) => updateColor(hslToHex(next, saturation, lightness))}
      />
      <Slider
        label={messages.saturation}
        value={saturation}
        min={0}
        max={100}
        step={1}
        onChange={(next) => updateColor(hslToHex(hue, next, lightness))}
      />
      <Slider
        label={messages.lightness}
        value={lightness}
        min={0}
        max={100}
        step={1}
        onChange={(next) => updateColor(hslToHex(hue, saturation, next))}
      />
      <FormField label={messages.hexColor}>
        <InputHost
          type="text"
          value={draft}
          clearable={false}
          onChange={(next) => {
            setDraft(next)
            if (/^#[\da-f]{6}$/i.test(next)) updateColor(next.toLowerCase())
          }}
          viewProps={{ width: 'fill' }}
        />
      </FormField>
      <Text typo="body-small" color="secondary">
        {color}
      </Text>
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
