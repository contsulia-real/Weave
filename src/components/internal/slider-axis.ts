import type { SliderDirection } from '../../core/slider-types'
import { cssLengthPixels } from './css-length-pixels'
import { clampSliderValue } from './slider-values'

function decimalPlaces(value: number): number {
  const [coefficient, exponentText] = value.toString().toLowerCase().split('e')
  const exponent = Number(exponentText ?? 0)
  const fractionLength = coefficient?.split('.')[1]?.length ?? 0
  return Math.max(0, fractionLength - exponent)
}

function snapSliderValue(value: number, min: number, max: number, step: number): number {
  const clamped = clampSliderValue(value, min, max)
  if (!Number.isFinite(step) || step <= 0 || max <= min) return clamped

  if (clamped <= min) return min
  if (clamped >= max) return max

  const precision = Math.min(15, Math.max(decimalPlaces(min), decimalPlaces(step)))
  const stepIndex = Math.round((clamped - min) / step)
  const snapped = Number((min + stepIndex * step).toFixed(precision))

  return clampSliderValue(snapped, min, max)
}

export interface SliderAxisGeometry {
  start: number
  length: number
  thumbSize: number
  inputExtent: number
}

export function sliderAxisGeometry(
  input: HTMLInputElement,
  direction: SliderDirection,
): SliderAxisGeometry {
  const rect = input.getBoundingClientRect()
  const computed = getComputedStyle(input)
  const thumbSize = cssLengthPixels(input, computed.getPropertyValue('--weave-slider-thumb-size'))
  const inputExtent = Math.max(0, direction === 'horizontal' ? rect.width : rect.height)
  const length = Math.max(0, inputExtent - thumbSize)

  return {
    start: thumbSize / 2,
    length,
    thumbSize,
    inputExtent,
  }
}

export function sliderAxisPositionForValue(
  input: HTMLInputElement,
  value: number,
  min: number,
  max: number,
  direction: SliderDirection,
  inverse: boolean,
): number {
  const { start, length, inputExtent } = sliderAxisGeometry(input, direction)
  if (max <= min || length <= 0) return start

  const progress = (clampSliderValue(value, min, max) - min) / (max - min)
  const axisProgress = inverse ? 1 - progress : progress

  return direction === 'horizontal'
    ? start + length * axisProgress
    : inputExtent - start - length * axisProgress
}

export function sliderValueFromPointerPosition(
  input: HTMLInputElement,
  pointerPosition: number,
  min: number,
  max: number,
  direction: SliderDirection,
  inverse: boolean,
  step?: number,
): number {
  if (max <= min) return min

  const rect = input.getBoundingClientRect()
  const { start, length } = sliderAxisGeometry(input, direction)
  if (length <= 0) return min

  const local =
    direction === 'horizontal'
      ? pointerPosition - rect.left - start
      : rect.bottom - pointerPosition - start
  const axisProgress = Math.min(1, Math.max(0, local / length))
  const progress = inverse ? 1 - axisProgress : axisProgress
  const rawValue = min + (max - min) * progress

  return step === undefined
    ? clampSliderValue(rawValue, min, max)
    : snapSliderValue(rawValue, min, max, step)
}
