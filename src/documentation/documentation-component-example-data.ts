import type { ReactNode } from 'react'

export interface DocumentationComponentExampleDefinition {
  id: string
  title: string
  preview: ReactNode
  code: string
}

export interface DocumentationComponentDocumentationDefinition {
  description: string
  examples: readonly DocumentationComponentExampleDefinition[]
}

export function basicExample(
  preview: ReactNode,
  code: string,
): DocumentationComponentExampleDefinition {
  return {
    id: 'basic-usage',
    title: 'Basic usage',
    preview,
    code,
  }
}
