import { IconDots, IconSearch, IconStar } from '@tabler/icons-react'
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Card,
  Code,
  Column,
  Divider,
  Icon,
  Image,
  Link,
  Row,
  Text,
} from '../index'
import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'
import {
  ButtonClickExample,
  ButtonFormExample,
  ButtonPressedExample,
} from './documentation-component-example-previews'
import { documentationSampleImage } from './documentation-example-fixtures'

export const contentComponentExamples: Record<
  string,
  DocumentationComponentDocumentationDefinition
> = {
  Typo: {
    description:
      'The complete Weave typography scale exposed through Text.typo and theme typography tokens.',
    apiComponents: [],
    examples: [
      {
        id: 'display',
        title: 'Display',
        description:
          'Display styles are the largest typography roles for prominent page-level statements.',
        preview: (
          <Column gap={1}>
            <Text typo="display-large">Display large</Text>
            <Text typo="display-medium">Display medium</Text>
            <Text typo="display-small">Display small</Text>
          </Column>
        ),
        code: `<Column gap={1}>
  <Text typo="display-large">Display large</Text>
  <Text typo="display-medium">Display medium</Text>
  <Text typo="display-small">Display small</Text>
</Column>`,
      },
      {
        id: 'headline',
        title: 'Headline',
        description: 'Headline styles establish major section hierarchy below display text.',
        preview: (
          <Column gap={1}>
            <Text typo="headline-large">Headline large</Text>
            <Text typo="headline-medium">Headline medium</Text>
            <Text typo="headline-small">Headline small</Text>
          </Column>
        ),
        code: `<Column gap={1}>
  <Text typo="headline-large">Headline large</Text>
  <Text typo="headline-medium">Headline medium</Text>
  <Text typo="headline-small">Headline small</Text>
</Column>`,
      },
      {
        id: 'title',
        title: 'Title',
        description: 'Title styles label cards, panels, and smaller content regions.',
        preview: (
          <Column gap={1}>
            <Text typo="title-large">Title large</Text>
            <Text typo="title-medium">Title medium</Text>
            <Text typo="title-small">Title small</Text>
          </Column>
        ),
        code: `<Column gap={1}>
  <Text typo="title-large">Title large</Text>
  <Text typo="title-medium">Title medium</Text>
  <Text typo="title-small">Title small</Text>
</Column>`,
      },
      {
        id: 'body',
        title: 'Body',
        description:
          'Body styles cover ordinary reading text from standard copy down to compact supporting text.',
        preview: (
          <Column gap={1}>
            <Text typo="body-large">Body large</Text>
            <Text typo="body-medium">Body medium</Text>
            <Text typo="body-small">Body small</Text>
            <Text typo="body-xsmall">Body xsmall</Text>
          </Column>
        ),
        code: `<Column gap={1}>
  <Text typo="body-large">Body large</Text>
  <Text typo="body-medium">Body medium</Text>
  <Text typo="body-small">Body small</Text>
  <Text typo="body-xsmall">Body xsmall</Text>
</Column>`,
      },
      {
        id: 'label',
        title: 'Label',
        description: 'Label styles provide compact emphasized text for controls and metadata.',
        preview: (
          <Column gap={1}>
            <Text typo="label-large">Label large</Text>
            <Text typo="label-medium">Label medium</Text>
            <Text typo="label-small">Label small</Text>
          </Column>
        ),
        code: `<Column gap={1}>
  <Text typo="label-large">Label large</Text>
  <Text typo="label-medium">Label medium</Text>
  <Text typo="label-small">Label small</Text>
</Column>`,
      },
    ],
  },
  Text: {
    description:
      'Theme-driven text with typography, emphasis, alignment, wrapping, and case controls.',
    examples: [
      basicExample(
        <Text typo="body-medium">Weave typography</Text>,
        `<Text typo="body-medium">Weave typography</Text>`,
      ),
    ],
  },
  Code: {
    description:
      'A syntax-highlighted code block backed by Weave typography and scrolling behavior.',
    examples: [
      basicExample(
        <Code language="typescript">{'const weave = "example"'}</Code>,
        `<Code language="typescript">{'const weave = "example"'}</Code>`,
      ),
    ],
  },
  Image: {
    description:
      'An image host with explicit fit, position, loading, and accessible alternative text.',
    examples: [
      basicExample(
        <Image
          src={documentationSampleImage}
          alt="Example landscape"
          fit="cover"
          loading="lazy"
          viewProps={{ width: 20, height: 10, radius: 'medium' }}
        />,
        `<Image
  src={imageUrl}
  alt="Example landscape"
  fit="cover"
  loading="lazy"
  viewProps={{ width: 20, height: 10, radius: 'medium' }}
/>`,
      ),
    ],
  },
  Icon: {
    description:
      'Renders an icon source through Weave size, stroke, color, and ViewHost semantics.',
    examples: [
      basicExample(
        <Icon icon={IconStar} size="large" stroke="regular" />,
        `<Icon icon={IconStar} size="large" stroke="regular" />`,
      ),
    ],
  },
  Avatar: {
    description: 'Displays a person or entity image with a semantic name and fallback content.',
    examples: [
      basicExample(
        <Avatar name="Weave User" fallback="WU" />,
        `<Avatar name="Weave User" fallback="WU" />`,
      ),
    ],
  },
  Divider: {
    description: 'A horizontal or vertical separator with configurable gap and line thickness.',
    examples: [
      basicExample(
        <Row height={8} align="center">
          <Divider direction="horizontal" gap={0} size={1} viewProps={{ width: 12, height: 6 }} />
        </Row>,
        `<Divider
  direction="horizontal"
  gap={0}
  size={1}
  viewProps={{ width: 12, height: 6 }}
/>`,
      ),
    ],
  },
  Link: {
    description:
      'A semantic anchor with Weave link styling and optional external-link affordances.',
    examples: [
      basicExample(
        <Link href="https://example.com" text="Example link" />,
        `<Link href="https://example.com" text="Example link" />`,
      ),
    ],
  },
  Badge: {
    description: 'Anchors a compact text or dot indicator to another piece of content.',
    examples: [
      basicExample(
        <Badge text="3" placement="top-right" visible>
          <Button text="Inbox" />
        </Badge>,
        `<Badge text="3" placement="top-right" visible>
  <Button text="Inbox" />
</Badge>`,
      ),
    ],
  },
  Button: {
    description: 'A semantic action control with themed variants, sizes, pressed state, and icons.',
    examples: [
      {
        id: 'basic-button',
        title: 'Basic button',
        description:
          'Use the same Button component for different emphasis levels without changing its action semantics.',
        preview: (
          <Column gap={1}>
            <Row gap={1} wrap>
              <Button text="Primary" />
              <Button text="Secondary" variant="secondary" />
              <Button text="Tertiary" variant="tertiary" />
            </Row>
            <Row gap={1} wrap align="center">
              <Button text="Small" size="small" />
              <Button text="Medium" size="medium" />
              <Button text="Large" size="large" />
            </Row>
          </Column>
        ),
        code: `<Column gap={1}>
  <Row gap={1} wrap>
    <Button text="Primary" />
    <Button text="Secondary" variant="secondary" />
    <Button text="Tertiary" variant="tertiary" />
  </Row>
  <Row gap={1} wrap align="center">
    <Button text="Small" size="small" />
    <Button text="Medium" size="medium" />
    <Button text="Large" size="large" />
  </Row>
</Column>`,
      },
      {
        id: 'handling-clicks',
        title: 'Handling clicks',
        description:
          'Button event handlers are supplied through viewProps, preserving the native button event surface.',
        preview: <ButtonClickExample />,
        codeMode: 'body',
        code: `const [clicks, setClicks] = useState(0)

return (
  <Row gap={1} align="center">
    <Button
      text="Click me"
      viewProps={{ onClick: () => setClicks((current) => current + 1) }}
    />
    <Text>{clicks === 1 ? '1 click' : clicks + ' clicks'}</Text>
  </Row>
)`,
      },
      {
        id: 'icons-and-labels',
        title: 'Icons and labels',
        description:
          'Pair semantic text with an icon at either edge when the action benefits from a visual cue.',
        preview: (
          <Row gap={1} wrap>
            <Button text="Favorite" icon={IconStar} />
            <Button text="Search" icon={IconSearch} variant="secondary" />
            <Button text="More" icon={IconDots} iconPosition="end" variant="tertiary" />
          </Row>
        ),
        code: `<Row gap={1} wrap>
  <Button text="Favorite" icon={IconStar} />
  <Button text="Search" icon={IconSearch} variant="secondary" />
  <Button text="More" icon={IconDots} iconPosition="end" variant="tertiary" />
</Row>`,
      },
      {
        id: 'icon-only-actions',
        title: 'Icon-only actions',
        description:
          'For compact actions, omit text and provide the accessible name through the button viewProps.',
        preview: (
          <Row gap={1} align="center">
            <Button icon={IconSearch} viewProps={{ label: 'Search' }} />
            <Button icon={IconStar} variant="secondary" viewProps={{ label: 'Favorite' }} />
            <Button icon={IconDots} variant="ghost" viewProps={{ label: 'More actions' }} />
          </Row>
        ),
        code: `<Row gap={1} align="center">
  <Button icon={IconSearch} viewProps={{ label: 'Search' }} />
  <Button icon={IconStar} variant="secondary" viewProps={{ label: 'Favorite' }} />
  <Button icon={IconDots} variant="ghost" viewProps={{ label: 'More actions' }} />
</Row>`,
      },
      {
        id: 'form-actions',
        title: 'Form actions',
        description:
          'Use native button types inside Form so submit and reset behavior remains browser-native.',
        preview: <ButtonFormExample />,
        codeMode: 'body',
        code: `const [status, setStatus] = useState('Waiting')

return (
  <Form
    onSubmit={(event) => {
      event.preventDefault()
      setStatus('Submitted')
    }}
    onReset={() => setStatus('Reset')}
    viewProps={{ width: 20 }}
  >
    <Column gap={1}>
      <Input placeholder="Message" type="text" />
      <Row gap={1}>
        <Button type="submit" text="Submit" />
        <Button type="reset" text="Reset" variant="secondary" />
      </Row>
      <Text typo="body-small">{status}</Text>
    </Column>
  </Form>
)`,
      },
      {
        id: 'pressed-state',
        title: 'Pressed state',
        description:
          'Use pressed for toggle-style actions whose selected state belongs to the surrounding application.',
        preview: <ButtonPressedExample />,
        codeMode: 'body',
        code: `const [pressed, setPressed] = useState(false)

return (
  <Button
    text={pressed ? 'Pressed' : 'Not pressed'}
    pressed={pressed}
    viewProps={{ onClick: () => setPressed((current) => !current) }}
  />
)`,
      },
      {
        id: 'disabled-actions',
        title: 'Disabled actions',
        description:
          'Disable actions that cannot currently run while keeping their semantic button role.',
        preview: (
          <Row gap={1} wrap>
            <Button text="Unavailable" disabled />
            <Button text="Cannot delete" variant="danger" disabled />
          </Row>
        ),
        code: `<Row gap={1} wrap>
  <Button text="Unavailable" disabled />
  <Button text="Cannot delete" variant="danger" disabled />
</Row>`,
      },
      {
        id: 'custom-content',
        title: 'Custom content',
        description:
          'Use children when an action needs richer composition than the semantic text-and-icon shortcut.',
        preview: (
          <Button>
            <Row gap={0.5} align="center">
              <Icon icon={IconStar} size="small" />
              <Column gap={0}>
                <Text weight="semibold">Save favorite</Text>
                <Text typo="body-xsmall">Available offline</Text>
              </Column>
            </Row>
          </Button>
        ),
        code: `<Button>
  <Row gap={0.5} align="center">
    <Icon icon={IconStar} size="small" />
    <Column gap={0}>
      <Text weight="semibold">Save favorite</Text>
      <Text typo="body-xsmall">Available offline</Text>
    </Column>
  </Row>
</Button>`,
      },
      {
        id: 'responsive-button',
        title: 'Responsive button',
        description:
          'Button can change its size and emphasis at viewport breakpoints without replacing the component.',
        preview: (
          <Button
            text="Responsive action"
            size="small"
            variant="ghost"
            md={{ size: 'medium', variant: 'secondary' }}
            lg={{ size: 'large', variant: 'primary' }}
          />
        ),
        code: `<Button
  text="Responsive action"
  size="small"
  variant="ghost"
  md={{ size: 'medium', variant: 'secondary' }}
  lg={{ size: 'large', variant: 'primary' }}
/>`,
      },
    ],
  },
  Card: {
    description: 'A themed surface that can optionally expose click and selection states.',
    examples: [basicExample(<Card>Card content</Card>, `<Card>Card content</Card>`)],
  },
  AppBar: {
    description:
      'A top application bar with leading, title, trailing, size, mode, and elevation slots.',
    examples: [
      basicExample(
        <AppBar
          leading={<Button icon={IconDots} />}
          title={<Text>Example</Text>}
          trailing={<Button icon={IconSearch} />}
          size="medium"
          mode="full"
          titleAlign="start"
        />,
        `<AppBar
  leading={<Button icon={IconDots} />}
  title={<Text>Example</Text>}
  trailing={<Button icon={IconSearch} />}
  size="medium"
  mode="full"
  titleAlign="start"
/>`,
      ),
    ],
  },
}
