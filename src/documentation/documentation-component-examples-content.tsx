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

const sampleImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect width="320" height="180" rx="24" fill="%238E8E93"/%3E%3Ccircle cx="92" cy="72" r="28" fill="%23FFFFFF"/%3E%3Cpath d="M34 150l72-62 45 38 38-32 97 56H34z" fill="%23FFFFFF"/%3E%3C/svg%3E'

import {
  ButtonClickExample,
  ButtonFormExample,
  ButtonPressedExample,
} from './documentation-component-example-previews'

export const contentComponentExamples: Record<
  string,
  DocumentationComponentDocumentationDefinition
> = {
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
          src={sampleImage}
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
          <Row gap={1} wrap>
            <Button text="Primary" />
            <Button text="Secondary" variant="secondary" />
            <Button text="Tertiary" variant="tertiary" />
          </Row>
        ),
        code: `<Row gap={1} wrap>
  <Button text="Primary" />
  <Button text="Secondary" variant="secondary" />
  <Button text="Tertiary" variant="tertiary" />
</Row>`,
      },
      {
        id: 'handling-clicks',
        title: 'Handling clicks',
        description:
          'Button event handlers are supplied through viewProps, preserving the native button event surface.',
        preview: <ButtonClickExample />,
        code: `const [clicks, setClicks] = useState(0)

<Button
  text="Click me"
  viewProps={{ onClick: () => setClicks((current) => current + 1) }}
/>
<Text>{clicks} clicks</Text>`,
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
        code: `<Form onSubmit={handleSubmit} onReset={handleReset}>
  <Column gap={1}>
    <Input placeholder="Message" type="text" />
    <Row gap={1}>
      <Button type="submit" text="Submit" />
      <Button type="reset" text="Reset" variant="secondary" />
    </Row>
  </Column>
</Form>`,
      },
      {
        id: 'pressed-state',
        title: 'Pressed state',
        description:
          'Use pressed for toggle-style actions whose selected state belongs to the surrounding application.',
        preview: <ButtonPressedExample />,
        code: `const [pressed, setPressed] = useState(false)

<Button
  text={pressed ? 'Pressed' : 'Not pressed'}
  pressed={pressed}
  viewProps={{ onClick: () => setPressed((current) => !current) }}
/>`,
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
