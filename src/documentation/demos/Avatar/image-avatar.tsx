import { Avatar } from '../../../index'
import { documentationSampleImage as imageUrl } from '../../documentation-example-fixtures'

export default function AvatarImageAvatarDemo() {
  return (
    <Avatar
      src={imageUrl}
      name="Landscape account"
      fallback="LA"
      viewProps={{ width: 4, height: 4 }}
    />
  )
}
