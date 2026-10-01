import { useState } from 'react'
import {
  Absolute,
  AppBar,
  Button,
  Column,
  Flex,
  Grid,
  Row,
  SplitBox,
  SplitBoxPane,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  View,
} from '../index'
import { DemoBox, PlaygroundSection } from './PlaygroundSection'

export function FoundationLayoutPlayground() {
  const [thresholdDemoSize, setThresholdDemoSize] = useState('35%')

  return (
    <>
      <PlaygroundSection
        title="AppBar"
        description="leading / title / trailing use slot margins · elevated controls raised surface · full / floating · small / medium / large."
      >
        <Column gap={1.25}>
          <AppBar
            size="small"
            leading={<Button text="Back" size="small" variant="ghost" />}
            title={<Text>Small · start</Text>}
            trailing={<Button text="More" size="small" variant="ghost" />}
          />
          <AppBar
            size="medium"
            mode="floating"
            elevated
            titleAlign="center"
            leading={<Button text="Menu" size="small" variant="ghost" />}
            title={<Text>Medium · floating · center</Text>}
            trailing={<Button text="Profile" size="small" variant="ghost" />}
          />
          <AppBar
            size="large"
            elevated
            titleAlign="end"
            leading={<Button text="Back" size="medium" variant="ghost" />}
            title={<Text>Large · end</Text>}
            trailing={
              <>
                <Button text="Share" size="medium" variant="ghost" />
                <Button text="Save" size="medium" variant="secondary" />
              </>
            }
          />
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Table"
        description="Static semantic table · Card surface · dense · selectable hierarchy · optional vertical borders · sticky header · horizontal scroll."
      >
        <Column gap={1}>
          <Table
            selectable
            dense
            verticalBorders
            stickyHeader
            viewProps={{ maxHeight: 12, overflowY: 'auto' }}
          >
            <TableHeader>
              <TableRow>
                <TableHead width={12}>Name</TableHead>
                <TableHead width={14}>Status</TableHead>
                <TableHead width={12} align="end">
                  Score
                </TableHead>
                <TableHead width={16}>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ['alice', 'Alice', 'Active', '92', 'Primary workspace'],
                ['bruno', 'Bruno', 'Review', '84', 'Pending approval'],
                ['cora', 'Cora', 'Active', '97', 'Owns reporting'],
                ['dina', 'Dina', 'Paused', '76', 'Back next week'],
                ['eli', 'Eli', 'Active', '89', 'Remote'],
              ].map(([id, name, status, score, notes]) => (
                <TableRow key={id} id={id}>
                  <TableCell id="name">{name}</TableCell>
                  <TableCell id="status">{status}</TableCell>
                  <TableCell id="score" align="end">
                    {score}
                  </TableCell>
                  <TableCell id="notes">{notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Column>
      </PlaygroundSection>

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
        title="SplitBox · collapse / expand thresholds"
        description="专门演示自动吸附折叠与自动展开。把 splitter 拖到 start 或 end 距边缘 ≤ 2rem，会立即吸附折叠；折叠后向外拖出 ≥ 4rem，会立即吸附展开到该侧合法最小尺寸 6rem，然后继续正常 resize。"
      >
        <Column gap={0.75} align="start">
          <Text typo="body-small" color="secondary">
            collapseThreshold = 2rem · expandThreshold = 4rem · minStart / minEnd = 6rem
          </Text>
          <Text typo="body-small" color="secondary">
            Current start size: {thresholdDemoSize}
          </Text>

          <SplitBox
            defaultSize="35%"
            minStart={6}
            minEnd={6}
            collapsible="both"
            collapseThreshold={2}
            expandThreshold={4}
            onChange={setThresholdDemoSize}
            viewProps={{
              width: 30,
              height: 12,
              border: 0.0625,
              borderColor: 'outline',
              borderStyle: 'dashed',
              data: { testid: 'splitbox-thresholds' },
            }}
          >
            <SplitBoxPane>
              <View width="fill" height="fill" padding={1} background="surfaceHover">
                <Text typo="label-medium">Start pane</Text>
              </View>
            </SplitBoxPane>
            <SplitBoxPane>
              <View width="fill" height="fill" padding={1}>
                <Text typo="label-medium">End pane</Text>
              </View>
            </SplitBoxPane>
          </SplitBox>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="SplitBox"
        description="双 Pane 可调整布局；N Pane 通过嵌套实现。Pane 本身没有 surface / padding / border 等默认视觉，示例中的视觉完全来自 Pane 内部的 View。"
      >
        <Column gap={1.5}>
          <SplitBox
            defaultSize="40%"
            thickness={0}
            minStart={5}
            minEnd={5}
            viewProps={{
              width: 30,
              height: 6,
              border: 0.0625,
              borderColor: 'outline',
              borderStyle: 'dashed',
              data: { testid: 'splitbox-zero-thickness' },
            }}
          >
            <SplitBoxPane>
              <View width="fill" height="fill" padding={1} background="surfaceHover">
                <Text typo="label-medium">Invisible splitter line</Text>
              </View>
            </SplitBoxPane>
            <SplitBoxPane>
              <View width="fill" height="fill" padding={1}>
                <Text typo="label-medium">Hit area remains draggable</Text>
              </View>
            </SplitBoxPane>
          </SplitBox>

          <SplitBox
            defaultSize="30%"
            viewProps={{
              width: 30,
              height: 12,
              border: 0.0625,
              borderColor: 'outline',
              borderStyle: 'dashed',
              data: { testid: 'splitbox-nested' },
            }}
          >
            <SplitBoxPane>
              <View width="fill" height="fill" padding={1} background="surfaceHover">
                <Text typo="label-medium">Pane 1</Text>
              </View>
            </SplitBoxPane>
            <SplitBoxPane>
              <SplitBox direction="vertical" defaultSize="50%">
                <SplitBoxPane>
                  <View width="fill" height="fill" padding={1}>
                    <Text typo="label-medium">Pane 2</Text>
                  </View>
                </SplitBoxPane>
                <SplitBoxPane>
                  <View width="fill" height="fill" padding={1} background="surfaceHover">
                    <Text typo="label-medium">Pane 3</Text>
                  </View>
                </SplitBoxPane>
              </SplitBox>
            </SplitBoxPane>
          </SplitBox>
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
