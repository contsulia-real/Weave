import { IconDots, IconSearch, IconStar } from '@tabler/icons-react'
import type { ComponentType } from 'react'
import * as React from 'react'
import * as ReactJsxRuntime from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import ts from 'typescript'
import * as Weave from '../index'
import { documentationSampleImage } from './documentation-example-fixtures'

const runtimeModules: Readonly<Record<string, unknown>> = {
  '@tabler/icons-react': {
    IconDots,
    IconSearch,
    IconStar,
  },
  '../../../index': Weave,
  '../../documentation-example-fixtures': {
    documentationSampleImage,
  },
  react: React,
  'react/jsx-runtime': ReactJsxRuntime,
  'react-i18next': { useTranslation },
}

function diagnosticText(diagnostic: ts.Diagnostic): string {
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
}

function requireRuntimeModule(specifier: string): unknown {
  const module = runtimeModules[specifier]

  if (module === undefined) {
    throw new Error(`Unsupported demo import: ${specifier}`)
  }

  return module
}

export function compileDocumentationExample(source: string): ComponentType {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    reportDiagnostics: true,
  })

  const errors = result.diagnostics?.filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  )

  if (errors !== undefined && errors.length > 0) {
    throw new SyntaxError(errors.map(diagnosticText).join('\n'))
  }

  const module = { exports: {} as Record<string, unknown> }
  const factory = new Function(
    'require',
    'module',
    'exports',
    `${result.outputText}\nreturn module.exports`,
  ) as (
    require: (specifier: string) => unknown,
    module: { exports: Record<string, unknown> },
    exports: Record<string, unknown>,
  ) => Record<string, unknown>

  const compiled = factory(requireRuntimeModule, module, module.exports)
  const component = compiled.default

  if (typeof component !== 'function') {
    throw new TypeError('Editable example did not produce a default React component export.')
  }

  return component as ComponentType
}
