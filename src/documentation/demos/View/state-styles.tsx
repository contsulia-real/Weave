import { Row, View } from '../../../index'

export default function ViewStateStylesDemo() {
  return (
    <Row gap={16} wrap>
      <View
        clickable
        focusable
        label="Interactive View"
        background="surfaceHover"
        padding={24}
        radius="medium"
        transition={{ properties: ['background', 'color', 'transform'], duration: 'fast' }}
        hover={{ background: 'primary', color: 'onPrimary', translateY: -16 }}
        active={{ translateY: 16, scale: 0.98 }}
        focusVisible={{
          outlineWidth: 32,
          outlineColor: 'primary',
          outlineStyle: 'solid',
          outlineOffset: 32,
        }}
      >
        Hover, press, or focus
      </View>

      <View
        disabled
        background="surfaceHover"
        padding={24}
        radius="medium"
        disabledStyle={{ opacity: 0.45 }}
      >
        Disabled style
      </View>
    </Row>
  )
}
