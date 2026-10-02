import { IconDots, IconSearch, IconStar } from '@tabler/icons-react'
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Card,
  Code,
  Divider,
  Icon,
  Image,
  Link,
  Row,
  Text,
} from '../index'
import type { DocumentationComponentDefinition } from './documentation-component-playground-data'
import {
  appBarModeOptions,
  axisOptions,
  booleanControl,
  booleanValue,
  buttonVariantOptions,
  imageFitOptions,
  imageLoadingOptions,
  numberControl,
  numberValue,
  optionValue,
  placementOptions,
  sampleImage,
  selectControl,
  sizeOptions,
  textAlignOptions,
  textCaseOptions,
  textControl,
  textTypoOptions,
  textValue,
  textWeightOptions,
} from './documentation-component-playground-data'

export const contentComponentDefinitions: Record<string, DocumentationComponentDefinition> = {
  Text: {
    description:
      'Theme-driven text with typography, emphasis, alignment, wrapping, and case controls.',
    controls: [
      textControl('children'),
      selectControl('typo', textTypoOptions),
      selectControl('weight', textWeightOptions),
      selectControl('align', textAlignOptions),
      selectControl('case', textCaseOptions),
      booleanControl('italic'),
      booleanControl('underline'),
    ],
    defaults: {
      children: 'Weave typography',
      typo: 'body-medium',
      weight: 'regular',
      align: 'start',
      case: 'none',
      italic: false,
      underline: false,
    },
    render: (values) => (
      <Text
        typo={optionValue(values, 'typo', textTypoOptions)}
        weight={optionValue(values, 'weight', textWeightOptions)}
        align={optionValue(values, 'align', textAlignOptions)}
        case={optionValue(values, 'case', textCaseOptions)}
        italic={booleanValue(values, 'italic')}
        underline={booleanValue(values, 'underline')}
      >
        {textValue(values, 'children')}
      </Text>
    ),
  },
  Code: {
    description:
      'A syntax-highlighted code block backed by Weave typography and scrolling behavior.',
    controls: [textControl('children')],
    defaults: { children: 'const weave = "playground"' },
    render: (values) => <Code language="typescript">{textValue(values, 'children')}</Code>,
  },
  Image: {
    description:
      'An image host with explicit fit, position, loading, and accessible alternative text.',
    controls: [
      textControl('alt'),
      selectControl('fit', imageFitOptions),
      selectControl('loading', imageLoadingOptions),
    ],
    defaults: { alt: 'Example landscape', fit: 'cover', loading: 'lazy' },
    render: (values) => (
      <Image
        src={sampleImage}
        alt={textValue(values, 'alt')}
        fit={optionValue(values, 'fit', imageFitOptions)}
        loading={optionValue(values, 'loading', imageLoadingOptions)}
        viewProps={{ width: 20, height: 10, radius: 'medium' }}
      />
    ),
  },
  Icon: {
    description:
      'Renders an icon source through Weave size, stroke, color, and ViewHost semantics.',
    controls: [
      selectControl('size', ['small', 'medium', 'large', 'xlarge']),
      selectControl('stroke', ['thin', 'regular', 'bold']),
    ],
    defaults: { size: 'large', stroke: 'regular' },
    render: (values) => (
      <Icon
        icon={IconStar}
        size={optionValue(values, 'size', ['small', 'medium', 'large', 'xlarge'] as const)}
        stroke={optionValue(values, 'stroke', ['thin', 'regular', 'bold'] as const)}
      />
    ),
  },
  Avatar: {
    description: 'Displays a person or entity image with a semantic name and fallback content.',
    controls: [textControl('name'), textControl('fallback')],
    defaults: { name: 'Weave User', fallback: 'WU' },
    render: (values) => (
      <Avatar name={textValue(values, 'name')} fallback={textValue(values, 'fallback')} />
    ),
  },
  Divider: {
    description: 'A horizontal or vertical separator with configurable gap and line thickness.',
    controls: [
      selectControl('direction', axisOptions),
      numberControl('gap'),
      numberControl('size'),
    ],
    defaults: { direction: 'horizontal', gap: 0, size: 1 },
    render: (values) => (
      <Row height={8} align="center">
        <Divider
          direction={optionValue(values, 'direction', axisOptions)}
          gap={numberValue(values, 'gap')}
          size={numberValue(values, 'size')}
          viewProps={{ width: 12, height: 6 }}
        />
      </Row>
    ),
  },
  Link: {
    description:
      'A semantic anchor with Weave link styling and optional external-link affordances.',
    controls: [
      textControl('href'),
      textControl('text'),
      booleanControl('hideIcon'),
      booleanControl('hideUnderline'),
    ],
    defaults: {
      href: 'https://example.com',
      text: 'Example link',
      hideIcon: false,
      hideUnderline: false,
    },
    render: (values) => (
      <Link
        href={textValue(values, 'href')}
        text={textValue(values, 'text')}
        hideIcon={booleanValue(values, 'hideIcon')}
        hideUnderline={booleanValue(values, 'hideUnderline')}
      />
    ),
  },
  Badge: {
    description: 'Anchors a compact text or dot indicator to another piece of content.',
    controls: [
      textControl('text'),
      selectControl('placement', placementOptions),
      booleanControl('visible'),
    ],
    defaults: { text: '3', placement: 'top-right', visible: true },
    render: (values) => (
      <Badge
        text={textValue(values, 'text')}
        placement={optionValue(values, 'placement', placementOptions)}
        visible={booleanValue(values, 'visible')}
      >
        <Button text="Inbox" />
      </Badge>
    ),
  },
  Button: {
    description: 'A semantic action control with themed variants, sizes, pressed state, and icons.',
    controls: [
      textControl('text'),
      selectControl('variant', buttonVariantOptions),
      selectControl('size', sizeOptions),
      booleanControl('disabled'),
      booleanControl('pressed'),
    ],
    defaults: {
      text: 'Button',
      variant: 'primary',
      size: 'medium',
      disabled: false,
      pressed: false,
    },
    render: (values) => (
      <Button
        text={textValue(values, 'text')}
        variant={optionValue(values, 'variant', buttonVariantOptions)}
        size={optionValue(values, 'size', sizeOptions)}
        disabled={booleanValue(values, 'disabled')}
        pressed={booleanValue(values, 'pressed')}
      />
    ),
  },
  Card: {
    description: 'A themed surface that can optionally expose click and selection states.',
    controls: [textControl('children'), booleanControl('clickable'), booleanControl('selectable')],
    defaults: { children: 'Card content', clickable: false, selectable: false },
    render: (values) =>
      booleanValue(values, 'selectable') ? (
        <Card selectable clickable={booleanValue(values, 'clickable')}>
          {textValue(values, 'children')}
        </Card>
      ) : (
        <Card selectable={false} clickable={booleanValue(values, 'clickable')}>
          {textValue(values, 'children')}
        </Card>
      ),
  },
  AppBar: {
    description:
      'A top application bar with leading, title, trailing, size, mode, and elevation slots.',
    controls: [
      selectControl('size', sizeOptions),
      selectControl('mode', appBarModeOptions),
      selectControl('titleAlign', ['start', 'center', 'end']),
      booleanControl('sticky'),
      booleanControl('elevated'),
    ],
    defaults: {
      size: 'medium',
      mode: 'full',
      titleAlign: 'start',
      sticky: false,
      elevated: false,
    },
    render: (values) => (
      <AppBar
        leading={<Button icon={IconDots} />}
        title={<Text>Playground</Text>}
        trailing={<Button icon={IconSearch} />}
        size={optionValue(values, 'size', sizeOptions)}
        mode={optionValue(values, 'mode', appBarModeOptions)}
        titleAlign={optionValue(values, 'titleAlign', ['start', 'center', 'end'] as const)}
        sticky={booleanValue(values, 'sticky')}
        elevated={booleanValue(values, 'elevated')}
      />
    ),
  },
}
