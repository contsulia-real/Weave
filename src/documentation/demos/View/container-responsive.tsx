import { View } from '../../../index'

export default function ViewContainerResponsiveDemo() {
  return (
    <View container="view-demo" width="fill" maxWidth={768}>
      <View
        background="surface"
        padding={16}
        radius="medium"
        containerSm={{ padding: 32, background: 'surfaceHover' }}
        containerMd={{ padding: 48 }}
      >
        Resize the demo container
      </View>
    </View>
  )
}
