import {
  useState,
} from 'react'
import {
  Checkbox,
  Column,
  Input,
  Progress,
  Radio,
  Row,
  Switch,
  Text,
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
        description="单行 Input 与 Select / Combobox 共用同一套 Field Control visual baseline；multiline 仍使用 Input theme 与 Weave Scrollbar。"
      >
        <Column
          gap={0.75}
          align="start"
        >
          <Input
            placeholder="Name"
            autoComplete="name"
            viewProps={{
              width: 20,
            }}
          />

          <Input
            disabled
            defaultValue="Disabled input"
            viewProps={{
              width: 20,
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
              width: 32,
            }}
          />
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Switch"
        description="三档语义尺寸；hover 时 thumb 轻微增强，拖动时产生抓取反馈并直接跟手，释放后 spring 归位。"
      >
        <Row
          gap={1.5}
          align="center"
          wrap
        >
          <Switch
            size="small"
            label="Small"
          />

          <Switch
            size="medium"
            defaultChecked
            label="Medium"
          />

          <Switch
            size="large"
            label="Large"
          />

          <Switch
            disabled
            label="Disabled"
          />
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Radio / Checkbox"
        description="三档尺寸明确展示；group 直接建立原生分组：同 group Radio 互斥，同 group Checkbox 共享组名但仍可独立勾选。"
      >
        <Column
          gap={1.25}
        >
          <Column
            gap={0.625}
          >
            <Text typo="label-medium">
              Sizes · checked
            </Text>

            <Row
              gap={1.5}
              align="center"
              wrap
            >
              <Row gap={0.5} align="center">
                <Radio
                  size="small"
                  defaultChecked
                  label="Radio"
                />
                <Checkbox
                  size="small"
                  defaultChecked
                  label="Checkbox"
                />
                <Text typo="body-medium">Small · 18px</Text>
              </Row>

              <Row gap={0.5} align="center">
                <Radio
                  size="medium"
                  defaultChecked
                  label="Radio"
                />
                <Checkbox
                  size="medium"
                  defaultChecked
                  label="Checkbox"
                />
                <Text typo="body-medium">Medium · 22px</Text>
              </Row>

              <Row gap={0.5} align="center">
                <Radio
                  size="large"
                  defaultChecked
                  label="Radio"
                />
                <Checkbox
                  size="large"
                  defaultChecked
                  label="Checkbox"
                />
                <Text typo="body-medium">Large · 26px</Text>
              </Row>
            </Row>
          </Column>

          <Row
            gap={2}
            align="start"
            wrap
          >
            <Column
              gap={0.625}
            >
              <Text typo="label-medium">
                Radio group · theme
              </Text>

              <Row gap={0.5} align="center">
                <Radio
                  group="theme-demo"
                  value="light"
                  defaultChecked
                  label="Light"
                />
              </Row>

              <Row gap={0.5} align="center">
                <Radio
                  group="theme-demo"
                  value="dark"
                  label="Dark"
                />
              </Row>

              <Row gap={0.5} align="center">
                <Radio
                  group="theme-demo"
                  value="system"
                  disabled
                  label="System · disabled"
                />
              </Row>
            </Column>

            <Column
              gap={0.625}
            >
              <Text typo="label-medium">
                Checkbox group · permissions
              </Text>

              <Row gap={0.5} align="center">
                <Checkbox
                  group="permissions-demo"
                  value="read"
                  defaultChecked
                  label="Read"
                />
              </Row>

              <Row gap={0.5} align="center">
                <Checkbox
                  group="permissions-demo"
                  value="write"
                  label="Write"
                />
              </Row>

              <Row gap={0.5} align="center">
                <Checkbox
                  group="permissions-demo"
                  value="admin"
                  disabled
                  label="Admin · disabled"
                />
              </Row>
            </Column>
          </Row>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Progress"
        description="mode 决定 spin / linear；tracked 只控制浅色连续轨道。"
      >
        <Column
          gap={1}
        >
          <Row
            gap={1.5}
            align="center"
            wrap
          >
            <Row
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
            </Row>

            <Row
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
            </Row>

            <Row
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
            </Row>

            <Row
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
            </Row>
          </Row>

          <Row
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
          </Row>
        </Column>
      </PlaygroundSection>
    </>
  )
}
