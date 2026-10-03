import type { DocumentationComponentDefinition } from './documentation-component-playground-data'
import { compositeComponentDefinitions } from './documentation-component-playgrounds-composite'
import { contentComponentDefinitions } from './documentation-component-playgrounds-content'
import { formsComponentDefinitions } from './documentation-component-playgrounds-forms'
import { foundationComponentDefinitions } from './documentation-component-playgrounds-foundation'
import { themeComponentDefinitions } from './documentation-component-playgrounds-theme'

export type {
  DocumentationComponentDefinition,
  DocumentationPlaygroundControl,
  DocumentationPlaygroundOverrides,
  DocumentationPlaygroundValue,
} from './documentation-component-playground-data'

const definitions: Record<string, DocumentationComponentDefinition> = {
  ...foundationComponentDefinitions,
  ...contentComponentDefinitions,
  ...formsComponentDefinitions,
  ...compositeComponentDefinitions,
  ...themeComponentDefinitions,
}

export function documentationComponentDefinition(
  componentName: string,
): DocumentationComponentDefinition {
  const definition = definitions[componentName]

  if (definition === undefined) {
    throw new Error(`Missing Documentation component definition for ${componentName}`)
  }

  return definition
}
