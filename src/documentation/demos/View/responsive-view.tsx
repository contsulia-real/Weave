import { View } from '../../../index'

export default function ViewResponsiveViewDemo() {
  return (
    <View
      background="surfaceHover"
      padding={1}
      md={{ padding: 2 }}
      lg={{ padding: 3 }}
      radius="medium"
    >
      Resize the viewport
    </View>
  )
}
