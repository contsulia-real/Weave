import { Image } from '../../../index'
import { documentationSampleImage as imageUrl } from '../../documentation-example-fixtures'

export default function ImageBasicUsageDemo() {
  return (
    <Image
      src={imageUrl}
      alt="Example landscape"
      fit="cover"
      loading="lazy"
      viewProps={{ width: 320, height: 160, radius: 'medium' }}
    />
  )
}
