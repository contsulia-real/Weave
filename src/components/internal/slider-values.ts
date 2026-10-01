export type SliderRangeValue = [number, number]

export function clampSliderValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function sliderProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0
  return ((value - min) / (max - min)) * 100
}

export function sliderStepPoints(min: number, max: number, step: number): number[] {
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

export function normalizeSliderRangeValue(
  value: readonly [number, number],
  min: number,
  max: number,
): SliderRangeValue {
  const first = clampSliderValue(value[0], min, max)
  const second = clampSliderValue(value[1], min, max)

  return first <= second ? [first, second] : [second, first]
}
