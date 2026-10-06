import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'

export const themeComponentExamples: Record<string, DocumentationComponentDocumentationDefinition> =
  {
    ThemeProvider: {
      description:
        'Scopes theme definition, color mode, and reduced-motion preference for descendant Weave UI.',
      examples: [basicExample('ThemeProvider/basic-usage')],
    },
  }
