import { Button, Card, Column, createRoot, Popover, Text, ThemeProvider, View } from '../../src'

export function BrowserFixture() {
  return (
    <ThemeProvider mode="light">
      <Column gap={2}>
        <Text typo="title-large">Firefox scroll regression fixture</Text>

        <Card viewProps={{ width: 20, data: { testid: 'passive-card' } }}>
          <Text typo="title-small">Passive Card</Text>
        </Card>

        <Card
          clickable
          selectable
          defaultSelected
          viewProps={{
            label: 'Interactive Card',
            width: 20,
            data: { testid: 'interactive-card' },
          }}
        >
          <Column gap={0.5}>
            <Text typo="title-small">Interactive Card</Text>
            <Text>Clickable and selectable are enabled independently on the same surface.</Text>
            <Button text="Inner action" />
          </Column>
        </Card>

        <View
          overflow="auto"
          width={24}
          height={12}
          radius="medium"
          borderWidth={0.0625}
          borderColor="outline"
          data={{ testid: 'scroll-box' }}
        >
          <Column padding={1} gap={1}>
            <View height={5} />

            <Popover
              placement="right"
              content={<Text>Anchored content</Text>}
              viewProps={{ data: { testid: 'popover-panel' } }}
            >
              <Button text="Open anchored popover" />
            </Popover>

            <View height={32}>
              <Text>Scrollable content</Text>
            </View>
          </Column>
        </View>
      </Column>
    </ThemeProvider>
  )
}

const container = document.getElementById('root')
if (container === null) {
  throw new Error('Browser fixture root is missing')
}

createRoot(container).render(<BrowserFixture />)
