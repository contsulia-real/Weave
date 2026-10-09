import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'

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
        demo: 'Typo/display',
      },
      {
        id: 'headline',
        title: 'Headline',
        description: 'Headline styles establish major section hierarchy below display text.',
        demo: 'Typo/headline',
      },
      {
        id: 'title',
        title: 'Title',
        description: 'Title styles label cards, panels, and smaller content regions.',
        demo: 'Typo/title',
      },
      {
        id: 'body',
        title: 'Body',
        description:
          'Body styles cover ordinary reading text from standard copy down to compact supporting text.',
        demo: 'Typo/body',
      },
      {
        id: 'label',
        title: 'Label',
        description: 'Label styles provide compact emphasized text for controls and metadata.',
        demo: 'Typo/label',
      },
    ],
  },
  Text: {
    description:
      'Theme-driven text with typography, emphasis, alignment, wrapping, and case controls.',
    examples: [basicExample('Text/basic-usage')],
  },
  Code: {
    description:
      'A syntax-highlighted code block backed by Weave typography and scrolling behavior.',
    examples: [basicExample('Code/basic-usage')],
  },
  Image: {
    description:
      'An image host with explicit fit, position, loading, and accessible alternative text.',
    examples: [basicExample('Image/basic-usage')],
  },
  Icon: {
    description:
      'Renders an icon source through Weave size, stroke, color, and ViewHost semantics.',
    examples: [basicExample('Icon/basic-usage')],
  },
  Avatar: {
    description: 'Displays a person or entity image with a semantic name and fallback content.',
    examples: [basicExample('Avatar/basic-usage')],
  },
  Divider: {
    description: 'A horizontal or vertical separator with configurable gap and line thickness.',
    examples: [basicExample('Divider/basic-usage')],
  },
  Link: {
    description:
      'A semantic anchor with Weave link styling and optional external-link affordances.',
    examples: [basicExample('Link/basic-usage')],
  },
  Breadcrumb: {
    description:
      'A hierarchy of page links ending with the current page, using native navigation semantics.',
    examples: [
      basicExample('Breadcrumb/basic-usage'),
      {
        id: 'custom-separator',
        title: 'Custom separator',
        description: 'Provide separator to replace the default chevron between levels.',
        demo: 'Breadcrumb/custom-separator',
      },
      {
        id: 'dropdown-items',
        title: 'Dropdown items',
        description:
          'Group sibling component pages using the existing Documentation accordion categories.',
        demo: 'Breadcrumb/dropdown-items',
      },
      {
        id: 'single-level',
        title: 'Single level',
        description: 'Use one item when the current page has no parent trail.',
        demo: 'Breadcrumb/single-level',
      },
    ],
  },
  Badge: {
    description: 'Anchors a compact text or dot indicator to another piece of content.',
    examples: [basicExample('Badge/basic-usage')],
  },
  Button: {
    description: 'A semantic action control with themed variants, sizes, pressed state, and icons.',
    examples: [
      {
        id: 'basic-button',
        title: 'Basic button',
        description:
          'Use the same Button component for different emphasis levels without changing its action semantics.',
        demo: 'Button/basic-button',
      },
      {
        id: 'handling-clicks',
        title: 'Handling clicks',
        description:
          'Button event handlers are supplied through viewProps, preserving the native button event surface.',
        demo: 'Button/handling-clicks',
      },
      {
        id: 'icons-and-labels',
        title: 'Icons and labels',
        description:
          'Pair semantic text with an icon at either edge when the action benefits from a visual cue.',
        demo: 'Button/icons-and-labels',
      },
      {
        id: 'icon-only-actions',
        title: 'Icon-only actions',
        description:
          'For compact actions, omit text and provide the accessible name through the button viewProps.',
        demo: 'Button/icon-only-actions',
      },
      {
        id: 'form-actions',
        title: 'Form actions',
        description:
          'Use native button types inside Form so submit and reset behavior remains browser-native.',
        demo: 'Button/form-actions',
      },
      {
        id: 'pressed-state',
        title: 'Pressed state',
        description:
          'Use pressed for toggle-style actions whose selected state belongs to the surrounding application.',
        demo: 'Button/pressed-state',
      },
      {
        id: 'disabled-actions',
        title: 'Disabled actions',
        description:
          'Disable actions that cannot currently run while keeping their semantic button role.',
        demo: 'Button/disabled-actions',
      },
      {
        id: 'custom-content',
        title: 'Custom content',
        description:
          'Use children when an action needs richer composition than the semantic text-and-icon shortcut.',
        demo: 'Button/custom-content',
      },
      {
        id: 'responsive-button',
        title: 'Responsive button',
        description:
          'Button can change its size and emphasis at viewport breakpoints without replacing the component.',
        demo: 'Button/responsive-button',
      },
    ],
  },
  SegmentedButton: {
    description:
      'A connected group of real Button controls with optional single or multiple selection.',
    examples: [
      {
        id: 'default-selection',
        title: 'Default selection',
        description:
          'Use defaultSelected to choose the initial item while keeping the group uncontrolled.',
        demo: 'SegmentedButton/default-selection',
      },
      {
        id: 'multiple-selection',
        title: 'Multiple selection',
        description:
          'Multiple selection toggles each segment independently while retaining Button pressed feedback.',
        demo: 'SegmentedButton/multiple-selection',
      },
    ],
  },
  Card: {
    description: 'A themed surface that can optionally expose click and selection states.',
    examples: [basicExample('Card/basic-usage')],
  },
  AppBar: {
    description:
      'A top application bar with leading, title, trailing, size, mode, and elevation slots.',
    examples: [basicExample('AppBar/basic-usage')],
  },
}
