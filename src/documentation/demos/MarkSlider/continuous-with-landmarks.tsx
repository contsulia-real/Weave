import { MarkSlider } from '../../../index'

export default function MarkSliderContinuousWithLandmarksDemo() {
  return (
    <MarkSlider
      marks={[
        { flag: 0, label: '0' },
        { flag: 50, label: '50' },
        { flag: 100, label: '100' },
      ]}
      defaultValue={35}
      min={0}
      max={100}
      step={5}
    />
  )
}
