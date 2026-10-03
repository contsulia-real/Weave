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
  Flex: {
    description: 'A configurable flex container for direction, wrapping, alignment, and spacing.',
    examples: [
      basicExample(
        <Flex direction="row" gap={1} wrap justify="start" width={18}>
          <Button text="One" />
          <Button text="Two" />
          <Button text="Three" />
        </Flex>,
        `<Flex direction="row" gap={1} wrap justify="start" width={18}>
  <Button text="One" />
  <Button text="Two" />
  <Button text="Three" />
</Flex>`,
      ),
    ],
  },
  Row: {
    description: 'A horizontal flex layout with Weave spacing and alignment props.',
    examples: [
      basicExample(
        <Row gap={1} align="center" justify="start">
          <Button text="One" />
          <Button text="Two" />
          <Button text="Three" />
        </Row>,
        `<Row gap={1} align="center" justify="start">
  <Button text="One" />
  <Button text="Two" />
  <Button text="Three" />
</Row>`,
      ),
    ],
  },
  Column: {
    description: 'A vertical flex layout for stacking content with shared spacing and alignment.',
    examples: [
      basicExample(
        <Column gap={1} align="start" justify="start">
          <Button text="One" />
          <Button text="Two" />
          <Button text="Three" />
        </Column>,
        `<Column gap={1} align="start" justify="start">
  <Button text="One" />
  <Button text="Two" />
  <Button text="Three" />
</Column>`,
      ),
    ],
  },
  Grid: {
    description: 'A grid layout that exposes Weave grid sizing, placement, and spacing props.',
    examples: [
      basicExample(
        <Grid columns={2} gap={1} width="fill">
          <Card>A</Card>
          <Card>B</Card>
          <Card>C</Card>
          <Card>D</Card>
        </Grid>,
        `<Grid columns={2} gap={1} width="fill">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
  <Card>D</Card>
</Grid>`,
      ),
    ],
  },
  Stack: {
    description: 'A single stacking plane that places direct children in the same grid area.',
    examples: [
      basicExample(
        <Stack width={18} height={8}>
          <Card viewProps={{ width: 'fill', height: 'fill' }}>Base</Card>
          <Card viewProps={{ width: 8, height: 4, justifySelf: 'center', alignSelf: 'center' }}>
            Middle
          </Card>
          <Text viewProps={{ justifySelf: 'center', alignSelf: 'center' }}>Top</Text>
        </Stack>,
        `<Stack width={18} height={8}>
  <Card viewProps={{ width: 'fill', height: 'fill' }}>Base</Card>
  <Card viewProps={{ width: 8, height: 4, justifySelf: 'center', alignSelf: 'center' }}>
    Middle
  </Card>
  <Text viewProps={{ justifySelf: 'center', alignSelf: 'center' }}>Top</Text>
</Stack>`,
      ),
    ],
  },
  Absolute: {
    description: 'An absolute-positioning layout wrapper for explicit inset placement.',
    examples: [
      basicExample(
        <Stack position="relative" width={18} height={8}>
          <Card viewProps={{ width: 'fill', height: 'fill' }}>Positioning plane</Card>
          <Absolute top={1} left={2}>
            <Button text="Absolute" />
          </Absolute>
        </Stack>,
        `<Stack position="relative" width={18} height={8}>
  <Card viewProps={{ width: 'fill', height: 'fill' }}>Positioning plane</Card>
  <Absolute top={1} left={2}>
    <Button text="Absolute" />
  </Absolute>
</Stack>`,
      ),
    ],
  },
  SplitBox: {
    description: 'A two-pane splitter with bounded resizing and optional pane collapse behavior.',
    examples: [
      basicExample(
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
        </SplitBox>,
        `<SplitBox
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
      ),
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
