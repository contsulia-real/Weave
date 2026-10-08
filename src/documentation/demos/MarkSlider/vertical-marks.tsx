import { MarkSlider } from '../../../index'

export default function MarkSliderVerticalMarksDemo() {
  return (
    <MarkSlider
      marks={[
        { flag: 25, label: '25' },
        { flag: 50, label: '50' },
        { flag: 75, label: '75' },
      ]}
      defaultValue={50}
      min={0}
      max={100}
      direction="vertical"
      viewProps={{ height: 192 }}
    />
  )
}
