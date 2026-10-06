import type { ReactNode } from 'react'

export interface DocumentationComponentExampleDefinition {
  id: string
  title: string
  description?: ReactNode
  demo: string
}

export interface DocumentationComponentDocumentationDefinition {
  description: string
  examples: readonly DocumentationComponentExampleDefinition[]
  apiComponents?: readonly string[]
}

export function basicExample(demo: string): DocumentationComponentExampleDefinition {
  return {
    id: 'basic-usage',
    title: 'Basic usage',
    demo,
  }
}
