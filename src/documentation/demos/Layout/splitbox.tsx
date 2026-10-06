import { useState } from 'react'
import {
  Button,
  Column,
  Row,
  SplitBox,
  type SplitBoxCollapsed,
  SplitBoxPane,
  Text,
} from '../../../index'

function Pane({ children }: { children: string }) {
  return (
    <Column width="fill" height="fill" background="surfaceHover" padding={1}>
      <Text>{children}</Text>
    </Column>
  )
}

export default function LayoutSplitboxDemo() {
  const [size, setSize] = useState<string>('40%')
  const [collapsed, setCollapsed] = useState<SplitBoxCollapsed>(false)

  return (
    <Column gap={2} width="fill">
      <Column gap={0.5}>
        <Text typo="label-medium">Uncontrolled horizontal split</Text>
        <SplitBox
          defaultSize="35%"
          minStart={8}
          maxStart="70%"
          minEnd={10}
          collapsible="both"
          collapseThreshold={2}
          expandThreshold={4}
          step={1}
          thickness={0.125}
          viewProps={{ width: 'fill', height: 10 }}
        >
          <SplitBoxPane>
            <Pane>Start pane</Pane>
          </SplitBoxPane>
          <SplitBoxPane>
            <Pane>End pane</Pane>
          </SplitBoxPane>
        </SplitBox>
      </Column>

      <Column gap={0.5}>
        <Text typo="label-medium">Vertical split with a disabled splitter</Text>
        <SplitBox
          direction="vertical"
          defaultSize={4}
          minStart={3}
          minEnd={3}
          disabled
          viewProps={{ width: 'fill', height: 10 }}
        >
          <SplitBoxPane>
            <Pane>Top pane</Pane>
          </SplitBoxPane>
          <SplitBoxPane>
            <Pane>Bottom pane</Pane>
          </SplitBoxPane>
        </SplitBox>
      </Column>

      <Column gap={0.5}>
        <Row gap={0.5} align="center" wrap>
          <Text typo="label-medium">Controlled split</Text>
          <Button
            text="Collapse start"
            size="small"
            variant="tertiary"
            viewProps={{ onClick: () => setCollapsed('start') }}
          />
          <Button
            text="Expand"
            size="small"
            variant="tertiary"
            viewProps={{ onClick: () => setCollapsed(false) }}
          />
        </Row>
        <Text typo="body-small" color="secondary">
          Start size: {size} · collapsed: {collapsed === false ? 'false' : collapsed}
        </Text>
        <SplitBox
          size={size}
          onChange={setSize}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          collapsible="both"
          viewProps={{ width: 'fill', height: 10 }}
        >
          <SplitBoxPane viewProps={{ scrollbar: { size: 'small' } }}>
            <Column background="surfaceHover" padding={1} gap={0.5}>
              {Array.from({ length: 8 }, (_, index) => (
                <Text key={index}>Scrollable item {index + 1}</Text>
              ))}
            </Column>
          </SplitBoxPane>
          <SplitBoxPane>
            <Pane>Controlled end pane</Pane>
          </SplitBoxPane>
        </SplitBox>
      </Column>
    </Column>
  )
}
