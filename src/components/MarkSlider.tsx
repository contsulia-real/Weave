import { Fragment, useMemo } from 'react'
import type { MarkSliderMark, MarkSliderProps } from '../core/slider-types'
import { SingleSlider } from './internal/SingleSlider'

function resolvedMarks(
  marks: readonly MarkSliderMark[],
  min: number,
  max: number,
): readonly MarkSliderMark[] {
  const merged = [...marks]

  if (!marks.some((mark) => mark.flag === min)) {
    merged.push({ flag: min, label: <Fragment /> })
  }
  if (max !== min && !marks.some((mark) => mark.flag === max)) {
    merged.push({ flag: max, label: <Fragment /> })
  }

  return merged.sort((a, b) => a.flag - b.flag)
}

export function MarkSlider(props: MarkSliderProps): import('react').JSX.Element {
  const { marks, restricted = false, min = 0, max = 100, ...sliderProps } = props
  const mergedMarks = useMemo(() => resolvedMarks(marks, min, max), [marks, max, min])
  const points = useMemo(
    () => mergedMarks.map((mark) => ({ value: mark.flag, label: mark.label })),
    [mergedMarks],
  )
  const restrictedValues = useMemo(
    () => (restricted ? mergedMarks.map((mark) => mark.flag) : undefined),
    [mergedMarks, restricted],
  )

  return (
    <SingleSlider
      {...sliderProps}
      min={min}
      max={max}
      points={points}
      restrictedValues={restrictedValues}
      stepped={restricted}
      markSlider
    />
  )
}
