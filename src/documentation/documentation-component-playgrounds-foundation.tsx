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
import type { DocumentationComponentDefinition } from './documentation-component-playground-data'
import {
  alignOptions,
  axisOptions,
  booleanControl,
  booleanValue,
  flexDirectionOptions,
  justifyOptions,
  numberControl,
  numberValue,
  optionValue,
  selectControl,
  splitCollapsibleOptions,
  splitCollapsibleValue,
  textControl,
  textValue,
} from './documentation-component-playground-data'

export const foundationComponentDefinitions: Record<string, DocumentationComponentDefinition> = {
  View: {
    description:
      'The low-level public host primitive for shared layout, styling, semantic, motion, and interaction capabilities.',
    controls: [
      textControl('background'),
      numberControl('padding'),
      booleanControl('clickable'),
      numberControl('opacity'),
    ],
    defaults: { background: 'surfaceHover', padding: 2, clickable: true, opacity: 1 },
    render: (values) => (
      <View
        background={textValue(values, 'background')}
        padding={numberValue(values, 'padding')}
        clickable={booleanValue(values, 'clickable')}
        opacity={numberValue(values, 'opacity')}
        radius="medium"
      >
        View
      </View>
    ),
  },
  Flex: {
    description: 'A configurable flex container for direction, wrapping, alignment, and spacing.',
    controls: [
      selectControl('direction', flexDirectionOptions),
      numberControl('gap'),
      booleanControl('wrap'),
      selectControl('justify', justifyOptions),
    ],
    defaults: { direction: 'row', gap: 1, wrap: true, justify: 'start' },
    render: (values) => (
      <Flex
        direction={optionValue(values, 'direction', flexDirectionOptions)}
        gap={numberValue(values, 'gap')}
        wrap={booleanValue(values, 'wrap')}
        justify={optionValue(values, 'justify', justifyOptions)}
        width={18}
      >
        <Button text="One" />
        <Button text="Two" />
        <Button text="Three" />
      </Flex>
    ),
  },
  Row: {
    description: 'A horizontal flex layout with Weave spacing and alignment props.',
    controls: [
      numberControl('gap'),
      selectControl('align', alignOptions),
      selectControl('justify', justifyOptions),
      booleanControl('wrap'),
    ],
    defaults: { gap: 1, align: 'center', justify: 'start', wrap: false },
    render: (values) => (
      <Row
        gap={numberValue(values, 'gap')}
        align={optionValue(values, 'align', alignOptions)}
        justify={optionValue(values, 'justify', justifyOptions)}
        wrap={booleanValue(values, 'wrap')}
      >
        <Button text="One" />
        <Button text="Two" />
        <Button text="Three" />
      </Row>
    ),
  },
  Column: {
    description: 'A vertical flex layout for stacking content with shared spacing and alignment.',
    controls: [
      numberControl('gap'),
      selectControl('align', alignOptions),
      selectControl('justify', justifyOptions),
    ],
    defaults: { gap: 1, align: 'start', justify: 'start' },
    render: (values) => (
      <Column
        gap={numberValue(values, 'gap')}
        align={optionValue(values, 'align', alignOptions)}
        justify={optionValue(values, 'justify', justifyOptions)}
      >
        <Button text="One" />
        <Button text="Two" />
        <Button text="Three" />
      </Column>
    ),
  },
  Grid: {
    description: 'A grid layout that exposes Weave grid sizing, placement, and spacing props.',
    controls: [numberControl('columns'), numberControl('gap')],
    defaults: { columns: 2, gap: 1 },
    render: (values) => (
      <Grid columns={numberValue(values, 'columns')} gap={numberValue(values, 'gap')} width="fill">
        <Card>A</Card>
        <Card>B</Card>
        <Card>C</Card>
        <Card>D</Card>
      </Grid>
    ),
  },
  Stack: {
    description: 'A single stacking plane that places direct children in the same grid area.',
    controls: [numberControl('width'), numberControl('height')],
    defaults: { width: 18, height: 8 },
    render: (values) => (
      <Stack width={numberValue(values, 'width')} height={numberValue(values, 'height')}>
        <Card viewProps={{ width: 'fill', height: 'fill' }}>Base</Card>
        <Card viewProps={{ width: 8, height: 4, justifySelf: 'center', alignSelf: 'center' }}>
          Middle
        </Card>
        <Text viewProps={{ justifySelf: 'center', alignSelf: 'center' }}>Top</Text>
      </Stack>
    ),
  },
  Absolute: {
    description: 'An absolute-positioning layout wrapper for explicit inset placement.',
    controls: [numberControl('top'), numberControl('left')],
    defaults: { top: 1, left: 2 },
    render: (values) => (
      <Stack position="relative" width={18} height={8}>
        <Card viewProps={{ width: 'fill', height: 'fill' }}>Positioning plane</Card>
        <Absolute top={numberValue(values, 'top')} left={numberValue(values, 'left')}>
          <Button text="Absolute" />
        </Absolute>
      </Stack>
    ),
  },
  SplitBox: {
    description: 'A two-pane splitter with bounded resizing and optional pane collapse behavior.',
    controls: [
      selectControl('direction', axisOptions),
      numberControl('defaultSize'),
      selectControl('collapsible', splitCollapsibleOptions),
      numberControl('thickness'),
      booleanControl('disabled'),
    ],
    defaults: {
      direction: 'horizontal',
      defaultSize: 8,
      collapsible: 'both',
      thickness: 0.25,
      disabled: false,
    },
    render: (values) => (
      <SplitBox
        direction={optionValue(values, 'direction', axisOptions)}
        defaultSize={numberValue(values, 'defaultSize')}
        collapsible={splitCollapsibleValue(values)}
        thickness={numberValue(values, 'thickness')}
        disabled={booleanValue(values, 'disabled')}
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
  },
  Presence: {
    description:
      'Keeps enter/exit content mounted long enough for Weave presence motion to complete.',
    controls: [booleanControl('present')],
    defaults: { present: true },
    render: (values) => (
      <Presence present={booleanValue(values, 'present')}>
        <Card>Presence content</Card>
      </Presence>
    ),
  },
}
