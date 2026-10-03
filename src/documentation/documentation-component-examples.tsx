import type { DocumentationComponentDocumentationDefinition } from './documentation-component-example-data'
import { compositeComponentExamples } from './documentation-component-examples-composite'
import { contentComponentExamples } from './documentation-component-examples-content'
import { formsComponentExamples } from './documentation-component-examples-forms'
import { foundationComponentExamples } from './documentation-component-examples-foundation'
import { themeComponentExamples } from './documentation-component-examples-theme'

const definitions: Record<string, DocumentationComponentDocumentationDefinition> = {
  ...foundationComponentExamples,
  ...contentComponentExamples,
  ...formsComponentExamples,
  ...compositeComponentExamples,
  ...themeComponentExamples,
}

export function documentationComponentDocumentation(
  componentName: string,
): DocumentationComponentDocumentationDefinition {
  const definition = definitions[componentName]

  if (definition === undefined) {
    throw new Error(`Missing Documentation component definition for ${componentName}`)
  }

  return definition
}
