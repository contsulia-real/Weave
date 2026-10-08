import { RangeSlider } from '../../../index'

export default function RangeSliderVerticalIntervalDemo() {
  return (
    <RangeSlider
      defaultValue={[20, 80]}
      min={0}
      max={100}
      step={10}
      direction="vertical"
      viewProps={{ height: 192 }}
    />
  )
}
