import { IconBell, IconSearch, IconSearchFilled, IconSettings, IconUser } from '@tabler/icons-react'
import { Column, createTheme, Icon, Image, Key, Row, Text, ThemeProvider, View } from '../index'
import { PlaygroundSection } from './PlaygroundSection'

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

const keyRows = [
  [
    'Esc',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'PrintScreen',
    'ScrollLock',
    'Pause',
  ],
  ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Fn', 'Meta', 'Alt', 'Space', 'Alt', 'Meta', 'Menu', 'Ctrl'],
] as const

const navigationKeys = [
  'Insert',
  'Home',
  'PageUp',
  'Delete',
  'End',
  'PageDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight',
] as const

const numpadKeys = [
  'NumLock',
  '/',
  '*',
  '-',
  '7',
  '8',
  '9',
  '+',
  '4',
  '5',
  '6',
  '1',
  '2',
  '3',
  'Enter',
  '0',
  '.',
] as const

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

export function FoundationVisualPlayground() {
  return (
    <>
      <PlaygroundSection
        title="Theme inheritance"
        description='两块都使用 background="primary"；右侧只通过 mode="dark" 改变同一 token。'
      >
        <Row gap={0.75} wrap>
          <ThemeProvider theme={diagnosticTheme} mode="light">
            <View padding={1} radius="medium" background="primary" color="onPrimary">
              <Text typo="label-large">Light primary</Text>
            </View>
          </ThemeProvider>

          <ThemeProvider theme={diagnosticTheme} mode="dark">
            <View padding={1} radius="medium" background="primary" color="onPrimary">
              <Text typo="label-large">Dark primary</Text>
            </View>
          </ThemeProvider>
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Global typography"
        description="ThemeProvider 默认建立 body-large 排版上下文；Text、Button、Input 都从同一套 typography.styles / typo 取完整字号、字重、行高与字距。"
      >
        <Column gap={0.75}>
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
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Image"
        description="方形源图放进横向容器：contain 应完整显示并留空，cover 应填满并裁切；尺寸和圆角来自 viewProps。"
      >
        <Row gap={1} wrap>
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
        <Row gap={1} wrap align="start">
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
                mask: 'radial-gradient(circle at center, black 0 42%, transparent 72%)',
              }}
            />
          </Column>
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Key"
        description="完整键盘展示：能由 Tabler 准确表达的键优先用大号图标，其余保留文字；所有 Key 只展示 Button 的静态实体样式，不响应 hover / press。"
      >
        <Column gap={1}>
          <Column gap={0.5}>
            {keyRows.map((row, rowIndex) => (
              <Row key={rowIndex} gap={0.375} align="center" wrap>
                {row.map((key, keyIndex) => (
                  <Key
                    key={key + keyIndex}
                    value={key}
                    viewProps={
                      key === 'Space'
                        ? {
                            width: 9,
                          }
                        : undefined
                    }
                  />
                ))}
              </Row>
            ))}
          </Column>

          <Column gap={0.5}>
            <Text typo="label-small" color="secondary">
              Navigation
            </Text>
            <Row gap={0.375} align="center" wrap>
              {navigationKeys.map((key) => (
                <Key key={key} value={key} />
              ))}
            </Row>
          </Column>

          <Column gap={0.5}>
            <Text typo="label-small" color="secondary">
              Numpad
            </Text>
            <Row gap={0.375} align="center" wrap>
              {numpadKeys.map((key, index) => (
                <Key key={key + index} value={key} />
              ))}
            </Row>
          </Column>

          <Column gap={0.5}>
            <Text typo="label-small" color="secondary">
              Platform variants
            </Text>
            <Row gap={0.375} align="center" wrap>
              <Key value="meta" />
              <Key value="meta" metaKey="command" />
              <Key value="meta" metaKey="windows" />
              <Key value="meta" metaKey="meta" />
              <Key value="option" />
              <Key value="alt" />
              <Key value="fn" />
              <Key value="Shift" />
            </Row>
          </Column>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Icon"
        description="Outline / Filled 由调用方传入的 Tabler 图标组件决定；size / stroke 由 Weave 统一，颜色和其他通用视觉继续走 viewProps。"
      >
        <Column gap={1}>
          <Row gap={1.5} align="center" wrap>
            <Row gap={0.75} align="center">
              <Icon
                icon={IconSearch}
                size="large"
                stroke="regular"
                viewProps={{
                  color: 'primary',
                }}
              />
              <Text typo="body-medium">Outline</Text>
            </Row>

            <Row gap={0.75} align="center">
              <Icon
                icon={IconSearchFilled}
                size="large"
                stroke="regular"
                viewProps={{
                  color: 'primary',
                }}
              />
              <Text typo="body-medium">Filled</Text>
            </Row>
          </Row>

          <Row gap={1.5} align="center" wrap>
            <Row gap={0.5} align="center">
              <Icon
                icon={IconSearch}
                size="small"
                stroke="thin"
                viewProps={{
                  color: 'secondary',
                }}
              />
              <Text typo="body-medium">Small / thin</Text>
            </Row>

            <Row gap={0.5} align="center">
              <Icon
                icon={IconUser}
                size="medium"
                stroke="regular"
                viewProps={{
                  color: 'primary',
                }}
              />
              <Text typo="body-medium">Medium / regular</Text>
            </Row>

            <Row gap={0.5} align="center">
              <Icon
                icon={IconBell}
                size="large"
                stroke="bold"
                viewProps={{
                  color: 'success',
                }}
              />
              <Text typo="body-medium">Large / bold</Text>
            </Row>

            <Row gap={0.5} align="center">
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
            </Row>
          </Row>

          <Row gap={0.75} align="center">
            <Icon
              size="large"
              stroke="regular"
              svg={
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" />
                  <path d="M8 12h8M12 8v8" stroke="currentColor" strokeLinecap="round" />
                </svg>
              }
              viewProps={{
                color: '#0f766e',
              }}
            />
            <Text typo="body-medium">Custom SVG</Text>
          </Row>
        </Column>
      </PlaygroundSection>
    </>
  )
}
