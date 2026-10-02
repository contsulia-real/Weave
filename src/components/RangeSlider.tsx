import type { ChangeEvent, CSSProperties } from 'react'
import {
  useCallback,
  useId,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { RangeSliderProps, RangeSliderValue } from '../core/slider-types'
import type { ViewProps } from '../core/view-types'
import { resolveSliderTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSliderStylesheet } from '../renderers/dom/slider-stylesheet'
import { useTheme } from '../theme/theme-context'
import { formFieldAssociationOverrides, useFormFieldContext } from './internal/form-field-context'
import {
  sliderAxisGeometry,
  sliderAxisPositionForValue,
  sliderValueFromPointerPosition,
} from './internal/slider-axis'
import {
  clampSliderValue,
  normalizeSliderRangeValue,
  sliderProgress,
  sliderStepPoints,
} from './internal/slider-values'
import { useFormReset } from './internal/use-form-reset'
import { useSliderInteraction } from './internal/use-slider-interaction'
import { useViewHost } from './internal/use-view-host'

export function RangeSlider({
  value,
  defaultValue,
  onChange,
  startName,
  endName,
  startLabel,
  endLabel,
  min = 0,
  max = 100,
  step: stepProp,
  disabled = false,
  label,
  size = 'medium',
  direction = 'horizontal',
  inverse = false,
  viewProps = {},
}: RangeSliderProps) {
  useInsertionEffect(ensureSliderStylesheet, [])

  const { theme, reducedMotion } = useTheme()
  const themeDeclarations = useMemo(() => resolveSliderTheme(theme, size), [size, theme])
  const themeClassName = useRuntimeStyleClass('slider-theme', themeDeclarations)

  const step = stepProp ?? 1
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<RangeSliderValue>(() =>
    normalizeSliderRangeValue(defaultValue ?? [min, max], min, max),
  )
  const [currentStart, currentEnd] = normalizeSliderRangeValue(value ?? uncontrolledValue, min, max)

  const generatedId = useId().replace(/:/g, '')
  const rangeId = `weave-range-slider-${generatedId}`
  const startId = `${rangeId}-start`
  const endId = `${rangeId}-end`
  const labelId = `${rangeId}-label`
  const startLabelId = `${rangeId}-start-label`
  const endLabelId = `${rangeId}-end-label`
  const field = useFormFieldContext()
  const { labelledBy, ...remainingViewProps } = viewProps

  const hostProps: ViewProps<HTMLInputElement> = {
    ...remainingViewProps,
    disabled,
    required: field?.required === true ? true : viewProps.required,
    invalid: field?.invalid === true ? true : viewProps.invalid,
    labelledBy: undefined,
  }

  const fieldAssociations = formFieldAssociationOverrides(field, labelledBy, viewProps.describedBy)

  const {
    elementRef: startInputRef,
    className: startClassName,
    inlineStyle: startInlineStyle,
    resolved: startResolved,
  } = useViewHost(hostProps, undefined, undefined, {
    ...fieldAssociations,
    labelledBy: [
      labelledBy,
      field?.labelId,
      label === undefined ? undefined : labelId,
      startLabel === undefined ? undefined : startLabelId,
    ],
  })
  const {
    elementRef: endInputRef,
    className: endClassName,
    inlineStyle: endInlineStyle,
    resolved: endResolved,
  } = useViewHost(hostProps, undefined, undefined, {
    ...fieldAssociations,
    labelledBy: [
      labelledBy,
      field?.labelId,
      label === undefined ? undefined : labelId,
      endLabel === undefined ? undefined : endLabelId,
    ],
  })

  const reset = useCallback(() => {
    const next = normalizeSliderRangeValue(
      controlled ? (value ?? [min, max]) : (defaultValue ?? [min, max]),
      min,
      max,
    )

    if (!controlled) {
      setUncontrolledValue(next)
    }

    if (startInputRef.current !== null) {
      startInputRef.current.value = String(next[0])
    }
    if (endInputRef.current !== null) {
      endInputRef.current.value = String(next[1])
    }
  }, [controlled, defaultValue, endInputRef, max, min, startInputRef, value])

  useFormReset(startInputRef, reset)

  const controlRef = useRef<HTMLSpanElement>(null)
  const startThumbRef = useRef<HTMLSpanElement>(null)
  const endThumbRef = useRef<HTMLSpanElement>(null)
  const switchBase = theme.components.Switch?.base
  const dragShrink = switchBase?.thumbDragShrink ?? 0.68
  const dragMaxWidth = switchBase?.thumbDragMaxWidth ?? 1.35
  const callbacks = {
    onPointerDown: viewProps.onPointerDown,
    onPointerMove: viewProps.onPointerMove,
    onPointerUp: viewProps.onPointerUp,
    onPointerCancel: viewProps.onPointerCancel,
  }

  const startInteraction = useSliderInteraction({
    inputRef: startInputRef,
    controlRef,
    thumbRef: startThumbRef,
    disabled,
    direction,
    dragShrink,
    dragMaxWidth,
    callbacks,
    interactionId: 'start',
    onPointerValue: (pointerPosition, input) => {
      const nextStart = Math.min(
        sliderValueFromPointerPosition(input, pointerPosition, min, max, direction, inverse, step),
        currentEnd,
      )
      commitValue([nextStart, currentEnd])
    },
  })
  const endInteraction = useSliderInteraction({
    inputRef: endInputRef,
    controlRef,
    thumbRef: endThumbRef,
    disabled,
    direction,
    dragShrink,
    dragMaxWidth,
    callbacks,
    interactionId: 'end',
    onPointerValue: (pointerPosition, input) => {
      const nextEnd = Math.max(
        sliderValueFromPointerPosition(input, pointerPosition, min, max, direction, inverse, step),
        currentStart,
      )
      commitValue([currentStart, nextEnd])
    },
  })

  const commitValue = (next: RangeSliderValue) => {
    if (!controlled) {
      setUncontrolledValue(next)
    }
    onChange?.(next)
  }

  const handleStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextStart = Math.min(
      clampSliderValue(event.currentTarget.valueAsNumber, min, max),
      currentEnd,
    )
    commitValue([nextStart, currentEnd])
  }

  const handleEndChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEnd = Math.max(
      clampSliderValue(event.currentTarget.valueAsNumber, min, max),
      currentStart,
    )
    commitValue([currentStart, nextEnd])
  }

  const startProgress = sliderProgress(currentStart, min, max)
  const endProgress = sliderProgress(currentEnd, min, max)
  const stepPoints = useMemo(
    () => (stepProp === undefined ? [] : sliderStepPoints(min, max, step)),
    [max, min, step, stepProp],
  )
  const visualStyle = {
    '--weave-range-slider-start-progress': `${startProgress}%`,
    '--weave-range-slider-end-progress': `${endProgress}%`,
  } as CSSProperties

  useLayoutEffect(() => {
    const control = controlRef.current
    const input = startInputRef.current
    if (control === null || input === null) return

    const updateHitSplit = () => {
      const { inputExtent, thumbSize } = sliderAxisGeometry(input, direction)
      const startCenter = sliderAxisPositionForValue(
        input,
        currentStart,
        min,
        max,
        direction,
        inverse,
      )
      const endCenter = sliderAxisPositionForValue(input, currentEnd, min, max, direction, inverse)
      const midpoint = (startCenter + endCenter) / 2
      const thumbsOverlap = Math.abs(endCenter - startCenter) < thumbSize
      const minAtAxisStart = direction === 'horizontal' ? !inverse : inverse
      const split = thumbsOverlap
        ? minAtAxisStart
          ? Math.min(inputExtent, startCenter + thumbSize / 2)
          : Math.max(0, startCenter - thumbSize / 2)
        : midpoint
      control.style.setProperty('--weave-range-slider-hit-split', `${split}px`)
    }

    updateHitSplit()
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateHitSplit)
    observer?.observe(input)

    return () => observer?.disconnect()
  }, [currentEnd, currentStart, direction, inverse, max, min, startInputRef, themeClassName])

  const startInput = (
    <input
      {...startResolved.domProps}
      ref={startInputRef}
      id={startId}
      type="range"
      aria-orientation={direction}
      min={min}
      max={max}
      step={step}
      value={currentStart}
      name={startName}
      required={field?.required === true}
      disabled={disabled}
      onChange={handleStartChange}
      onPointerDown={startInteraction.handlePointerDown}
      onPointerMove={startInteraction.handlePointerMove}
      onPointerUp={startInteraction.handlePointerUp}
      onPointerCancel={startInteraction.handlePointerCancel}
      data-weave-view=""
      data-weave-slider=""
      data-weave-slider-direction={direction}
      data-weave-slider-inverse={inverse ? 'true' : 'false'}
      data-weave-range-slider=""
      data-weave-range-slider-thumb="start"
      data-weave-slider-size={size}
      data-weave-layout={startResolved.layout}
      className={[
        'weave-slider',
        'weave-range-slider__input',
        'weave-range-slider__input--start',
        `weave-slider--${size}`,
        themeClassName,
        startClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      style={startInlineStyle}
    />
  )

  const endInput = (
    <input
      {...endResolved.domProps}
      ref={endInputRef}
      id={endId}
      type="range"
      aria-orientation={direction}
      min={min}
      max={max}
      step={step}
      value={currentEnd}
      name={endName}
      required={field?.required === true}
      disabled={disabled}
      onChange={handleEndChange}
      onPointerDown={endInteraction.handlePointerDown}
      onPointerMove={endInteraction.handlePointerMove}
      onPointerUp={endInteraction.handlePointerUp}
      onPointerCancel={endInteraction.handlePointerCancel}
      data-weave-view=""
      data-weave-slider=""
      data-weave-slider-direction={direction}
      data-weave-slider-inverse={inverse ? 'true' : 'false'}
      data-weave-range-slider=""
      data-weave-range-slider-thumb="end"
      data-weave-slider-size={size}
      data-weave-layout={endResolved.layout}
      className={[
        'weave-slider',
        'weave-range-slider__input',
        'weave-range-slider__input--end',
        `weave-slider--${size}`,
        themeClassName,
        endClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      style={endInlineStyle}
    />
  )

  const control = (
    <span
      ref={controlRef}
      className={['weave-slider-control', 'weave-range-slider-control', themeClassName]
        .filter(Boolean)
        .join(' ')}
      data-weave-slider-control=""
      data-weave-slider-direction={direction}
      data-weave-slider-inverse={inverse ? 'true' : 'false'}
      data-weave-range-slider-control=""
      data-weave-slider-disabled={disabled ? 'true' : 'false'}
      data-weave-slider-stepped={stepProp === undefined ? 'false' : 'true'}
      data-weave-reduced-motion={reducedMotion ? 'reduce' : 'no-preference'}
      style={visualStyle}
    >
      <span className="weave-slider__visual" aria-hidden="true">
        <span className="weave-slider__range">
          <span className="weave-slider__track weave-slider__track--inactive weave-range-slider__inactive-track weave-range-slider__inactive-track--start" />
          <span className="weave-slider__track weave-slider__track--active weave-range-slider__active-track" />
          <span className="weave-slider__track weave-slider__track--inactive weave-range-slider__inactive-track weave-range-slider__inactive-track--end" />

          <span className="weave-slider__steps">
            {stepPoints.map((point, index) => {
              const pointProgress = sliderProgress(point, min, max)
              const active =
                point >= currentStart - Number.EPSILON && point <= currentEnd + Number.EPSILON

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

          <span
            ref={startThumbRef}
            className="weave-slider__thumb weave-range-slider__thumb weave-range-slider__thumb--start"
          >
            <span className="weave-slider__dot weave-slider__thumb-dot" />
          </span>
          <span
            ref={endThumbRef}
            className="weave-slider__thumb weave-range-slider__thumb weave-range-slider__thumb--end"
          >
            <span className="weave-slider__dot weave-slider__thumb-dot" />
          </span>
        </span>
      </span>

      {startInput}
      {endInput}

      {startLabel === undefined ? null : (
        <span id={startLabelId} className="weave-range-slider__a11y-label">
          {startLabel}
        </span>
      )}
      {endLabel === undefined ? null : (
        <span id={endLabelId} className="weave-range-slider__a11y-label">
          {endLabel}
        </span>
      )}
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
      data-weave-range-slider-field=""
      data-weave-slider-disabled={disabled ? 'true' : 'false'}
    >
      {control}
      <span id={labelId} className="weave-slider__label" data-weave-slider-label="">
        {label}
      </span>
    </span>
  )
}
