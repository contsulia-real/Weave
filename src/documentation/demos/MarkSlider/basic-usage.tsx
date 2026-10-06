import { MarkSlider } from '../../../index'

export default function MarkSliderBasicUsageDemo() {
  return (
    <MarkSlider
      marks={[
        { flag: 20, label: 'Low' },
        { flag: 50, label: 'Medium' },
        { flag: 80, label: 'High' },
      ]}
      defaultValue={50}
      restricted
      min={0}
      max={100}
    />
  )
}
