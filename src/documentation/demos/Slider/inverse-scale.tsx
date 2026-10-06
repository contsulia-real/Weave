import { Slider } from '../../../index'

export default function SliderInverseScaleDemo() {
  return <Slider defaultValue={70} min={0} max={100} step={10} inverse label="Intensity" />
}
