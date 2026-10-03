import {
  Absolute,
  Button,
  Card,
  Column,
  Flex,
  Grid,
  Presence,
  Row,
  SplitBox,
  SplitBoxPane,
  Stack,
  Text,
  View,
} from '../index'
import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'

export const foundationComponentExamples: Record<
  string,
  DocumentationComponentDocumentationDefinition
> = {
  View: {
    description:
      'The low-level public host primitive for shared layout, styling, semantic, motion, and interaction capabilities.',
    examples: [
      basicExample(
        <View background="surfaceHover" padding={2} clickable opacity={1} radius="medium">
          View
        </View>,
        `<View background="surfaceHover" padding={2} clickable opacity={1} radius="medium">
  View
</View>`,
      ),
    ],
  },
  Layout: {
    description:
      'Weave layout primitives for flex, row, column, grid, stacking, absolute positioning, and split panes.',
    apiComponents: ['Flex', 'Row', 'Column', 'Grid', 'Stack', 'Absolute', 'SplitBox'],
    examples: [
      {
        id: 'flex',
        title: 'Flex',
        preview: (
          <Flex direction="row" gap={1} wrap justify="start" width={18}>
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
          </Flex>
        ),
        code: `<Flex direction="row" gap={1} wrap justify="start" width={18}>
  <Button text="One" />
  <Button text="Two" />
  <Button text="Three" />
</Flex>`,
      },
      {
        id: 'row',
        title: 'Row',
        preview: (
          <Row gap={1} align="center" justify="start">
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
          </Row>
        ),
        code: `<Row gap={1} align="center" justify="start">
  <Button text="One" />
  <Button text="Two" />
  <Button text="Three" />
</Row>`,
      },
      {
        id: 'column',
        title: 'Column',
        preview: (
          <Column gap={1} align="start" justify="start">
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
          </Column>
        ),
        code: `<Column gap={1} align="start" justify="start">
  <Button text="One" />
  <Button text="Two" />
  <Button text="Three" />
</Column>`,
      },
      {
        id: 'grid',
        title: 'Grid',
        preview: (
          <Grid columns={2} gap={1} width="fill">
            <Card>A</Card>
            <Card>B</Card>
            <Card>C</Card>
            <Card>D</Card>
          </Grid>
        ),
        code: `<Grid columns={2} gap={1} width="fill">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
  <Card>D</Card>
</Grid>`,
      },
      {
        id: 'stack',
        title: 'Stack',
        preview: (
          <Stack width={18} height={8}>
            <Card viewProps={{ width: 'fill', height: 'fill' }}>Base</Card>
            <Card viewProps={{ width: 8, height: 4, justifySelf: 'center', alignSelf: 'center' }}>
              Middle
            </Card>
            <Text viewProps={{ justifySelf: 'center', alignSelf: 'center' }}>Top</Text>
          </Stack>
        ),
        code: `<Stack width={18} height={8}>
  <Card viewProps={{ width: 'fill', height: 'fill' }}>Base</Card>
  <Card viewProps={{ width: 8, height: 4, justifySelf: 'center', alignSelf: 'center' }}>
    Middle
  </Card>
  <Text viewProps={{ justifySelf: 'center', alignSelf: 'center' }}>Top</Text>
</Stack>`,
      },
      {
        id: 'absolute',
        title: 'Absolute',
        preview: (
          <Stack position="relative" width={18} height={8}>
            <Card viewProps={{ width: 'fill', height: 'fill' }}>Positioning plane</Card>
            <Absolute top={1} left={2}>
              <Button text="Absolute" />
            </Absolute>
          </Stack>
        ),
        code: `<Stack position="relative" width={18} height={8}>
  <Card viewProps={{ width: 'fill', height: 'fill' }}>Positioning plane</Card>
  <Absolute top={1} left={2}>
    <Button text="Absolute" />
  </Absolute>
</Stack>`,
      },
      {
        id: 'splitbox',
        title: 'SplitBox',
        preview: (
          <SplitBox
            direction="horizontal"
            defaultSize={8}
            collapsible="both"
            thickness={0.25}
            viewProps={{ width: 'fill', height: 12 }}
          >
            <SplitBoxPane>
              <Card viewProps={{ width: 'fill', height: 'fill' }}>Start pane</Card>
            </SplitBoxPane>
            <SplitBoxPane>
              <Card viewProps={{ width: 'fill', height: 'fill' }}>End pane</Card>
            </SplitBoxPane>
          </SplitBox>
        ),
        code: `<SplitBox
  direction="horizontal"
  defaultSize={8}
  collapsible="both"
  thickness={0.25}
  viewProps={{ width: 'fill', height: 12 }}
>
  <SplitBoxPane>
    <Card viewProps={{ width: 'fill', height: 'fill' }}>Start pane</Card>
  </SplitBoxPane>
  <SplitBoxPane>
    <Card viewProps={{ width: 'fill', height: 'fill' }}>End pane</Card>
  </SplitBoxPane>
</SplitBox>`,
      },
    ],
  },
  Presence: {
    description:
      'Keeps enter/exit content mounted long enough for Weave presence motion to complete.',
    examples: [
      basicExample(
        <Presence present>
          <Card>Presence content</Card>
        </Presence>,
        `<Presence present>
  <Card>Presence content</Card>
</Presence>`,
      ),
    ],
  },
}
