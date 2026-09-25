import { ThemeProvider, View, createTheme } from './index'

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
  return (
    <View
      layout="grid"
      minHeight="100vh"
      align="center"
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
