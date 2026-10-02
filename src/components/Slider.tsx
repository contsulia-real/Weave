import { useMemo } from 'react'
import type { SliderProps } from '../core/slider-types'
import { SingleSlider } from './internal/SingleSlider'
import { sliderStepPoints } from './internal/slider-values'

export function Slider(props: SliderProps) {
  const min = props.min ?? 0
  const max = props.max ?? 100
  const points = useMemo(
    () =>
      props.step === undefined
        ? []
        : sliderStepPoints(min, max, props.step).map((value) => ({ value })),
    [max, min, props.step],
  )

  return <SingleSlider {...props} points={points} stepped={props.step !== undefined} />
}
