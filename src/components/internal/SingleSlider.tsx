import type { ChangeEvent, CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { useCallback, useId, useInsertionEffect, useMemo, useRef, useState } from 'react'
import type { SliderProps } from '../../core/slider-types'
import type { ViewProps } from '../../core/view-types'
import { resolveSliderTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { ensureSliderStylesheet } from '../../renderers/dom/slider-stylesheet'
import { useTheme } from '../../theme/theme-context'
import { formFieldAssociationOverrides, useFormFieldContext } from './form-field-context'
import { sliderValueFromPointerPosition } from './slider-axis'
import { clampSliderValue, sliderProgress } from './slider-values'
import { useFormReset } from './use-form-reset'
import { useSliderInteraction } from './use-slider-interaction'
import { useViewHost } from './use-view-host'

export interface SingleSliderPoint {
  value: number
  label?: ReactNode
}

export interface SingleSliderProps extends SliderProps {
  points: readonly SingleSliderPoint[]
  restrictedValues?: readonly number[]
  stepped?: boolean
  markSlider?: boolean
}

function nearestRestrictedValue(value: number, values: readonly number[]): number {
  let nearest = values[0] ?? value
  let nearestDistance = Math.abs(nearest - value)

  for (let index = 1; index < values.length; index += 1) {
    const candidate = values[index]
    if (candidate === undefined) continue

    const distance = Math.abs(candidate - value)
    if (distance < nearestDistance) {
      nearest = candidate
      nearestDistance = distance
    }
  }

  return nearest
}

function normalizedRestrictedValues(values: readonly number[] | undefined): readonly number[] {
  if (values === undefined || values.length === 0) return []

  return [...new Set(values)].sort((a, b) => a - b)
}

export function SingleSlider({
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
  direction = 'horizontal',
  inverse = false,
  viewProps = {},
  points,
  restrictedValues: restrictedValuesProp,
  stepped = points.length > 0,
  markSlider = false,
}: SingleSliderProps) {
  useInsertionEffect(ensureSliderStylesheet, [])

  const { theme, reducedMotion } = useTheme()
  const themeDeclarations = useMemo(() => resolveSliderTheme(theme, size), [size, theme])
  const themeClassName = useRuntimeStyleClass('slider-theme', themeDeclarations)

  const restrictedValues = useMemo(
    () => normalizedRestrictedValues(restrictedValuesProp),
    [restrictedValuesProp],
  )
  const restricted = restrictedValues.length > 0
  const inputStep: number | 'any' = restricted ? 'any' : (stepProp ?? 1)

  const normalizeValue = useCallback(
    (nextValue: number) => {
      const clamped = clampSliderValue(nextValue, min, max)
      return restricted ? nearestRestrictedValue(clamped, restrictedValues) : clamped
    },
    [max, min, restricted, restrictedValues],
  )

  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    normalizeValue(defaultValue ?? min),
  )
  const currentValue = normalizeValue(value ?? uncontrolledValue)

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
    const next = normalizeValue(controlled ? (value ?? min) : (defaultValue ?? min))

    if (!controlled) {
      setUncontrolledValue(next)
    }

    if (elementRef.current !== null) {
      elementRef.current.value = String(next)
    }
  }, [controlled, defaultValue, elementRef, min, normalizeValue, value])

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
    direction,
    dragShrink,
    dragMaxWidth,
    callbacks: {
      onPointerDown: viewProps.onPointerDown,
      onPointerMove: viewProps.onPointerMove,
      onPointerUp: viewProps.onPointerUp,
      onPointerCancel: viewProps.onPointerCancel,
    },
    onPointerValue: (pointerPosition, input) => {
      commitValue(
        sliderValueFromPointerPosition(
          input,
          pointerPosition,
          min,
          max,
          direction,
          inverse,
          restricted ? undefined : (stepProp ?? 1),
        ),
      )
    },
  })

  const commitValue = (nextValue: number) => {
    const next = normalizeValue(nextValue)

    if (!controlled) {
      setUncontrolledValue(next)
    }

    if (restricted && elementRef.current !== null) {
      elementRef.current.value = String(next)
    }

    onChange?.(next)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    commitValue(event.currentTarget.valueAsNumber)
  }

  const handleRestrictedKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    resolved.domProps.onKeyDown?.(event)
    if (event.defaultPrevented) return

    const index = restrictedValues.findIndex(
      (candidate) => Math.abs(candidate - currentValue) <= Number.EPSILON,
    )
    const currentIndex = index < 0 ? 0 : index
    let nextIndex: number | undefined

    const decrementKeys = inverse
      ? ['ArrowRight', 'ArrowUp', 'PageUp']
      : ['ArrowLeft', 'ArrowDown', 'PageDown']
    const incrementKeys = inverse
      ? ['ArrowLeft', 'ArrowDown', 'PageDown']
      : ['ArrowRight', 'ArrowUp', 'PageUp']

    if (decrementKeys.includes(event.key)) {
      nextIndex = Math.max(0, currentIndex - 1)
    } else if (incrementKeys.includes(event.key)) {
      nextIndex = Math.min(restrictedValues.length - 1, currentIndex + 1)
    } else {
      switch (event.key) {
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = restrictedValues.length - 1
          break
        default:
          return
      }
    }

    const next = restrictedValues[nextIndex]
    if (next === undefined) return

    event.preventDefault()
    commitValue(next)
  }

  const progress = sliderProgress(currentValue, min, max)
  const visualStyle = {
    '--weave-slider-progress': `${progress}%`,
  } as CSSProperties
  const hasLabels = points.some((point) => point.label !== undefined)

  const control = (
    <span
      ref={controlRef}
      className={['weave-slider-control', themeClassName].filter(Boolean).join(' ')}
      data-weave-slider-control=""
      data-weave-slider-direction={direction}
      data-weave-slider-inverse={inverse ? 'true' : 'false'}
      data-weave-mark-slider-control={markSlider ? 'true' : undefined}
      data-weave-slider-disabled={disabled ? 'true' : 'false'}
      data-weave-slider-points={points.length > 0 ? 'true' : 'false'}
      data-weave-slider-stepped={stepped ? 'true' : 'false'}
      data-weave-reduced-motion={reducedMotion ? 'reduce' : 'no-preference'}
      style={visualStyle}
    >
      <span className="weave-slider__visual" aria-hidden="true">
        <span className="weave-slider__range">
          <span className="weave-slider__track weave-slider__track--active weave-slider__active-track" />
          <span className="weave-slider__track weave-slider__track--inactive weave-slider__inactive-track" />
          <span className="weave-slider__steps">
            {points.map((point, index) => {
              const pointProgress = sliderProgress(point.value, min, max)
              const active = point.value <= currentValue + Number.EPSILON

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

      {markSlider && hasLabels ? (
        <span className="weave-mark-slider__labels">
          {points.map((point, index) => {
            if (point.label === undefined) return null

            const pointProgress = sliderProgress(point.value, min, max)
            return (
              <span
                key={index}
                className="weave-mark-slider__label"
                style={
                  {
                    '--weave-mark-slider-label-position': `${pointProgress}%`,
                  } as CSSProperties
                }
              >
                {point.label}
              </span>
            )
          })}
        </span>
      ) : null}

      <input
        {...resolved.domProps}
        ref={elementRef}
        id={sliderId}
        type="range"
        aria-orientation={direction}
        min={min}
        max={max}
        step={inputStep}
        value={currentValue}
        name={name}
        required={field?.required === true}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={restricted ? handleRestrictedKeyDown : resolved.domProps.onKeyDown}
        onPointerDown={interaction.handlePointerDown}
        onPointerMove={interaction.handlePointerMove}
        onPointerUp={interaction.handlePointerUp}
        onPointerCancel={interaction.handlePointerCancel}
        data-weave-view=""
        data-weave-slider=""
        data-weave-slider-direction={direction}
        data-weave-slider-inverse={inverse ? 'true' : 'false'}
        data-weave-mark-slider={markSlider ? '' : undefined}
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
      data-weave-slider-direction={direction}
      data-weave-slider-inverse={inverse ? 'true' : 'false'}
      data-weave-slider-disabled={disabled ? 'true' : 'false'}
    >
      {control}
      <span id={labelId} className="weave-slider__label" data-weave-slider-label="">
        {label}
      </span>
    </span>
  )
}
