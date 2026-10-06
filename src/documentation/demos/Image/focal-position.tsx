import { Image } from '../../../index'
import { documentationSampleImage as imageUrl } from '../../documentation-example-fixtures'

export default function ImageFocalPositionDemo() {
  return (
    <Image
      src={imageUrl}
      alt="Top-aligned example landscape"
      fit="cover"
      position="top"
      loading="eager"
      viewProps={{ width: 16, height: 6, radius: 'medium' }}
    />
  )
}
