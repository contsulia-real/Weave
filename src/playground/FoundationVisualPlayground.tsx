import { IconBell, IconSearch, IconSearchFilled, IconSettings, IconUser } from '@tabler/icons-react'
import {
  Avatar,
  Code,
  Column,
  createTheme,
  Icon,
  Image,
  Row,
  Skeleton,
  Text,
  ThemeProvider,
  View,
} from '../index'
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
          <Text typo="body-medium" bold>
            Bold
          </Text>
          <Text typo="body-medium" italic>
            Italic
          </Text>
          <Text typo="body-medium" underline>
            Underline
          </Text>
          <Text typo="body-medium" strikethrough>
            Strikethrough
          </Text>
          <Text typo="body-medium" underline overline>
            Underline + overline
          </Text>
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
        title="Code"
        description="Shiki syntax highlighting · language is always explicit; Code uses the Weave mono typography context and theme-backed CSS-variable colors."
      >
        <Code
          language="tsx"
          viewProps={{ width: 'fill' }}
        >{`function Greeting({ name }: { name: string }) {\n  return <Text typo="title-medium">Hello {name}</Text>\n}`}</Code>
      </PlaygroundSection>

      <PlaygroundSection
        title="Skeleton"
        description="rect / circle / text 三种占位形态共享同一套 shimmer；text 高度跟随当前 line-height，circle 保持 1:1，reduced-motion 下停止 shimmer。"
      >
        <Row gap={1.5} align="start" wrap>
          <Skeleton
            viewProps={{
              width: 12,
              height: 6,
              data: { testid: 'skeleton-rect' },
            }}
          />

          <Skeleton
            shape="circle"
            viewProps={{
              width: 5,
              data: { testid: 'skeleton-circle' },
            }}
          />

          <Column gap={0.625} width={18}>
            <Skeleton
              shape="text"
              viewProps={{
                width: 18,
                style: { fontSize: '16px', lineHeight: '24px' },
                data: { testid: 'skeleton-text' },
              }}
            />
            <Skeleton
              shape="text"
              viewProps={{
                width: 14,
                data: { testid: 'skeleton-text-medium' },
              }}
            />
            <Skeleton
              shape="text"
              viewProps={{
                width: 9,
                data: { testid: 'skeleton-text-short' },
              }}
            />
          </Column>
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Avatar"
        description="Avatar 固定为圆形；图片使用 cover + center。没有图片时显示 neutral surface，显式 fallback 优先于 name initials；图片加载失败自动进入 fallback。"
      >
        <Row gap={1.5} align="start" wrap>
          <Column gap={0.5} align="center">
            <Avatar
              src={diagnosticImage}
              name="Image Avatar"
              viewProps={{
                label: 'Image Avatar',
                data: { testid: 'avatar-image' },
              }}
            />
            <Text typo="body-small">Image</Text>
          </Column>

          <Column gap={0.5} align="center">
            <Avatar
              name="Ada Lovelace"
              viewProps={{
                label: 'Ada Lovelace',
                data: { testid: 'avatar-initials' },
              }}
            />
            <Text typo="body-small">Initials</Text>
          </Column>

          <Column gap={0.5} align="center">
            <Avatar
              name="Explicit Fallback"
              fallback="FX"
              viewProps={{
                label: 'Explicit fallback',
                data: { testid: 'avatar-explicit' },
              }}
            />
            <Text typo="body-small">Fallback</Text>
          </Column>

          <Column gap={0.5} align="center">
            <Avatar
              src="/__weave-missing-avatar__.png"
              name="Grace Hopper"
              viewProps={{
                label: 'Grace Hopper',
                data: { testid: 'avatar-failed' },
              }}
            />
            <Text typo="body-small">Failed image</Text>
          </Column>

          <Column gap={0.5} align="center">
            <Avatar
              viewProps={{
                label: 'Empty Avatar',
                data: { testid: 'avatar-empty' },
              }}
            />
            <Text typo="body-small">Empty</Text>
          </Column>

          <Column gap={0.5} align="center">
            <Avatar
              name="Height Only"
              viewProps={{
                height: 4,
                label: 'Height Only',
                data: { testid: 'avatar-height-only' },
              }}
            />
            <Text typo="body-small">4rem height</Text>
          </Column>
        </Row>
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
