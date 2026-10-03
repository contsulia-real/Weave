import { documentationComponentExampleAdditions } from './documentation-component-example-additions'
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

for (const [componentName, examples] of Object.entries(documentationComponentExampleAdditions)) {
  const definition = definitions[componentName]

  if (definition === undefined) {
    throw new Error(`Missing Documentation component definition for ${componentName}`)
  }

  definitions[componentName] = {
    ...definition,
    examples: [...definition.examples, ...examples],
  }
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
