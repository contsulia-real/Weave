import {
  IconDeviceDesktop,
  IconDots,
  IconFile,
  IconFolder,
  IconMoon,
  IconSearch,
  IconSettings,
  IconSparkles,
  IconStar,
  IconSun,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'
import * as React from 'react'
import * as ReactJsxRuntime from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import * as Weave from '../index'
import { documentationSampleImage } from './documentation-example-fixtures'
import {
  componentNavigationSections,
  documentationComponentNavigationItems,
  documentationNavigationSectionForPath,
} from './documentation-navigation-data'
import { useDocsRoute } from './router'

const runtimeModules: Readonly<Record<string, unknown>> = {
  '@tabler/icons-react': {
    IconDeviceDesktop,
    IconDots,
    IconFile,
    IconFolder,
    IconMoon,
    IconSearch,
    IconSettings,
    IconSparkles,
    IconStar,
    IconSun,
  },
  '../../../index': Weave,
  '../../documentation-navigation-data': {
    componentNavigationSections,
    documentationComponentNavigationItems,
    documentationNavigationSectionForPath,
  },
  '../../documentation-example-fixtures': {
    documentationSampleImage,
  },
  '../../router': { useDocsRoute },
  react: React,
  'react/jsx-runtime': ReactJsxRuntime,
  'react-i18next': { useTranslation },
}

function requireRuntimeModule(specifier: string): unknown {
  const module = runtimeModules[specifier]

  if (module === undefined) {
    throw new Error(`Unsupported demo import: ${specifier}`)
  }

  return module
}

export function evaluateDocumentationExample(outputText: string): ComponentType {
  const module = { exports: {} as Record<string, unknown> }
  const factory = new Function(
    'require',
    'module',
    'exports',
    `${outputText}\nreturn module.exports`,
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
