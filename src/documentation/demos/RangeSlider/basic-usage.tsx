import { RangeSlider } from '../../../index'

export default function RangeSliderBasicUsageDemo() {
  return (
    <RangeSlider
      defaultValue={[25, 75]}
      min={0}
      max={100}
      step={5}
      startLabel="Minimum"
      endLabel="Maximum"
    />
  )
}
