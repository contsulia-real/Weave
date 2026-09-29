import { IconArrowRight, IconPlus, IconSearchFilled, IconSettings } from '@tabler/icons-react'
import { useState } from 'react'
import { Badge, Button, Column, Icon, Link, Row, Text, ToolTip } from '../index'
import { PlaygroundSection } from './PlaygroundSection'

function BadgeMotionPlayground() {
  const [visible, setVisible] = useState(true)

  return (
    <Column gap={0.75} align="start">
      <Button
        text={visible ? 'Hide badges' : 'Show badges'}
        variant="secondary"
        viewProps={{
          onClick: () => setVisible((current) => !current),
        }}
      />

      <Row gap={2} align="center" wrap>
        <Badge text="8" visible={visible}>
          <Button text="Animated inbox" variant="secondary" />
        </Badge>

        <Badge dot placement="bottom-right" visible={visible}>
          <Button text="Animated status" variant="secondary" />
        </Badge>
      </Row>
    </Column>
  )
}

export function FoundationActionPlayground() {
  return (
    <>
      <PlaygroundSection
        title="Button"
        description="Weave 的 tactile control 基准：hover 会抬起，按住会下沉并压缩，释放使用 spring 回弹；variant / size 仍可由主题和 breakpoint 覆盖。"
      >
        <Column gap={1}>
          <Row gap={0.75} align="center" wrap>
            <Button text="Primary" variant="primary" />
            <Button text="Secondary" variant="secondary" />
            <Button text="Tertiary" variant="tertiary" />
            <Button text="Ghost" variant="ghost" />
            <Button text="Danger" variant="danger" />
          </Row>

          <Row gap={0.75} align="center" wrap>
            <Button text="Small" size="small" />
            <Button text="Medium" size="medium" />
            <Button text="Large" size="large" />
          </Row>

          <Row gap={0.75} align="center" wrap>
            <Button text="Add item" icon={IconPlus} iconPosition="start" variant="secondary" />

            <Button text="Continue" icon={IconArrowRight} iconPosition="end" />

            <Button
              icon={IconSearchFilled}
              variant="secondary"
              viewProps={{
                label: 'Search',
              }}
            />

            <Button text="Disabled" disabled />

            <Button text="Pressed" variant="secondary" pressed />

            <Button variant="secondary">
              <Icon icon={IconSettings} size="small" stroke="regular" />
              <Text typo="label-medium" weight="bold">
                Custom children
              </Text>
            </Button>
          </Row>

          <Button
            text="Responsive button"
            size="small"
            variant="secondary"
            md={{
              size: 'large',
              variant: 'primary',
            }}
            viewProps={{
              width: 'fit',
            }}
          />
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Badge"
        description="跟随被包裹组件的实际视觉边界定位，包括 hover / press / transform；默认 top-right。正常模式显示 text，dot 模式只显示小圆点。"
      >
        <Row gap={2} align="center" wrap>
          <Badge text="8">
            <Button text="Inbox" variant="secondary" />
          </Badge>

          <Badge text="New" placement="top-left">
            <Button text="Updates" variant="secondary" />
          </Badge>

          <Badge dot placement="bottom-right">
            <Button text="Online" variant="secondary" />
          </Badge>

          <Badge dot placement="right">
            <Button text="Status" variant="secondary" />
          </Badge>
        </Row>

        <Column gap={0.75}>
          <Text typo="label-medium" color="secondary">
            Popup direction: center → placement · dismiss: reverse
          </Text>
          <BadgeMotionPlayground />
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Link"
        description="真实 <a> 语义；text 可覆盖显示内容，默认末尾带 link icon；底部链接线按 45% → 60% → 80% 响应 rest / hover / active。"
      >
        <Column gap={1} align="start">
          <Link href="https://example.com/docs" target="_blank" />

          <Link href="https://example.com/docs" text="Documentation" target="_self" />

          <Link
            href="https://example.com/changelog"
            text="Changelog without icon"
            hideIcon
            target="_parent"
          />

          <Link
            href="https://example.com/changelog"
            text="Changelog on _top"
            hideIcon
            hideUnderline
            target="_top"
          />
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="ToolTip"
        description="hover 或 focus 后自动显示；定位和 tooltip layer 由框架处理，业务不创建 portal。"
      >
        <Row gap={1} align="center" wrap>
          <ToolTip content="Top tooltip" placement="top">
            <Button text="Top" variant="secondary" />
          </ToolTip>

          <ToolTip content="Bottom tooltip" placement="bottom">
            <Button text="Bottom" variant="secondary" />
          </ToolTip>

          <ToolTip content="Left tooltip" placement="left" delay={0}>
            <Button text="Left / instant" variant="secondary" />
          </ToolTip>

          <ToolTip
            placement="right"
            content={
              <Column gap={0.25}>
                <Text typo="label-small">Complex tooltip</Text>
                <Text typo="body-xsmall">View + Text content</Text>
              </Column>
            }
          >
            <Button text="Right / complex" variant="secondary" />
          </ToolTip>
        </Row>
      </PlaygroundSection>
    </>
  )
}
