import { useState } from 'react'
import {
  Button,
  Column,
  Grid,
  Row,
  SnackProvider,
  Text,
  type ThemeMode,
  ThemeProvider,
} from './index'
import { FormPlayground } from './playground/FormPlayground'
import { FoundationPlayground } from './playground/FoundationPlayground'
import { LayoutPlayground } from './playground/LayoutPlayground'
import { ListPlayground } from './playground/ListPlayground'
import { SnackPlayground } from './playground/SnackPlayground'

const themeModes: readonly ThemeMode[] = ['light', 'dark', 'system']

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')

  return (
    <ThemeProvider mode={themeMode}>
      <SnackProvider>
        <Grid
          width="fill"
          height="100vh"
          overflow="auto"
          align="start"
          padding={2}
          background="surfaceHover"
          color="tertiary"
        >
          <Column
            width="fill"
            maxWidth={64}
            justifySelf="center"
            padding={2}
            gap={2}
            radius="large"
            background="surface"
            shadow="medium"
          >
            <Row justify="space-between" align="start" gap={1} wrap>
              <Column gap={0.5}>
                <Text typo="label-small" color="secondary" case="uppercase" letterSpacing="0.08em">
                  Weave playground
                </Text>

                <Text typo="display-large">Weave</Text>

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
              </Column>

              <Column gap={0.5} align="end">
                <Text typo="label-small" color="secondary">
                  Theme mode
                </Text>

                <Row gap={0.375} wrap justify="end">
                  {themeModes.map((mode) => (
                    <Button
                      key={mode}
                      text={mode[0]!.toUpperCase() + mode.slice(1)}
                      size="small"
                      variant={themeMode === mode ? 'primary' : 'secondary'}
                      viewProps={{
                        onClick: () => {
                          setThemeMode(mode)
                        },
                      }}
                    />
                  ))}
                </Row>
              </Column>
            </Row>

            <FoundationPlayground />
            <SnackPlayground />
            <ListPlayground />
            <FormPlayground />
            <LayoutPlayground />
          </Column>
        </Grid>
      </SnackProvider>
    </ThemeProvider>
  )
}

export default App
