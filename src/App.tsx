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
  Button,
  Icon,
  Image,
  Input,
  Progress,
  Switch,
  Text,
  ThemeProvider,
  View,
  createTheme,
} from './index'

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


function DemoBox({ label }: { label: string }) {
  return (
    <View
      padding={1}
      radius="medium"
      background="#f4f4f5"
    >
      <Text typo="label-medium">{label}</Text>
    </View>
  )
}

function App() {
  const [progressHigh, setProgressHigh] = useState(false)
  const progress = progressHigh ? 0.82 : 0.28

  return (
    <View
      layout="grid"
      height="100vh"
      overflow="auto"
      align="start"
      padding={2}
    >
      <View
        width="fill"
        maxWidth={64}
        justifySelf="center"
        padding={2}
        gap={2}
        layout="flex"
        direction="column"
        radius="large"
        background="surface"
        shadow="medium"
      >
        <View layout="flex" direction="column" gap={0.5}>
          <Text
            typo="label-small"
            color="secondary"
            case="uppercase"
            letterSpacing="0.08em"
          >
            Weave playground
          </Text>
          <Text
            typo="display-large"
            viewProps={{
              role: 'heading',
              level: 1,
            }}
          >
            Weave
          </Text>
          <Text
            typo="body-medium"
            color="secondary"
            md={{
              typo: 'body-large',
              color: 'primary',
            }}
          >
            React UI framework development surface.
          </Text>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Viewport breakpoint
          </Text>
          <Text typo="body-small" color="secondary">
            窄窗口为纵向；达到 md（48rem）后变为横向并改变背景。
          </Text>

          <View
            layout="flex"
            direction="column"
            gap={0.75}
            padding={1}
            radius="medium"
            background="#fef2f2"
            md={{
              direction: 'row',
              background: '#eff6ff',
              padding: 1.5,
            }}
          >
            <DemoBox label="A" />
            <DemoBox label="B" />
            <DemoBox label="C" />
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Theme inheritance
          </Text>
          <Text typo="body-small" color="secondary">
            两块都使用 background="primary"；右侧只通过 mode="dark" 改变同一 token。
          </Text>

          <View layout="flex" direction="row" gap={0.75} wrap>
            <ThemeProvider theme={diagnosticTheme} mode="light">
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

            <ThemeProvider theme={diagnosticTheme} mode="dark">
              <View
                padding={1}
                radius="medium"
                background="primary"
                color="#18181b"
              >
                <Text typo="label-large">
                  Dark primary
                </Text>
              </View>
            </ThemeProvider>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Global typography
          </Text>
          <Text typo="body-small" color="secondary">
            ThemeProvider 提供 family / size / weight / line-height / letter-spacing 的全局继承基线；Text 和控件共享同一套 typography tokens。
          </Text>

          <View layout="flex" direction="column" gap={0.75}>
            <Text typo="display-large">Display large</Text>
            <Text typo="display-medium">Display medium</Text>
            <Text typo="display-small">Display small</Text>
            <Text typo="headline-large">Headline large</Text>
            <Text typo="headline-medium">Headline medium</Text>
            <Text typo="headline-small">Headline small</Text>
            <Text typo="title-large">Title large</Text>
            <Text typo="title-medium">Title medium</Text>
            <Text typo="title-small">Title small</Text>
            <Text typo="body-large">Body large</Text>
            <Text typo="body-medium">Body medium</Text>
            <Text typo="body-small">Body small</Text>
            <Text typo="label-large">Label large</Text>
            <Text typo="label-medium">Label medium</Text>
            <Text typo="label-small">Label small</Text>
            <Text
              typo="body-medium"
              viewProps={{
                style: {
                  fontFamily: 'var(--weave-typography-family-mono)',
                },
              }}
            >
              Mono family token — 0123456789
            </Text>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Image
          </Text>
          <Text typo="body-small" color="secondary">
            方形源图放进横向容器：contain 应完整显示并留空，cover 应填满并裁切；尺寸和圆角来自 viewProps。
          </Text>

          <View layout="flex" direction="row" gap={1} wrap>
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
          </View>

        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Icon
          </Text>
          <Text typo="body-small" color="secondary">
            Outline / Filled 由调用方传入的 Tabler 图标组件决定；size / stroke 由 Weave 统一，颜色和其他通用视觉继续走 viewProps。
          </Text>

          <View layout="flex" direction="column" gap={1}>
            <View layout="flex" direction="row" gap={1.5} align="center" wrap>
              <View layout="flex" direction="row" gap={0.75} align="center">
                <Icon
                  icon={IconSearch}
                  size="large"
                  stroke="regular"
                  viewProps={{ color: 'primary' }}
                />
                <Text typo="body-medium">Outline</Text>
              </View>

              <View layout="flex" direction="row" gap={0.75} align="center">
                <Icon
                  icon={IconSearchFilled}
                  size="large"
                  stroke="regular"
                  viewProps={{ color: 'primary' }}
                />
                <Text typo="body-medium">Filled</Text>
              </View>
            </View>

            <View layout="flex" direction="row" gap={1.5} align="center" wrap>
              <View layout="flex" direction="row" gap={0.5} align="center">
                <Icon
                  icon={IconSearch}
                  size="small"
                  stroke="thin"
                  viewProps={{ color: 'secondary' }}
                />
                <Text typo="body-medium">Small / thin</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Icon
                  icon={IconUser}
                  size="medium"
                  stroke="regular"
                  viewProps={{ color: 'primary' }}
                />
                <Text typo="body-medium">Medium / regular</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Icon
                  icon={IconBell}
                  size="large"
                  stroke="bold"
                  viewProps={{ color: 'success' }}
                />
                <Text typo="body-medium">Large / bold</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Icon
                  icon={IconSettings}
                  size="xlarge"
                  stroke="regular"
                  viewProps={{
                    color: 'danger',
                    label: 'Settings',
                  }}
                />
                <Text typo="body-medium">Xlarge / labelled</Text>
              </View>
            </View>

            <View layout="flex" direction="row" gap={0.75} align="center">
              <Icon
                size="large"
                stroke="regular"
                svg={
                  <svg viewBox="0 0 24 24" fill="none">
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
                viewProps={{ color: '#0f766e' }}
              />
              <Text typo="body-medium">
                Custom SVG
              </Text>
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Button
          </Text>
          <Text typo="body-small" color="secondary">
            Weave 的 tactile control 基准：hover 会抬起，按住会下沉并压缩，释放使用 spring 回弹；variant / size 仍可由主题和 breakpoint 覆盖。
          </Text>

          <View layout="flex" direction="column" gap={1}>
            <View layout="flex" direction="row" gap={0.75} align="center" wrap>
              <Button text="Primary" variant="primary" />
              <Button text="Secondary" variant="secondary" />
              <Button text="Tertiary" variant="tertiary" />
              <Button text="Ghost" variant="ghost" />
              <Button text="Danger" variant="danger" />
            </View>

            <View layout="flex" direction="row" gap={0.75} align="center" wrap>
              <Button text="Small" size="small" />
              <Button text="Medium" size="medium" />
              <Button text="Large" size="large" />
            </View>

            <View layout="flex" direction="row" gap={0.75} align="center" wrap>
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

              <Button text="Loading" loading />

              <Button variant="secondary">
                <Icon
                  icon={IconSettings}
                  size="small"
                  stroke="regular"
                />
                <Text typo="label-medium" weight="bold">Custom children</Text>
              </Button>
            </View>

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
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Input
          </Text>
          <Text typo="body-small" color="secondary">
            单行和多行共用同一个 Input；默认视觉来自 Input theme，multiline 内部滚动统一使用 Weave Scrollbar。
          </Text>

          <View layout="flex" direction="column" gap={0.75} maxWidth={32}>
            <Input
              placeholder="Name"
              autoComplete="name"
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
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Switch
          </Text>
          <Text typo="body-small" color="secondary">
            三档语义尺寸；hover 时 thumb 轻微增强，拖动时产生抓取反馈并直接跟手，释放后 spring 归位。
          </Text>

          <View layout="flex" direction="row" gap={1.5} align="center" wrap>
            <View layout="flex" direction="row" gap={0.5} align="center">
              <Switch size="small" />
              <Text typo="body-medium">Small</Text>
            </View>

            <View layout="flex" direction="row" gap={0.5} align="center">
              <Switch size="medium" defaultChecked />
              <Text typo="body-medium">Medium</Text>
            </View>

            <View layout="flex" direction="row" gap={0.5} align="center">
              <Switch size="large" />
              <Text typo="body-medium">Large</Text>
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Progress
          </Text>
          <Text typo="body-small" color="secondary">
            mode 决定 spin / linear；tracked 只控制浅色连续轨道。
          </Text>

          <View layout="flex" direction="column" gap={1}>
            <View layout="flex" direction="row" gap={1.5} align="center" wrap>
              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="spin"
                  size="medium"
                  color="primary"
                />
                <Text typo="body-medium">Spin</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="spin"
                  tracked
                  size="medium"
                  color="primary"
                />
                <Text typo="body-medium">Spin tracked</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="linear"
                  size="medium"
                  color="primary"
                />
                <Text typo="body-medium">Linear</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="linear"
                  tracked
                  size="medium"
                  color="primary"
                />
                <Text typo="body-medium">Linear tracked</Text>
              </View>
            </View>

            <View layout="flex" direction="row" gap={1.5} align="center" wrap>
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
                onChange={setProgressHigh}
                size="small"
              />

              <Text typo="body-medium">
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Scrollbar
          </Text>
          <Text typo="body-small" color="secondary">
            View overflow="auto" 自动挂载框架 Scrollbar；只绘制 thumb，透明命中区仍贴着真实边缘；圆角容器会自动预留角落安全区，让 thumb 只在直线边缘内运动。
          </Text>

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
            <View
              width={44}
              layout="flex"
              direction="column"
              gap={0.5}
              padding={1}
            >
              {Array.from({ length: 12 }, (_, index) => (
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
                    Scroll row {index + 1} — horizontal content width 44rem
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <Text
            typo="headline-small"
            viewProps={{
              role: 'heading',
              level: 2,
            }}
          >
            Container breakpoint
          </Text>
          <Text typo="body-small" color="secondary">
            拖动下面容器右下角改变它自己的宽度；达到 48rem 后内部切为横向。
          </Text>

          <View
            container="demo"
            className="container-demo"
            padding={1}
            radius="medium"
            border={0.0625}
            borderColor="outline"
          >
            <View
              layout="flex"
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
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default App
