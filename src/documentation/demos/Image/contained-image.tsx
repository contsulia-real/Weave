import { Image } from '../../../index'
import { documentationSampleImage as imageUrl } from '../../documentation-example-fixtures'

export default function ImageContainedImageDemo() {
  return (
    <Image
      src={imageUrl}
      alt="Contained example landscape"
      fit="contain"
      viewProps={{ width: 320, height: 128, background: 'surfaceHover', radius: 'medium' }}
    />
  )
}
