import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'

export const compositeComponentExamples: Record<
  string,
  DocumentationComponentDocumentationDefinition
> = {
  Form: {
    description:
      'A semantic form root that preserves native submit/reset behavior while using Weave layout.',
    apiComponents: [
      'Form',
      'FormField',
      'FormLabel',
      'FormDescription',
      'FormError',
      'FormFieldset',
      'FormLegend',
    ],
    examples: [basicExample('Form/basic-usage')],
  },
  Table: {
    description:
      'A structured table surface with density, borders, sticky header, and optional cell selection.',
    apiComponents: ['Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell'],
    examples: [basicExample('Table/basic-usage')],
  },
  DataGrid: {
    description:
      'A data-driven table with sorting, column resizing, row and cell selection, and virtualized rows.',
    examples: [basicExample('DataGrid/basic-usage')],
  },
  Accordion: {
    description:
      'A single- or multi-open disclosure group with shared item, trigger, and panel semantics.',
    apiComponents: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionPanel'],
    examples: [basicExample('Accordion/basic-usage')],
  },
  ToolTip: {
    description: 'A delayed, positioned tooltip attached to a single trigger element.',
    examples: [basicExample('ToolTip/basic-usage')],
  },
  Popover: {
    description:
      'A positioned non-modal surface anchored to a trigger with focus and placement controls.',
    examples: [basicExample('Popover/basic-usage')],
  },
  Dialog: {
    description:
      'A dialog surface that supports non-modal anchored and native modal top-layer modes.',
    examples: [basicExample('Dialog/basic-usage')],
  },
  Drawer: {
    description:
      'A side surface that reuses modal Dialog on narrow layouts and SplitBox for non-modal layouts.',
    examples: [basicExample('Drawer/basic-usage')],
  },
  Menu: {
    description:
      'A trigger-anchored command menu with keyboard focus, placement, and selection dismissal.',
    apiComponents: ['Menu', 'MenuItem'],
    examples: [basicExample('Menu/basic-usage')],
  },
  Tabs: {
    description:
      'Coordinates TabList, Tab, and TabPanel with orientation, activation, and indicator variants.',
    apiComponents: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
    examples: [basicExample('Tabs/basic-usage')],
  },
  Snack: {
    description:
      'A transient status or alert message rendered through SnackProvider, with lifetime, progress, placement, and semantic variants.',
    apiComponents: ['Snack', 'SnackProvider'],
    examples: [
      {
        id: 'basic-usage',
        title: 'Basic usage',
        demo: 'Snack/basic-usage',
      },
    ],
  },
  List: {
    description:
      'A vertical or horizontal item collection with optional selection and virtualization semantics.',
    apiComponents: ['List', 'ListItem'],
    examples: [basicExample('List/basic-usage')],
  },
}
