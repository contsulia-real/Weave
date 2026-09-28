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

export function FoundationPlayground() {
  return (
    <>
      <PlaygroundSection
        title="Viewport breakpoint"
        description="窄窗口为纵向；达到 md（48rem）后变为横向并改变背景。"
      >
        <View
          layout="flex"
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
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Theme inheritance"
        description='两块都使用 background="primary"；右侧只通过 mode="dark" 改变同一 token。'
      >
        <View
          layout="flex"
          direction="row"
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
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Global typography"
        description="ThemeProvider 默认建立 body-large 排版上下文；Text、Button、Input 都从同一套 typography.styles / typo 取完整字号、字重、行高与字距。"
      >
        <View
          layout="flex"
          direction="column"
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
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Image"
        description="方形源图放进横向容器：contain 应完整显示并留空，cover 应填满并裁切；尺寸和圆角来自 viewProps。"
      >
        <View
          layout="flex"
          direction="row"
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
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Icon"
        description="Outline / Filled 由调用方传入的 Tabler 图标组件决定；size / stroke 由 Weave 统一，颜色和其他通用视觉继续走 viewProps。"
      >
        <View
          layout="flex"
          direction="column"
          gap={1}
        >
          <View
            layout="flex"
            direction="row"
            gap={1.5}
            align="center"
            wrap
          >
            <View
              layout="flex"
              direction="row"
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
            </View>

            <View
              layout="flex"
              direction="row"
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
            </View>
          </View>

          <View
            layout="flex"
            direction="row"
            gap={1.5}
            align="center"
            wrap
          >
            <View
              layout="flex"
              direction="row"
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
            </View>

            <View
              layout="flex"
              direction="row"
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
            </View>

            <View
              layout="flex"
              direction="row"
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
            </View>

            <View
              layout="flex"
              direction="row"
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
            </View>
          </View>

          <View
            layout="flex"
            direction="row"
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
          </View>
        </View>
      </PlaygroundSection>

      <PlaygroundSection
        title="Button"
        description="Weave 的 tactile control 基准：hover 会抬起，按住会下沉并压缩，释放使用 spring 回弹；variant / size 仍可由主题和 breakpoint 覆盖。"
      >
        <View
          layout="flex"
          direction="column"
          gap={1}
        >
          <View
            layout="flex"
            direction="row"
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
          </View>

          <View
            layout="flex"
            direction="row"
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
          </View>

          <View
            layout="flex"
            direction="row"
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
      </PlaygroundSection>

      <PlaygroundSection
        title="ToolTip"
        description="hover 或 focus 后自动显示；定位和 tooltip layer 由框架处理，业务不创建 portal。"
      >
        <View
          layout="flex"
          direction="row"
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
              <View
                layout="flex"
                direction="column"
                gap={0.25}
              >
                <Text typo="label-small">
                  Complex tooltip
                </Text>
                <Text typo="body-xsmall">
                  View + Text content
                </Text>
              </View>
            }
          >
            <Button
              text="Right / complex"
              variant="secondary"
            />
          </ToolTip>
        </View>
      </PlaygroundSection>
    </>
  )
}
