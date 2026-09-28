import {
  useState,
} from 'react'
import {
  Input,
  Progress,
  Switch,
  Text,
  View,
} from '../index'
import {
  PlaygroundSection,
} from './PlaygroundSection'

export function FormPlayground() {
  const [
    progressHigh,
    setProgressHigh,
  ] = useState(false)
  const progress =
    progressHigh
      ? 0.82
      : 0.28

  return (
    <>
      <PlaygroundSection
        title="Input"
        description="单行和多行共用同一个 Input；默认视觉来自 Input theme，multiline 内部滚动统一使用 Weave Scrollbar。"
      >
        <View
          layout="flex"
          direction="column"
          gap={0.75}
          maxWidth={32}
        >
          <Input
            placeholder="Name"
            autoComplete="name"
            viewProps={{
              width: 'fill',
            }}
          />

          <Input
            disabled
            defaultValue="Disabled input"
            viewProps={{
              width: 'fill',
            }}
          />

          <Input
            multiline
            rows={4}
            defaultValue={[
              'Multiline Input now uses Weave Scrollbar.',
              'Small scroll movements update only the thumb transform.',
              'Geometry is recalculated only on resize or layout changes.',
              'The textarea keeps native editing and scrolling behavior.',
              'Input and Button now share the same control height.',
              'Border, radius and focus treatment come from the theme.',
            ].join('\n')}
            placeholder="Notes"
            viewProps={{
              width: 'fill',
            }}
          />
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Switch"
        description="三档语义尺寸；hover 时 thumb 轻微增强，拖动时产生抓取反馈并直接跟手，释放后 spring 归位。"
      >
        <View
          layout="flex"
          direction="row"
          gap={1.5}
          align="center"
          wrap
        >
          <View
            layout="flex"
            direction="row"
            gap={0.5}
            align="center"
          >
            <Switch size="small" />
            <Text typo="body-medium">
              Small
            </Text>
          </View>

          <View
            layout="flex"
            direction="row"
            gap={0.5}
            align="center"
          >
            <Switch
              size="medium"
              defaultChecked
            />
            <Text typo="body-medium">
              Medium
            </Text>
          </View>

          <View
            layout="flex"
            direction="row"
            gap={0.5}
            align="center"
          >
            <Switch size="large" />
            <Text typo="body-medium">
              Large
            </Text>
          </View>

          <View
            layout="flex"
            direction="row"
            gap={0.5}
            align="center"
          >
            <Switch disabled />
            <Text typo="body-medium">
              Disabled
            </Text>
          </View>
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Progress"
        description="mode 决定 spin / linear；tracked 只控制浅色连续轨道。"
      >
        <View
          layout="flex"
          direction="column"
          gap={1}
        >
          <View
            layout="flex"
            direction="row"
            gap={1.5}
            align="center"
            wrap
          >
            <View
              layout="flex"
              direction="row"
              gap={0.5}
              align="center"
            >
              <Progress
                undetermined
                mode="spin"
                size="medium"
                color="primary"
              />
              <Text typo="body-medium">
                Spin
              </Text>
            </View>

            <View
              layout="flex"
              direction="row"
              gap={0.5}
              align="center"
            >
              <Progress
                undetermined
                mode="spin"
                tracked
                size="medium"
                color="primary"
              />
              <Text typo="body-medium">
                Spin tracked
              </Text>
            </View>

            <View
              layout="flex"
              direction="row"
              gap={0.5}
              align="center"
            >
              <Progress
                undetermined
                mode="linear"
                size="medium"
                color="primary"
              />
              <Text typo="body-medium">
                Linear
              </Text>
            </View>

            <View
              layout="flex"
              direction="row"
              gap={0.5}
              align="center"
            >
              <Progress
                undetermined
                mode="linear"
                tracked
                size="medium"
                color="primary"
              />
              <Text typo="body-medium">
                Linear tracked
              </Text>
            </View>
          </View>

          <View
            layout="flex"
            direction="row"
            gap={1.5}
            align="center"
            wrap
          >
            <Progress
              progress={progress}
              mode="spin"
              tracked
              size="large"
              color="success"
            />

            <Progress
              progress={progress}
              mode="linear"
              tracked
              size="large"
              color="success"
            />

            <Switch
              checked={progressHigh}
              onChange={
                setProgressHigh
              }
              size="small"
            />

            <Text typo="body-medium">
              {Math.round(
                progress * 100,
              )}
              %
            </Text>
          </View>
        </View>
      </PlaygroundSection>
    </>
  )
}
