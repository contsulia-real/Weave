import { View } from '../../../index'

export default function ViewContainerResponsiveDemo() {
  return (
    <View container="view-demo" width="fill" maxWidth={48}>
      <View
        background="surface"
        padding={1}
        radius="medium"
        containerSm={{ padding: 2, background: 'surfaceHover' }}
        containerMd={{ padding: 3 }}
      >
        Resize the demo container
      </View>
    </View>
  )
}
