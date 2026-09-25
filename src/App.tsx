import { useState } from 'react'
import {
  IconBell,
  IconSearch,
  IconSettings,
  IconUser,
} from '@tabler/icons-react'
import {
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
      <strong>{label}</strong>
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
          <p className="eyebrow">Weave playground</p>
          <h1>Weave</h1>
          <Text
            size="small"
            color="secondary"
            md={{
              size: 'large',
              color: 'primary',
            }}
          >
            React UI framework development surface.
          </Text>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <h2>Viewport breakpoint</h2>
          <p className="hint">
            窄窗口为纵向；达到 md（48rem）后变为横向并改变背景。
          </p>

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
          <h2>Theme inheritance</h2>
          <p className="hint">
            两块都使用 background="primary"；右侧只通过 mode="dark" 改变同一 token。
          </p>

          <View layout="flex" direction="row" gap={0.75} wrap>
            <ThemeProvider theme={diagnosticTheme} mode="light">
              <View
                padding={1}
                radius="medium"
                background="primary"
                color="onPrimary"
              >
                Light primary
              </View>
            </ThemeProvider>

            <ThemeProvider theme={diagnosticTheme} mode="dark">
              <View
                padding={1}
                radius="medium"
                background="primary"
                color="#18181b"
              >
                Dark primary
              </View>
            </ThemeProvider>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <h2>Image</h2>
          <p className="hint">
            方形源图放进横向容器：contain 应完整显示并留空，cover 应填满并裁切；尺寸和圆角来自 viewProps。
          </p>

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
          <h2>Icon</h2>
          <p className="hint">
            Tabler 图标由调用方静态导入后传给 Icon；size / stroke 由 Weave 统一，颜色和其他通用视觉继续走 viewProps。
          </p>

          <View layout="flex" direction="column" gap={1}>
            <View layout="flex" direction="row" gap={1.5} align="center" wrap>
              <View layout="flex" direction="row" gap={0.5} align="center">
                <Icon
                  icon={IconSearch}
                  size="small"
                  stroke="thin"
                  viewProps={{ color: 'secondary' }}
                />
                <Text size="small">Small / thin</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Icon
                  icon={IconUser}
                  size="medium"
                  stroke="regular"
                  viewProps={{ color: 'primary' }}
                />
                <Text size="small">Medium / regular</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Icon
                  icon={IconBell}
                  size="large"
                  stroke="bold"
                  viewProps={{ color: 'success' }}
                />
                <Text size="small">Large / bold</Text>
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
                <Text size="small">Xlarge / labelled</Text>
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
              <Text size="small">
                Custom SVG
              </Text>
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <h2>Input</h2>
          <p className="hint">
            单行和多行共用同一个 Input；布局与视觉继续通过 viewProps。
          </p>

          <View layout="flex" direction="column" gap={0.75} maxWidth={32}>
            <Input
              placeholder="Name"
              autoComplete="name"
              viewProps={{
                width: 'fill',
                padding: 0.75,
                border: 0.0625,
                borderColor: 'outline',
                radius: 'medium',
                background: 'surface',
              }}
            />

            <Input
              multiline
              rows={4}
              placeholder="Notes"
              viewProps={{
                width: 'fill',
                padding: 0.75,
                border: 0.0625,
                borderColor: 'outline',
                radius: 'medium',
                background: 'surface',
              }}
            />
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <h2>Switch</h2>
          <p className="hint">
            三档语义尺寸；支持鼠标与键盘切换，状态通过 role="switch" 与 aria-checked 暴露。
          </p>

          <View layout="flex" direction="row" gap={1.5} align="center" wrap>
            <View layout="flex" direction="row" gap={0.5} align="center">
              <Switch size="small" />
              <Text size="small">Small</Text>
            </View>

            <View layout="flex" direction="row" gap={0.5} align="center">
              <Switch size="medium" defaultChecked />
              <Text size="small">Medium</Text>
            </View>

            <View layout="flex" direction="row" gap={0.5} align="center">
              <Switch size="large" />
              <Text size="small">Large</Text>
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <h2>Progress</h2>
          <p className="hint">
            mode 决定 spin / linear；tracked 只控制浅色连续轨道。
          </p>

          <View layout="flex" direction="column" gap={1}>
            <View layout="flex" direction="row" gap={1.5} align="center" wrap>
              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="spin"
                  size="medium"
                  color="primary"
                />
                <Text size="small">Spin</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="spin"
                  tracked
                  size="medium"
                  color="primary"
                />
                <Text size="small">Spin tracked</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="linear"
                  size="medium"
                  color="primary"
                />
                <Text size="small">Linear</Text>
              </View>

              <View layout="flex" direction="row" gap={0.5} align="center">
                <Progress
                  undetermined
                  mode="linear"
                  tracked
                  size="medium"
                  color="primary"
                />
                <Text size="small">Linear tracked</Text>
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

              <Text size="small">
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <h2>Scrollbar</h2>
          <p className="hint">
            View overflow="auto" 自动挂载框架 Scrollbar；滚动仍由浏览器原生 scrollTop / scrollLeft 驱动。
          </p>

          <View
            width={28}
            height={10}
            overflow="auto"
            border={0.0625}
            borderColor="outline"
            radius="medium"
            scrollbar={{
              size: 'medium',
              tracked: true,
              color: 'primary',
              trackColor: 'surfaceHover',
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
                  Scroll row {index + 1} — horizontal content width 44rem
                </View>
              ))}
            </View>
          </View>
        </View>

        <View layout="flex" direction="column" gap={0.75}>
          <h2>Container breakpoint</h2>
          <p className="hint">
            拖动下面容器右下角改变它自己的宽度；达到 48rem 后内部切为横向。
          </p>

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
