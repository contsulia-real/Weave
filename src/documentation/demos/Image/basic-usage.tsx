import { Image } from '../../../index'
import { documentationSampleImage as imageUrl } from '../../documentation-example-fixtures'

export default function ImageBasicUsageDemo() {
  return (
    <Image
      src={imageUrl}
      alt="Example landscape"
      fit="cover"
      loading="lazy"
      viewProps={{ width: 20, height: 10, radius: 'medium' }}
    />
  )
}
