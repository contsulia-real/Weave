import { DocumentationControls } from '../documentation/DocumentationControls'
import ButtonBasicButtonDemo from '../documentation/demos/Button/basic-button'
import CalendarBasicUsageDemo from '../documentation/demos/Calendar/basic-usage'
import ChipBasicUsageDemo from '../documentation/demos/Chip/basic-usage'
import SliderBasicUsageDemo from '../documentation/demos/Slider/basic-usage'
import StepperBasicUsageDemo from '../documentation/demos/Stepper/basic-usage'
import TabsBasicUsageDemo from '../documentation/demos/Tabs/basic-usage'
import TypewriterBasicUsageDemo from '../documentation/demos/Typewriter/basic-usage'
import type { DocumentationThemeColorId } from '../documentation/documentation-theme'
import type { ThemeMode } from '../index'
import { Button, Card, Column, Grid, Link, Progress, Row, Text } from '../index'

interface WebsiteHomeProps {
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
  themeColorId: DocumentationThemeColorId
  onThemeColorChange: (id: DocumentationThemeColorId) => void
}

export function WebsiteHome({
  themeMode,
  onThemeModeChange,
  themeColorId,
  onThemeColorChange,
}: WebsiteHomeProps) {
  return (
    <Column width="fill" height="100vh" overflow="auto" background="surface" color="tertiary">
      <Column width="fill" align="center" padding={24}>
        <Row width="fill" maxWidth={1120} align="center" justify="space-between" gap={24} wrap>
          <Row align="center" gap={24} wrap>
            <Text typo="title-large">Weave</Text>
            <Link href="/docs" text="Docs" hideIcon />
            <Link href="/docs/components/Button" text="Components" hideIcon />
            <Link href="/docs/getting-started" text="Get started" hideIcon />
          </Row>
          <Row align="center" gap={16} wrap>
            <Link href="https://github.com/contsulia-real/Weave" text="GitHub" />
            <Link href="https://jsr.io/@contsulia/weave" text="JSR" />
            <DocumentationControls
              themeMode={themeMode}
              onThemeModeChange={onThemeModeChange}
              themeColorId={themeColorId}
              onThemeColorChange={onThemeColorChange}
            />
          </Row>
        </Row>
      </Column>

      <Grid width="fill" columns={1} xl={{ columns: 2 }}>
        <Column
          width="fill"
          minWidth={0}
          align="center"
          justify="center"
          padding={32}
          minHeight="85vh"
        >
          <Column width="fill" maxWidth={480} gap={24} align="start">
            <Text typo="display-large">Weave</Text>
            <Text typo="headline-large">Browser-native React UI</Text>
            <Text typo="body-large" color="secondary">
              A browser-native React UI framework built on semantic components, DOM and CSS.
            </Text>
            <Button
              text="Explore documentation"
              viewProps={{ onClick: () => window.location.assign('/docs') }}
            />
          </Column>
        </Column>

        <Column width="fill" minWidth={0} padding={24} container="website-showcase">
          <Grid width="fill" columns={1} containerSm={{ columns: 2 }} gap={16}>
            <Column width="fill" minWidth={0} gap={16}>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Progress</Text>
                  <Progress mode="linear" progress={0.65} tracked />
                  <Text typo="body-small" color="secondary">
                    65%
                  </Text>
                </Column>
              </Card>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Chips</Text>
                  <ChipBasicUsageDemo />
                </Column>
              </Card>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Calendar</Text>
                  <CalendarBasicUsageDemo />
                </Column>
              </Card>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Typewriter</Text>
                  <TypewriterBasicUsageDemo />
                </Column>
              </Card>
            </Column>
            <Column width="fill" minWidth={0} gap={16}>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Stepper</Text>
                  <StepperBasicUsageDemo />
                </Column>
              </Card>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Tabs</Text>
                  <TabsBasicUsageDemo />
                </Column>
              </Card>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Slider</Text>
                  <SliderBasicUsageDemo />
                </Column>
              </Card>
              <Card viewProps={{ width: 'fill', padding: 24 }}>
                <Column gap={16} width="fill">
                  <Text typo="title-medium">Buttons</Text>
                  <ButtonBasicButtonDemo />
                </Column>
              </Card>
            </Column>
          </Grid>
        </Column>
      </Grid>
    </Column>
  )
}
