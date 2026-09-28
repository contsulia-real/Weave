import { useState } from 'react'
import {
  IconArrowRight,
  IconBell,
  IconPlus,
  IconSearch,
  IconSearchFilled,
  IconSettings,
  IconUser,
} from '@tabler/icons-react'
import {
  Absolute,
  Badge,
  Button,
  Column,
  Flex,
  Grid,
  Icon,
  Image,
  Link,
  Presence,
  Row,
  Stack,
  Text,
  ThemeProvider,
  ToolTip,
  View,
  createTheme,
} from '../index'
import {
  DemoBox,
  PlaygroundSection,
} from './PlaygroundSection'

const diagnosticImage =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#7c3aed" />
          <stop offset="1" stop-color="#38bdf8" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" rx="28" fill="url(#g)" />
      <circle cx="55" cy="55" r="26" fill="#ffffff" opacity=".9" />
      <circle cx="265" cy="55" r="26" fill="#ffffff" opacity=".55" />
      <rect x="34" y="235" width="252" height="50" rx="14" fill="#ffffff" opacity=".78" />
      <path d="M38 218 112 132l48 48 42-42 80 80H38Z" fill="#ffffff" opacity=".7" />
      <text x="160" y="302" text-anchor="middle" font-family="system-ui" font-size="18" fill="#ffffff">
        FULL IMAGE
      </text>
    </svg>
  `)

const diagnosticTheme = createTheme({
  tokens: {
    color: {
      primary: '#7c3aed',
    },
  },
  modes: {
    dark: {
      tokens: {
        color: {
          primary: '#c4b5fd',
        },
      },
    },
  },
})

function LayoutAnimationPlayground() {
  const [alternate, setAlternate] = useState(false)
  const order = alternate
    ? ['C', 'B', 'A'] as const
    : ['A', 'B', 'C'] as const

  return (
    <Column gap={0.75} align="start">
      <Button
        text={alternate ? 'Reset layout' : 'Reorder + resize'}
        variant="secondary"
        viewProps={{
          onClick: () => setAlternate((current) => !current),
        }}
      />

      <Row
        width={26}
        minHeight={6}
        gap={0.75}
        align="center"
        padding={0.75}
        outlineWidth={0.0625}
        outlineColor="outline"
        outlineStyle="dashed"
        radius="medium"
      >
        {order.map((label) => (
          <Column
            key={label}
            width={
              label === 'B'
                ? alternate ? 9 : 5
                : 5
            }
            height={4}
            align="center"
            justify="center"
            radius="medium"
            background={label === 'B' ? 'primary' : 'surfaceHover'}
            color={label === 'B' ? 'onPrimary' : 'tertiary'}
            shadow="small"
            layoutAnimation={{
              spring: 'snappy',
              interruption: 'continue',
            }}
          >
            <Text typo="label-medium">{label}</Text>
          </Column>
        ))}
      </Row>
    </Column>
  )
}

function AdvancedMotionPlayground() {
  return (
    <Row gap={1.25} wrap align="center">
      <Column
        width={10}
        height={5}
        align="center"
        justify="center"
        radius="medium"
        background="surfaceHover"
        transition={{
          properties: ['transform'],
          spring: 'snappy',
        }}
        hover={{ scale: 1.14, translateY: -0.25 }}
      >
        <Text typo="label-medium">Hover · spring</Text>
      </Column>

      <Column
        width={10}
        height={5}
        align="center"
        justify="center"
        radius="medium"
        background="primary"
        color="onPrimary"
        animation={{
          keyframes: [
            { at: 0, scale: 0.94, opacity: 0.65 },
            { at: 0.55, scale: 1.08, opacity: 1 },
            { at: 1, scale: 1, opacity: 0.82 },
          ],
          duration: 700,
          repeat: 'infinite',
          repeatDelay: 180,
          direction: 'alternate',
          curve: 'emphasized',
        }}
      >
        <Text typo="label-medium">Keyframes · repeat</Text>
      </Column>

      <Column
        width={10}
        height={5}
        align="center"
        justify="center"
        radius="medium"
        background="surfaceHover"
        animation="pulse"
      >
        <Text typo="label-medium">Theme · pulse</Text>
      </Column>
    </Row>
  )
}

function StaggerPlayground() {
  const [run, setRun] = useState(0)

  return (
    <Column gap={0.75} align="start">
      <Button
        text="Replay stagger"
        variant="secondary"
        viewProps={{ onClick: () => setRun((value) => value + 1) }}
      />

      <Row
        key={run}
        gap={0.75}
        padding={0.75}
        radius="medium"
        outlineWidth={0.0625}
        outlineColor="outline"
        outlineStyle="dashed"
        enter={{
          animation: 'fade-up',
          children: {
            stagger: 90,
            delay: 80,
            from: 'first',
          },
          spring: 'snappy',
        }}
      >
        {['A', 'B', 'C', 'D'].map((label) => (
          <Column
            key={label}
            width={4}
            height={3}
            align="center"
            justify="center"
            radius="medium"
            background={label === 'C' ? 'primary' : 'surfaceHover'}
            color={label === 'C' ? 'onPrimary' : 'tertiary'}
          >
            <Text typo="label-medium">{label}</Text>
          </Column>
        ))}
      </Row>
    </Column>
  )
}

function InterruptionPlayground() {
  const [alternate, setAlternate] = useState(false)
  const target = alternate ? 8 : 0

  return (
    <Column gap={0.75} align="start">
      <Button
        text="Retarget all"
        variant="secondary"
        viewProps={{
          onClick: () => setAlternate((current) => !current),
        }}
      />

      <Column gap={0.75}>
        {(['continue', 'restart', 'finish'] as const).map((mode) => (
          <Row key={mode} gap={0.75} align="center">
            <Text typo="label-medium" viewProps={{ width: 5.5 }}>
              {mode}
            </Text>
            <Row
              width={18}
              height={3.5}
              align="center"
              paddingX={0.5}
              radius="medium"
              background="surfaceHover"
            >
              <Column
                width={3}
                height={2.25}
                align="center"
                justify="center"
                radius="medium"
                background={mode === 'continue' ? 'primary' : 'tertiary'}
                color={mode === 'continue' ? 'onPrimary' : 'surface'}
                animation={{
                  keyframes: [
                    { translateX: target === 0 ? 8 : 0, scale: 0.94 },
                    { translateX: target, scale: 1 },
                  ],
                  duration: 1100,
                  curve: 'emphasized',
                  interruption: mode,
                }}
              >
                <Text typo="label-small">{mode[0].toUpperCase()}</Text>
              </Column>
            </Row>
          </Row>
        ))}
      </Column>
    </Column>
  )
}

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

function EnterExitPlayground() {
  const [present, setPresent] = useState(true)

  return (
    <Column gap={0.75} align="start">
      <Button
        text={present ? 'Run exit' : 'Run enter'}
        variant="secondary"
        viewProps={{
          onClick: () => setPresent((current) => !current),
        }}
      />

      <Column
        width={16}
        height={7}
        align="center"
        justify="center"
        outlineWidth={0.0625}
        outlineColor="outline"
        outlineStyle="dashed"
        radius="medium"
      >
        <Presence present={present}>
          <Column
            width={11}
            height={4}
            align="center"
            justify="center"
            radius="medium"
            background="primary"
            color="onPrimary"
            shadow="small"
            enter="fade-up"
            exit="fade-down"
          >
            <Text typo="label-medium">Presence child</Text>
          </Column>
        </Presence>
      </Column>
    </Column>
  )
}

export function FoundationPlayground() {
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

          <Absolute
            width={8}
            height={4}
            radius="medium"
            background="surfaceHover"
          >
            <View
              top={0.5}
              right={0.5}
              width={2}
              height={2}
              radius="full"
              background="primary"
            />
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

      <PlaygroundSection
        title="Motion · transition"
        description="ViewProps transition 使用主题 motion token；hover 状态由浏览器原生 CSS transition 插值。右侧 reducedMotion=reduce 直接跳到最终状态。"
      >
        <Row gap={1.5} wrap align="center">
          <Column
            width={9}
            height={5}
            align="center"
            justify="center"
            radius="medium"
            background="surfaceHover"
            transition="slow"
            hover={{
              scale: 1.08,
              background: 'primary',
              color: 'onPrimary',
            }}
          >
            <Text typo="label-medium">Hover · slow</Text>
          </Column>

          <Column
            width={9}
            height={5}
            align="center"
            justify="center"
            radius="medium"
            background="surfaceHover"
            transition={{
              properties: ['transform', 'opacity'],
              duration: 240,
              delay: 40,
              curve: [0.22, 1, 0.36, 1],
            }}
            hover={{
              translateY: -0.25,
              scale: 1.04,
              opacity: 0.72,
            }}
          >
            <Text typo="label-medium">Precise · 240ms</Text>
          </Column>

          <ThemeProvider reducedMotion="reduce">
            <Column
              width={9}
              height={5}
              align="center"
              justify="center"
              radius="medium"
              background="surfaceHover"
              transition="slow"
              hover={{
                scale: 1.08,
                background: 'primary',
                color: 'onPrimary',
              }}
            >
              <Text typo="label-medium">Reduced · instant</Text>
            </Column>
          </ThemeProvider>
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · enter / exit"
        description="enter 直接在挂载时运行；Presence 不增加 DOM，并在 present=false 后保留子树直到 exit 完成再真正卸载。"
      >
        <EnterExitPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · layout animation"
        description="三个 keyed 子项都启用 FLIP。切换时 A / C 重排，B 同时改变宽度；连续点击会从当前视觉位置重新接管，不排动画队列。"
      >
        <LayoutAnimationPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · spring / keyframes / repeat"
        description="物理 spring 使用求解后的 natural duration + linear()；keyframes 支持 at、repeat、repeatDelay、direction，也可以直接读取主题 animation preset。"
      >
        <AdvancedMotionPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · stagger"
        description="父 ViewHost 直接编排 direct ViewHost children。Replay 后 A → B → C → D 按 spring fade-up 依次入场。"
      >
        <StaggerPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Motion · interruption"
        description="连续点击 Retarget all：continue 从当前视觉值接管；restart 从新动画起点重来；finish 先完成当前 cycle，再只执行最新目标。"
      >
        <InterruptionPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Theme inheritance"
        description='两块都使用 background="primary"；右侧只通过 mode="dark" 改变同一 token。'
      >
        <Row
          gap={0.75}
          wrap
        >
          <ThemeProvider
            theme={diagnosticTheme}
            mode="light"
          >
            <View
              padding={1}
              radius="medium"
              background="primary"
              color="onPrimary"
            >
              <Text typo="label-large">
                Light primary
              </Text>
            </View>
          </ThemeProvider>

          <ThemeProvider
            theme={diagnosticTheme}
            mode="dark"
          >
            <View
              padding={1}
              radius="medium"
              background="primary"
              color="onPrimary"
            >
              <Text typo="label-large">
                Dark primary
              </Text>
            </View>
          </ThemeProvider>
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Global typography"
        description="ThemeProvider 默认建立 body-large 排版上下文；Text、Button、Input 都从同一套 typography.styles / typo 取完整字号、字重、行高与字距。"
      >
        <Column
          gap={0.75}
        >
          <Text typo="display-large">
            Display large
          </Text>
          <Text typo="display-medium">
            Display medium
          </Text>
          <Text typo="display-small">
            Display small
          </Text>
          <Text typo="headline-large">
            Headline large
          </Text>
          <Text typo="headline-medium">
            Headline medium
          </Text>
          <Text typo="headline-small">
            Headline small
          </Text>
          <Text typo="title-large">
            Title large
          </Text>
          <Text typo="title-medium">
            Title medium
          </Text>
          <Text typo="title-small">
            Title small
          </Text>
          <Text typo="body-large">
            Body large
          </Text>
          <Text typo="body-medium">
            Body medium
          </Text>
          <Text typo="body-small">
            Body small
          </Text>
          <Text typo="label-large">
            Label large
          </Text>
          <Text typo="label-medium">
            Label medium
          </Text>
          <Text typo="label-small">
            Label small
          </Text>
          <Text
            typo="body-medium"
            viewProps={{
              style: {
                fontFamily:
                  'var(--weave-typography-family-mono)',
              },
            }}
          >
            Mono family token — 0123456789
          </Text>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Image"
        description="方形源图放进横向容器：contain 应完整显示并留空，cover 应填满并裁切；尺寸和圆角来自 viewProps。"
      >
        <Row
          gap={1}
          wrap
        >
          <Image
            src={diagnosticImage}
            alt="Weave gradient diagnostic"
            fit="contain"
            viewProps={{
              width: 14,
              height: 8,
              background: '#f4f4f5',
            }}
          />

          <Image
            src={diagnosticImage}
            alt="Weave gradient diagnostic"
            fit="cover"
            position="center"
            viewProps={{
              width: 14,
              height: 8,
            }}
          />
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Mask"
        description="Mask 是 ViewProps 通用视觉能力。左侧保留原图作为对照；中间用结构化 Gradient 从透明渐入；右侧直接使用原生 CSS mask-image 字符串形成径向遮罩。"
      >
        <Row
          gap={1}
          wrap
          align="start"
        >
          <Column gap={0.5}>
            <Text typo="label-medium" color="secondary">
              Original
            </Text>
            <Image
              src={diagnosticImage}
              alt="Unmasked Weave diagnostic"
              fit="cover"
              viewProps={{
                width: 14,
                height: 8,
                radius: 'medium',
              }}
            />
          </Column>

          <Column gap={0.5}>
            <Text typo="label-medium" color="secondary">
              Gradient object
            </Text>
            <Image
              src={diagnosticImage}
              alt="Weave diagnostic with linear gradient mask"
              fit="cover"
              viewProps={{
                width: 14,
                height: 8,
                radius: 'medium',
                mask: {
                  type: 'linear',
                  angle: 90,
                  stops: [
                    ['transparent', 0],
                    ['black', 0.45],
                    ['black', 1],
                  ],
                },
              }}
            />
          </Column>

          <Column gap={0.5}>
            <Text typo="label-medium" color="secondary">
              CSS radial mask
            </Text>
            <Image
              src={diagnosticImage}
              alt="Weave diagnostic with radial CSS mask"
              fit="cover"
              viewProps={{
                width: 14,
                height: 8,
                radius: 'medium',
                mask:
                  'radial-gradient(circle at center, black 0 42%, transparent 72%)',
              }}
            />
          </Column>
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Icon"
        description="Outline / Filled 由调用方传入的 Tabler 图标组件决定；size / stroke 由 Weave 统一，颜色和其他通用视觉继续走 viewProps。"
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
              gap={0.75}
              align="center"
            >
              <Icon
                icon={IconSearch}
                size="large"
                stroke="regular"
                viewProps={{
                  color: 'primary',
                }}
              />
              <Text typo="body-medium">
                Outline
              </Text>
            </Row>

            <Row
              gap={0.75}
              align="center"
            >
              <Icon
                icon={IconSearchFilled}
                size="large"
                stroke="regular"
                viewProps={{
                  color: 'primary',
                }}
              />
              <Text typo="body-medium">
                Filled
              </Text>
            </Row>
          </Row>

          <Row
            gap={1.5}
            align="center"
            wrap
          >
            <Row
              gap={0.5}
              align="center"
            >
              <Icon
                icon={IconSearch}
                size="small"
                stroke="thin"
                viewProps={{
                  color: 'secondary',
                }}
              />
              <Text typo="body-medium">
                Small / thin
              </Text>
            </Row>

            <Row
              gap={0.5}
              align="center"
            >
              <Icon
                icon={IconUser}
                size="medium"
                stroke="regular"
                viewProps={{
                  color: 'primary',
                }}
              />
              <Text typo="body-medium">
                Medium / regular
              </Text>
            </Row>

            <Row
              gap={0.5}
              align="center"
            >
              <Icon
                icon={IconBell}
                size="large"
                stroke="bold"
                viewProps={{
                  color: 'success',
                }}
              />
              <Text typo="body-medium">
                Large / bold
              </Text>
            </Row>

            <Row
              gap={0.5}
              align="center"
            >
              <Icon
                icon={IconSettings}
                size="xlarge"
                stroke="regular"
                viewProps={{
                  color: 'danger',
                  label: 'Settings',
                }}
              />
              <Text typo="body-medium">
                Xlarge / labelled
              </Text>
            </Row>
          </Row>

          <Row
            gap={0.75}
            align="center"
          >
            <Icon
              size="large"
              stroke="regular"
              svg={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                  />
                  <path
                    d="M8 12h8M12 8v8"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              }
              viewProps={{
                color: '#0f766e',
              }}
            />
            <Text typo="body-medium">
              Custom SVG
            </Text>
          </Row>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Button"
        description="Weave 的 tactile control 基准：hover 会抬起，按住会下沉并压缩，释放使用 spring 回弹；variant / size 仍可由主题和 breakpoint 覆盖。"
      >
        <Column
          gap={1}
        >
          <Row
            gap={0.75}
            align="center"
            wrap
          >
            <Button
              text="Primary"
              variant="primary"
            />
            <Button
              text="Secondary"
              variant="secondary"
            />
            <Button
              text="Tertiary"
              variant="tertiary"
            />
            <Button
              text="Ghost"
              variant="ghost"
            />
            <Button
              text="Danger"
              variant="danger"
            />
          </Row>

          <Row
            gap={0.75}
            align="center"
            wrap
          >
            <Button
              text="Small"
              size="small"
            />
            <Button
              text="Medium"
              size="medium"
            />
            <Button
              text="Large"
              size="large"
            />
          </Row>

          <Row
            gap={0.75}
            align="center"
            wrap
          >
            <Button
              text="Add item"
              icon={IconPlus}
              iconPosition="start"
              variant="secondary"
            />

            <Button
              text="Continue"
              icon={IconArrowRight}
              iconPosition="end"
            />

            <Button
              icon={IconSearchFilled}
              variant="secondary"
              viewProps={{
                label: 'Search',
              }}
            />

            <Button
              text="Disabled"
              disabled
            />

            <Button
              text="Pressed"
              variant="secondary"
              pressed
            />

            <Button variant="secondary">
              <Icon
                icon={IconSettings}
                size="small"
                stroke="regular"
              />
              <Text
                typo="label-medium"
                weight="bold"
              >
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
        <Row
          gap={2}
          align="center"
          wrap
        >
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
            Popup / dismiss
          </Text>
          <BadgeMotionPlayground />
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Link"
        description="真实 <a> 语义；text 可覆盖显示内容，默认末尾带 link icon；底部链接线按 45% → 60% → 80% 响应 rest / hover / active。"
      >
        <Column
          gap={1}
          align="start"
        >
          <Link href="https://example.com/docs" target="_blank" />

          <Link
            href="https://example.com/docs"
            text="Documentation"
            target="_self"
          />

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
        <Row
          gap={1}
          align="center"
          wrap
        >
          <ToolTip
            content="Top tooltip"
            placement="top"
          >
            <Button
              text="Top"
              variant="secondary"
            />
          </ToolTip>

          <ToolTip
            content="Bottom tooltip"
            placement="bottom"
          >
            <Button
              text="Bottom"
              variant="secondary"
            />
          </ToolTip>

          <ToolTip
            content="Left tooltip"
            placement="left"
            delay={0}
          >
            <Button
              text="Left / instant"
              variant="secondary"
            />
          </ToolTip>

          <ToolTip
            placement="right"
            content={
              <Column
                gap={0.25}
              >
                <Text typo="label-small">
                  Complex tooltip
                </Text>
                <Text typo="body-xsmall">
                  View + Text content
                </Text>
              </Column>
            }
          >
            <Button
              text="Right / complex"
              variant="secondary"
            />
          </ToolTip>
        </Row>
      </PlaygroundSection>
    </>
  )
}
