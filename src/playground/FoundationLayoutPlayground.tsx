import { Absolute, Column, Flex, Grid, Row, Stack, Text, View } from '../index'
import { DemoBox, PlaygroundSection } from './PlaygroundSection'

export function FoundationLayoutPlayground() {
  return (
    <>
      <PlaygroundSection
        title="Layout components"
        description="正式布局入口仍复用 View 底层：Flex / Row / Column / Grid / Stack / Absolute，不增加额外 DOM。"
      >
        <Column gap={1.25}>
          <Column gap={0.5} align="start">
            <Text typo="label-medium" color="secondary">
              Flex · wrap
            </Text>

            <Flex
              width={14}
              gap={0.5}
              wrap
              padding={0.5}
              align="center"
              outlineWidth={0.0625}
              outlineColor="outline"
              outlineStyle="dashed"
            >
              {['F1', 'F2', 'F3', 'F4', 'F5'].map((label) => (
                <View
                  key={label}
                  width={4}
                  padding={0.75}
                  radius="medium"
                  background="surfaceHover"
                >
                  <Text typo="label-medium">{label}</Text>
                </View>
              ))}
            </Flex>
          </Column>

          <Column gap={0.5} align="start">
            <Text typo="label-medium" color="secondary">
              Column · end / space-between
            </Text>

            <Column
              width={10}
              height={14}
              padding={0.5}
              align="end"
              justify="space-between"
              outlineWidth={0.0625}
              outlineColor="outline"
              outlineStyle="dashed"
            >
              {['Top', 'Middle', 'Bottom'].map((label) => (
                <View
                  key={label}
                  width={4.5}
                  padding={0.75}
                  radius="medium"
                  background="color-mix(in srgb, var(--weave-color-primary) 12%, var(--weave-color-surface))"
                >
                  <Text typo="label-medium">{label}</Text>
                </View>
              ))}
            </Column>
          </Column>

          <Row gap={0.75} wrap>
            <DemoBox label="Row A" />
            <DemoBox label="Row B" />
            <DemoBox label="Row C" />
          </Row>

          <Grid columns={3} gap={0.75}>
            <DemoBox label="Grid 1" />
            <DemoBox label="Grid 2" />
            <DemoBox label="Grid 3" />
          </Grid>

          <Stack
            width={8}
            height={4}
            align="center"
            justify="center"
            outlineWidth={0.0625}
            outlineColor="outline"
            outlineStyle="dashed"
          >
            <View
              width="fill"
              height="fill"
              radius="medium"
              background="color-mix(in srgb, var(--weave-color-primary) 10%, var(--weave-color-surface))"
              data={{ testid: 'stack-fill-layer' }}
            />

            <View
              width={4}
              height={2}
              alignSelf="center"
              justifySelf="center"
              radius="medium"
              background="primary"
              shadow="small"
              data={{ testid: 'stack-middle-layer' }}
            />

            <Text
              typo="label-medium"
              color="onPrimary"
              viewProps={{
                alignSelf: 'center',
                justifySelf: 'center',
                data: {
                  testid: 'stack-top-layer',
                },
              }}
            >
              Stack
            </Text>
          </Stack>

          <Absolute width={8} height={4} radius="medium" background="surfaceHover">
            <View top={0.5} right={0.5} width={2} height={2} radius="full" background="primary" />
          </Absolute>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Viewport breakpoint"
        description="窄窗口为纵向；达到 md（48rem）后变为横向并改变背景。"
      >
        <Flex
          direction="column"
          gap={0.75}
          padding={1}
          radius="medium"
          background="color-mix(in srgb, var(--weave-color-danger) 8%, var(--weave-color-surface))"
          md={{
            direction: 'row',
            background:
              'color-mix(in srgb, var(--weave-color-primary) 8%, var(--weave-color-surface))',
            padding: 1.5,
          }}
        >
          <DemoBox label="A" />
          <DemoBox label="B" />
          <DemoBox label="C" />
        </Flex>
      </PlaygroundSection>
    </>
  )
}
