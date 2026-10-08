import { Slider } from '../../../index'

export default function SliderVerticalControlDemo() {
  return (
    <Slider
      defaultValue={60}
      min={0}
      max={100}
      step={10}
      direction="vertical"
      viewProps={{ height: 192 }}
    />
  )
}
