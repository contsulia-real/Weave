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
  inputWidth: number
}

export function sliderAxisGeometry(input: HTMLInputElement): SliderAxisGeometry {
  const rect = input.getBoundingClientRect()
  const computed = getComputedStyle(input)
  const thumbSize = cssLengthPixels(input, computed.getPropertyValue('--weave-slider-thumb-size'))
  const inputWidth = Math.max(0, rect.width)
  const length = Math.max(0, inputWidth - thumbSize)

  return {
    start: thumbSize / 2,
    length,
    thumbSize,
    inputWidth,
  }
}

export function sliderAxisPositionForValue(
  input: HTMLInputElement,
  value: number,
  min: number,
  max: number,
): number {
  const { start, length } = sliderAxisGeometry(input)
  if (max <= min || length <= 0) return start

  const progress = (clampSliderValue(value, min, max) - min) / (max - min)
  return start + length * progress
}

export function sliderValueFromClientX(
  input: HTMLInputElement,
  clientX: number,
  min: number,
  max: number,
  step?: number,
): number {
  if (max <= min) return min

  const rect = input.getBoundingClientRect()
  const { start, length } = sliderAxisGeometry(input)
  if (length <= 0) return min

  const localX = clientX - rect.left
  const progress = Math.min(1, Math.max(0, (localX - start) / length))
  const rawValue = min + (max - min) * progress

  return step === undefined
    ? clampSliderValue(rawValue, min, max)
    : snapSliderValue(rawValue, min, max, step)
}
