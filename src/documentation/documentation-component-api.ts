import apiData from './generated/documentation-component-api.json'

export interface DocumentationApiProp {
  name: string
  description: string
  type: string
  optional: boolean
}

export interface DocumentationComponentApi {
  importPath: string
  nativeProps: boolean
  hasViewProps: boolean
  usesViewProps: boolean
  props: readonly DocumentationApiProp[]
}

interface GeneratedComponentApi {
  importPath: string
  nativeProps: boolean
  hasViewProps: boolean
  usesViewProps: boolean
  props: string
}

interface GeneratedDocumentationApi {
  components: Record<string, GeneratedComponentApi>
  profiles: Record<string, readonly string[]>
  props: Record<string, DocumentationApiProp>
}

const generated = apiData as GeneratedDocumentationApi

function profile(profileId: string): readonly DocumentationApiProp[] {
  const propIds = generated.profiles[profileId]

  if (propIds === undefined) {
    throw new Error(`Missing Documentation API profile ${profileId}`)
  }

  return propIds.map((propId) => {
    const prop = generated.props[propId]

    if (prop === undefined) {
      throw new Error(`Missing Documentation API prop ${propId}`)
    }

    return prop
  })
}

export function documentationComponentApi(componentName: string): DocumentationComponentApi {
  const component = generated.components[componentName]

  if (component === undefined) {
    throw new Error(`Missing Documentation API metadata for ${componentName}`)
  }

  return {
    importPath: component.importPath,
    nativeProps: component.nativeProps,
    hasViewProps: component.hasViewProps,
    usesViewProps: component.usesViewProps,
    props: profile(component.props),
  }
}
