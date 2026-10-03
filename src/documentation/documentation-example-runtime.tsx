import { IconDots, IconSearch, IconStar } from '@tabler/icons-react'
import type { ComponentType } from 'react'
import * as React from 'react'
import ts from 'typescript'
import * as Weave from '../index'
import type { DocumentationExampleCodeMode } from './documentation-component-example-data'
import { documentationSampleImage } from './documentation-example-fixtures'

const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const reservedIdentifiers = new Set([
  'await',
  'class',
  'const',
  'default',
  'delete',
  'export',
  'extends',
  'function',
  'import',
  'let',
  'new',
  'return',
  'static',
  'super',
  'this',
  'typeof',
  'var',
  'void',
  'yield',
])

const runtimeScope: Readonly<Record<string, unknown>> = {
  React,
  ...React,
  ...Weave,
  IconDots,
  IconSearch,
  IconStar,
  imageUrl: documentationSampleImage,
}

function diagnosticText(diagnostic: ts.Diagnostic): string {
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
}

export function compileDocumentationExample(
  source: string,
  mode: DocumentationExampleCodeMode,
): ComponentType {
  const componentSource =
    mode === 'body'
      ? `function DocumentationLiveExample() {\n${source}\n}`
      : `function DocumentationLiveExample() {\n  return (\n${source}\n  )\n}`

  const result = ts.transpileModule(componentSource, {
    compilerOptions: {
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
    reportDiagnostics: true,
  })

  const errors = result.diagnostics?.filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  )

  if (errors !== undefined && errors.length > 0) {
    throw new SyntaxError(errors.map(diagnosticText).join('\n'))
  }

  const entries = Object.entries(runtimeScope).filter(
    ([name]) => identifierPattern.test(name) && !reservedIdentifiers.has(name),
  )
  const names = entries.map(([name]) => name)
  const values = entries.map(([, value]) => value)
  const factory = new Function(
    ...names,
    `${result.outputText}\nreturn DocumentationLiveExample`,
  ) as (...scopeValues: unknown[]) => unknown
  const component = factory(...values)

  if (typeof component !== 'function') {
    throw new TypeError('Editable example did not produce a React component.')
  }

  return component as ComponentType
}
