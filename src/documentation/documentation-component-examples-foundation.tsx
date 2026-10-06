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
    examples: [basicExample('View/basic-usage')],
  },
  Layout: {
    description:
      'Weave layout primitives for flex, row, column, grid, stacking, absolute positioning, and split panes.',
    apiComponents: ['Flex', 'Row', 'Column', 'Grid', 'Stack', 'Absolute', 'SplitBox'],
    examples: [
      {
        id: 'flex',
        title: 'Flex',
        demo: 'Layout/flex',
      },
      {
        id: 'row',
        title: 'Row',
        demo: 'Layout/row',
      },
      {
        id: 'column',
        title: 'Column',
        demo: 'Layout/column',
      },
      {
        id: 'grid',
        title: 'Grid',
        demo: 'Layout/grid',
      },
      {
        id: 'stack',
        title: 'Stack',
        demo: 'Layout/stack',
      },
      {
        id: 'absolute',
        title: 'Absolute',
        demo: 'Layout/absolute',
      },
      {
        id: 'splitbox',
        title: 'SplitBox',
        demo: 'Layout/splitbox',
      },
    ],
  },
  Presence: {
    description:
      'Keeps enter/exit content mounted long enough for Weave presence motion to complete.',
    examples: [basicExample('Presence/basic-usage')],
  },
}
