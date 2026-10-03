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
import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'

const sampleImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect width="320" height="180" rx="24" fill="%238E8E93"/%3E%3Ccircle cx="92" cy="72" r="28" fill="%23FFFFFF"/%3E%3Cpath d="M34 150l72-62 45 38 38-32 97 56H34z" fill="%23FFFFFF"/%3E%3C/svg%3E'

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
      basicExample(
        <Button text="Button" variant="primary" size="medium" />,
        `<Button text="Button" variant="primary" size="medium" />`,
      ),
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
