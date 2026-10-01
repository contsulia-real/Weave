import type { ChangeEvent, CSSProperties } from 'react'
import { useCallback, useId, useInsertionEffect, useMemo, useRef, useState } from 'react'
import type { SliderProps } from '../core/slider-types'
import type { ViewProps } from '../core/view-types'
import { resolveSliderTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSliderStylesheet } from '../renderers/dom/slider-stylesheet'
import { useTheme } from '../theme/theme-context'
import { formFieldAssociationOverrides, useFormFieldContext } from './internal/form-field-context'
import { useFormReset } from './internal/use-form-reset'
import { useSliderInteraction } from './internal/use-slider-interaction'
import { useViewHost } from './internal/use-view-host'

function clampSliderValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function sliderProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0
  return ((value - min) / (max - min)) * 100
}

function sliderStepPoints(min: number, max: number, step: number): number[] {
  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    !Number.isFinite(step) ||
    step <= 0 ||
    max <= min
  ) {
    return []
  }

  const intervals = Math.floor((max - min) / step + 1e-9)
  const points = Array.from({ length: intervals + 1 }, (_, index) => {
    const value = min + index * step
    return Math.min(max, value)
  })

  if (points[points.length - 1] !== max) {
    points.push(max)
  }

  return points
}

export function Slider({
  value,
  defaultValue,
  onChange,
  name,
  min = 0,
  max = 100,
  step: stepProp,
  disabled = false,
  label,
  size = 'medium',
  viewProps = {},
}: SliderProps) {
  useInsertionEffect(ensureSliderStylesheet, [])

  const { theme, reducedMotion } = useTheme()
  const themeDeclarations = useMemo(() => resolveSliderTheme(theme, size), [size, theme])
  const themeClassName = useRuntimeStyleClass('slider-theme', themeDeclarations)

  const step = stepProp ?? 1
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    clampSliderValue(defaultValue ?? min, min, max),
  )
  const currentValue = clampSliderValue(value ?? uncontrolledValue, min, max)

  const generatedId = useId()
  const sliderId = viewProps.id ?? `weave-slider-${generatedId}`
  const labelId = `${sliderId}-label`
  const field = useFormFieldContext()
  const { labelledBy, ...remainingViewProps } = viewProps

  const hostProps: ViewProps<HTMLInputElement> = {
    ...remainingViewProps,
    id: sliderId,
    disabled,
    required: field?.required === true ? true : viewProps.required,
    invalid: field?.invalid === true ? true : viewProps.invalid,
    labelledBy: label === undefined && field === null ? labelledBy : undefined,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    hostProps,
    undefined,
    undefined,
    field === null && label === undefined
      ? undefined
      : {
          ...formFieldAssociationOverrides(field, labelledBy, viewProps.describedBy),
          labelledBy: [labelledBy, field?.labelId, label === undefined ? undefined : labelId],
        },
  )

  const reset = useCallback(() => {
    const next = clampSliderValue(controlled ? (value ?? min) : (defaultValue ?? min), min, max)

    if (!controlled) {
      setUncontrolledValue(next)
    }

    if (elementRef.current !== null) {
      elementRef.current.value = String(next)
    }
  }, [controlled, defaultValue, elementRef, max, min, value])

  useFormReset(elementRef, reset)

  const controlRef = useRef<HTMLSpanElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const switchBase = theme.components.Switch?.base
  const dragShrink = switchBase?.thumbDragShrink ?? 0.68
  const dragMaxWidth = switchBase?.thumbDragMaxWidth ?? 1.35

  const interaction = useSliderInteraction({
    inputRef: elementRef,
    controlRef,
    thumbRef,
    disabled,
    dragShrink,
    dragMaxWidth,
    callbacks: {
      onPointerDown: viewProps.onPointerDown,
      onPointerMove: viewProps.onPointerMove,
      onPointerUp: viewProps.onPointerUp,
      onPointerCancel: viewProps.onPointerCancel,
    },
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = clampSliderValue(event.currentTarget.valueAsNumber, min, max)

    if (!controlled) {
      setUncontrolledValue(next)
    }

    onChange?.(next)
  }

  const progress = sliderProgress(currentValue, min, max)
  const stepPoints = useMemo(
    () => (stepProp === undefined ? [] : sliderStepPoints(min, max, step)),
    [max, min, step, stepProp],
  )
  const visualStyle = {
    '--weave-slider-progress': `${progress}%`,
  } as CSSProperties

  const control = (
    <span
      ref={controlRef}
      className={['weave-slider-control', themeClassName].filter(Boolean).join(' ')}
      data-weave-slider-control=""
      data-weave-slider-disabled={disabled ? 'true' : 'false'}
      data-weave-slider-stepped={stepProp === undefined ? 'false' : 'true'}
      data-weave-reduced-motion={reducedMotion ? 'reduce' : 'no-preference'}
      style={visualStyle}
    >
      <span className="weave-slider__visual" aria-hidden="true">
        <span className="weave-slider__range">
          <span className="weave-slider__active-track" />
          <span className="weave-slider__inactive-track" />
          <span className="weave-slider__steps">
            {stepPoints.map((point, index) => {
              const pointProgress = sliderProgress(point, min, max)
              const active = point <= currentValue + Number.EPSILON

              return (
                <span
                  key={index}
                  className="weave-slider__dot weave-slider__step"
                  data-weave-slider-step-active={active ? 'true' : 'false'}
                  style={
                    {
                      '--weave-slider-step-position': `${pointProgress}%`,
                    } as CSSProperties
                  }
                />
              )
            })}
          </span>
          <span ref={thumbRef} className="weave-slider__thumb">
            <span className="weave-slider__dot weave-slider__thumb-dot" />
          </span>
        </span>
      </span>

      <input
        {...resolved.domProps}
        ref={elementRef}
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        name={name}
        required={field?.required === true}
        disabled={disabled}
        onChange={handleChange}
        onPointerDown={interaction.handlePointerDown}
        onPointerMove={interaction.handlePointerMove}
        onPointerUp={interaction.handlePointerUp}
        onPointerCancel={interaction.handlePointerCancel}
        data-weave-view=""
        data-weave-slider=""
        data-weave-slider-size={size}
        data-weave-layout={resolved.layout}
        className={['weave-slider', `weave-slider--${size}`, themeClassName, className]
          .filter(Boolean)
          .join(' ')}
        style={inlineStyle}
      />
    </span>
  )

  if (label === undefined) {
    return control
  }

  return (
    <span
      className={['weave-slider-field', themeClassName].filter(Boolean).join(' ')}
      data-weave-slider-field=""
      data-weave-slider-disabled={disabled ? 'true' : 'false'}
    >
      {control}
      <span id={labelId} className="weave-slider__label" data-weave-slider-label="">
        {label}
      </span>
    </span>
  )
}
