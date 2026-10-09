import { type CSSProperties, type PointerEvent, useCallback, useRef, useState } from 'react'
import type { InputProps } from '../../core/input-types'
import { ensureInputStylesheet } from '../../renderers/dom/input-stylesheet'
import { useStaticStylesheet } from '../../renderers/dom/static-stylesheet'
import { Button } from '../Button'
import { Column } from '../Column'
import { Popover } from '../Popover'
import { Row } from '../Row'
import { Slider } from '../Slider'
import { View } from '../View'
import { assignRef } from './assign-ref'
import {
  type ColorCodeFormat,
  colorAlpha,
  formatColorCode,
  hsvToHex,
  normalizeHex,
  parseColorCode,
  rgbToHsv,
  withAlpha,
} from './color-code'
import { chevronDownIcon } from './control-icons'
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

const copyIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
)

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
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
  const [format, setFormat] = useState<ColorCodeFormat>('hex')
  const [draft, setDraft] = useState(color)
  const [copied, setCopied] = useState(false)
  const [storedHue, setStoredHue] = useState(() => rgbToHsv(normalizeHex(value ?? defaultValue))[0])
  const inputRef = useRef<HTMLInputElement>(null)
  const [derivedHue, saturation, brightness] = rgbToHsv(color)
  const hue = saturation === 0 || brightness === 0 ? storedHue : derivedHue
  const alpha = colorAlpha(color)
  const baseColor = color.slice(0, 7)

  const updateColor = (next: string, preserveHue = false) => {
    if (!preserveHue) setStoredHue(rgbToHsv(next)[0])
    if (!controlled) setUncontrolledColor(next)
    setDraft(formatColorCode(next, format))
    setCopied(false)
    if (next !== color) onChange?.(next)
  }

  const reset = useCallback(() => {
    if (!controlled) setUncontrolledColor(defaultColor)
    setStoredHue(rgbToHsv(controlled ? normalizeHex(value) : defaultColor)[0])
    setDraft(formatColorCode(controlled ? normalizeHex(value) : defaultColor, format))
    setCopied(false)
    setOpen(false)
  }, [controlled, defaultColor, format, value])
  useFormReset(inputRef, reset)

  const changeOpen = (next: boolean) => {
    if (next && (disabled || readOnly)) return
    if (next) setDraft(formatColorCode(color, format))
    setOpen(next)
  }

  const changeArea = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const nextSaturation = clamp((event.clientX - bounds.left) / bounds.width, 0, 1)
    const nextBrightness = 1 - clamp((event.clientY - bounds.top) / bounds.height, 0, 1)
    updateColor(withAlpha(hsvToHex(hue, nextSaturation, nextBrightness), alpha), true)
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
          updateColor(
            withAlpha(
              hsvToHex(hue, clamp(nextSaturation, 0, 1), clamp(nextBrightness, 0, 1)),
              alpha,
            ),
            true,
          )
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
                  .then((result) => updateColor(withAlpha(normalizeHex(result.sRGBHex), alpha)))
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
          className="weave-color-picker__preview"
          style={
            {
              '--weave-color-picker-preview': color,
              border: '1px solid var(--weave-input-border-color)',
            } as CSSProperties
          }
        />
        <Column gap={8} width="fill" minWidth={0}>
          <View
            className="weave-color-picker__hue"
            width="fill"
            minWidth={0}
            style={{ '--weave-color-picker-hue-thumb': hsvToHex(hue, 1, 1) } as CSSProperties}
          >
            <Slider
              label={messages.hue}
              value={hue}
              min={0}
              max={359}
              onChange={(next) => {
                setStoredHue(next)
                updateColor(withAlpha(hsvToHex(next, saturation, brightness), alpha), true)
              }}
              viewProps={{ label: messages.hue, width: 'fill' }}
            />
          </View>
          <View
            className="weave-color-picker__alpha"
            width="fill"
            minWidth={0}
            style={
              {
                '--weave-color-picker-alpha-start': baseColor + '00',
                '--weave-color-picker-alpha-end': baseColor,
                '--weave-color-picker-alpha-thumb': color,
              } as CSSProperties
            }
          >
            <Slider
              label={messages.alpha}
              value={alpha}
              min={0}
              max={255}
              onChange={(next) => updateColor(withAlpha(baseColor, next), true)}
              viewProps={{ label: messages.alpha, width: 'fill' }}
            />
          </View>
        </Column>
      </Row>
      <Row align="center" gap={8} width="fill">
        <Button
          text={format.toUpperCase()}
          icon={chevronDownIcon}
          iconPosition="end"
          size="small"
          variant="ghost"
          viewProps={{
            label: messages.changeColorFormat,
            onClick: () => {
              const formats: ColorCodeFormat[] = ['hex', 'rgb', 'hsl', 'hsv']
              const selected = formats[(formats.indexOf(format) + 1) % formats.length]
              if (selected === undefined) return
              setFormat(selected)
              setDraft(formatColorCode(color, selected))
              setCopied(false)
            },
          }}
        />
        <View className="weave-color-picker__code" width="fill" minWidth={0}>
          <InputHost
            type="text"
            value={draft}
            clearable={false}
            onChange={(next) => {
              setDraft(next)
              const parsed = parseColorCode(next, format)
              if (parsed !== null) updateColor(parsed)
            }}
            trailingAction={
              <Button
                icon={copyIcon}
                size="small"
                variant="ghost"
                viewProps={{
                  label: copied ? messages.copiedColor : messages.copyColor,
                  onClick: () => {
                    const clipboard =
                      inputRef.current?.ownerDocument.defaultView?.navigator.clipboard
                    if (!clipboard?.writeText) {
                      setCopied(false)
                      return
                    }
                    void Promise.resolve()
                      .then(() => clipboard.writeText(formatColorCode(color, format)))
                      .then(() => setCopied(true))
                      .catch(() => setCopied(false))
                  },
                }}
              />
            }
            viewProps={{ width: 'fill', label: messages.colorCode }}
          />
        </View>
      </Row>
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
      <>
        <InputHost
          {...inputProps}
          name={undefined}
          type="color"
          value={baseColor}
          onChange={(next) => updateColor(withAlpha(normalizeHex(next), alpha))}
          disabled={disabled}
          readOnly={readOnly}
          trailingIcon={chevronDownIcon}
          clearable={false}
          viewProps={{
            ...viewProps,
            className: ['weave-color-input', viewProps.className].filter(Boolean).join(' '),
            style: {
              ...viewProps.style,
              '--weave-color-picker-preview': color,
              backgroundColor: color,
            } as CSSProperties,
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
        <input type="hidden" name={inputProps.name} value={color} disabled={disabled} />
      </>
    </Popover>
  )
}
