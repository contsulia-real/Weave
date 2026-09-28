import {
  Column,
  Flex,
  Text,
  View,
} from '../index'
import {
  DemoBox,
  PlaygroundSection,
} from './PlaygroundSection'

export function LayoutPlayground() {
  return (
    <>
      <PlaygroundSection
        title="Scrollbar"
        description='View overflow="auto" 自动挂载框架 Scrollbar；只绘制 thumb，透明命中区仍贴着真实边缘；圆角容器会自动预留角落安全区，让 thumb 只在直线边缘内运动。'
      >
        <View
          width={28}
          height={10}
          overflow="auto"
          border={0.0625}
          borderColor="outline"
          radius="medium"
          scrollbar={{
            size: 'medium',
            color: 'primary',
            radius: 'full',
            opacity: 0.9,
          }}
        >
          <Column
            width={44}
            gap={0.5}
            padding={1}
          >
            {Array.from(
              {
                length: 12,
              },
              (_, index) => (
                <View
                  key={index}
                  width="fill"
                  padding={0.75}
                  background={
                    index % 2 === 0
                      ? 'surfaceHover'
                      : 'surface'
                  }
                  radius="small"
                >
                  <Text typo="body-medium">
                    Scroll row{' '}
                    {index + 1} —
                    horizontal content width
                    44rem
                  </Text>
                </View>
              ),
            )}
          </Column>
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Container breakpoint"
        description="拖动下面容器右下角改变它自己的宽度；达到 48rem 后内部切为横向。"
      >
        <View
          container="demo"
          className="container-demo"
          padding={1}
          radius="medium"
          border={0.0625}
          borderColor="outline"
        >
          <Flex
            direction="column"
            gap={0.75}
            containerMd={{
              direction: 'row',
              gap: 1.5,
            }}
          >
            <DemoBox label="1" />
            <DemoBox label="2" />
            <DemoBox label="3" />
          </Flex>
        </View>
      </PlaygroundSection>
    </>
  )
}
