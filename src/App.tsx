import {
  Button,
  Text,
  View,
  type ThemeMode,
} from './index'
import {
  FoundationPlayground,
} from './playground/FoundationPlayground'
import {
  FormPlayground,
} from './playground/FormPlayground'
import {
  LayoutPlayground,
} from './playground/LayoutPlayground'
import {
  ListPlayground,
} from './playground/ListPlayground'
import {
  SnackPlayground,
} from './playground/SnackPlayground'

const themeModes: readonly ThemeMode[] = [
  'light',
  'dark',
  'system',
]

function App({
  themeMode,
  onThemeModeChange,
}: {
  themeMode: ThemeMode
  onThemeModeChange: (
    mode: ThemeMode,
  ) => void
}) {
  return (
    <View
      layout="grid"
      width="fill"
      height="100vh"
      overflow="auto"
      align="start"
      padding={2}
      background="surfaceHover"
      color="tertiary"
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
        <View
          layout="flex"
          direction="row"
          justify="space-between"
          align="start"
          gap={1}
          wrap
        >
          <View
            layout="flex"
            direction="column"
            gap={0.5}
          >
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
              React UI framework development
              surface.
            </Text>
          </View>

          <View
            layout="flex"
            direction="column"
            gap={0.5}
            align="end"
          >
            <Text
              typo="label-small"
              color="secondary"
            >
              Theme mode
            </Text>

            <View
              layout="flex"
              direction="row"
              gap={0.375}
              wrap
              justify="end"
            >
              {themeModes.map(
                (mode) => (
                  <Button
                    key={mode}
                    text={
                      mode[0]!.toUpperCase() +
                      mode.slice(1)
                    }
                    size="small"
                    variant={
                      themeMode === mode
                        ? 'primary'
                        : 'secondary'
                    }
                    viewProps={{
                      onClick: () => {
                        onThemeModeChange(
                          mode,
                        )
                      },
                    }}
                  />
                ),
              )}
            </View>
          </View>
        </View>

        <FoundationPlayground />
        <SnackPlayground />
        <ListPlayground />
        <FormPlayground />
        <LayoutPlayground />
      </View>
    </View>
  )
}

export default App
