import { Row, View } from '../../../index'

export default function ViewStateStylesDemo() {
  return (
    <Row gap={1} wrap>
      <View
        clickable
        focusable
        label="Interactive View"
        background="surfaceHover"
        padding={1.5}
        radius="medium"
        transition={{ properties: ['background', 'color', 'transform'], duration: 'fast' }}
        hover={{ background: 'primary', color: 'onPrimary', translateY: -1 }}
        active={{ translateY: 1, scale: 0.98 }}
        focusVisible={{
          outlineWidth: 2,
          outlineColor: 'primary',
          outlineStyle: 'solid',
          outlineOffset: 2,
        }}
      >
        Hover, press, or focus
      </View>

      <View
        disabled
        background="surfaceHover"
        padding={1.5}
        radius="medium"
        disabledStyle={{ opacity: 0.45 }}
      >
        Disabled style
      </View>
    </Row>
  )
}
