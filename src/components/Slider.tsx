import type { ChangeEvent, CSSProperties } from 'react'
import { useId, useInsertionEffect, useMemo, useState } from 'react'
import type { SliderProps } from '../core/slider-types'
import type { ViewProps } from '../core/view-types'
import { resolveSliderTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSliderStylesheet } from '../renderers/dom/slider-stylesheet'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

function clampSliderValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function sliderProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0
  return ((value - min) / (max - min)) * 100
}

export function Slider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  size = 'medium',
  viewProps = {},
}: SliderProps) {
  useInsertionEffect(ensureSliderStylesheet, [])

  const { theme } = useTheme()
  const themeDeclarations = useMemo(() => resolveSliderTheme(theme, size), [size, theme])
  const themeClassName = useRuntimeStyleClass('slider-theme', themeDeclarations)

  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    clampSliderValue(defaultValue ?? min, min, max),
  )
  const currentValue = clampSliderValue(value ?? uncontrolledValue, min, max)

  const generatedId = useId()
  const sliderId = viewProps.id ?? `weave-slider-${generatedId}`
  const labelId = `${sliderId}-label`
  const labelledBy =
    label === undefined
      ? viewProps.labelledBy
      : [viewProps.labelledBy, labelId].filter(Boolean).join(' ')

  const hostProps: ViewProps<HTMLInputElement> = {
    ...viewProps,
    id: sliderId,
    disabled,
    labelledBy,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = clampSliderValue(event.currentTarget.valueAsNumber, min, max)

    if (!controlled) {
      setUncontrolledValue(next)
    }

    onChange?.(next)
  }

  const progress = sliderProgress(currentValue, min, max)
  const style = {
    ...inlineStyle,
    '--weave-slider-progress': `${progress}%`,
  } as CSSProperties

  const control = (
    <input
      {...resolved.domProps}
      ref={elementRef}
      id={sliderId}
      type="range"
      min={min}
      max={max}
      step={step}
      value={currentValue}
      disabled={disabled}
      onChange={handleChange}
      data-weave-view=""
      data-weave-slider=""
      data-weave-slider-size={size}
      data-weave-layout={resolved.layout}
      className={['weave-slider', `weave-slider--${size}`, themeClassName, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    />
  )

  if (label === undefined) {
    return control
  }

  return (
    <label
      className="weave-slider-field"
      data-weave-slider-field=""
      data-weave-slider-disabled={disabled ? 'true' : 'false'}
      htmlFor={sliderId}
    >
      {control}
      <span id={labelId} className="weave-slider__label" data-weave-slider-label="">
        {label}
      </span>
    </label>
  )
}
