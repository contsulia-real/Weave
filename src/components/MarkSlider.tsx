import { useMemo } from 'react'
import type { MarkSliderProps } from '../core/slider-types'
import { SingleSlider } from './internal/SingleSlider'

export function MarkSlider({ marks, restricted = false, ...props }: MarkSliderProps) {
  const points = useMemo(
    () => marks.map((mark) => ({ value: mark.flag, label: mark.label })),
    [marks],
  )
  const restrictedValues = useMemo(
    () => (restricted ? marks.map((mark) => mark.flag) : undefined),
    [marks, restricted],
  )

  return (
    <SingleSlider
      {...props}
      points={points}
      restrictedValues={restrictedValues}
      stepped={restricted}
      markSlider
    />
  )
}
