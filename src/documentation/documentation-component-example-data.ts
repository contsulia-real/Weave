import type { ReactNode } from 'react'

export type DocumentationExampleCodeMode = 'expression' | 'body'

export interface DocumentationComponentExampleDefinition {
  id: string
  title: string
  description?: ReactNode
  preview: ReactNode
  code: string
  codeMode?: DocumentationExampleCodeMode
}

export interface DocumentationComponentDocumentationDefinition {
  description: string
  examples: readonly DocumentationComponentExampleDefinition[]
  apiComponents?: readonly string[]
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
    codeMode: 'expression',
  }
}
