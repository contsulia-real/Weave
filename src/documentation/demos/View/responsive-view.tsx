import { View } from '../../../index'

export default function ViewResponsiveViewDemo() {
  return (
    <View
      background="surfaceHover"
      padding={16}
      md={{ padding: 32 }}
      lg={{ padding: 48 }}
      radius="medium"
    >
      Resize the viewport
    </View>
  )
}
