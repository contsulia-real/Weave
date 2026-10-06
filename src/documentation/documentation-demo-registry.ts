import type { ComponentType } from 'react'

interface DocumentationDemoModule {
  default: ComponentType
}

export interface DocumentationDemo {
  component: ComponentType
  source: string
}

type DocumentationDemoModuleLoader = () => Promise<DocumentationDemoModule>
type DocumentationDemoSourceLoader = () => Promise<string>

const demoModules = import.meta.glob('./demos/**/*.tsx') as Record<
  string,
  DocumentationDemoModuleLoader
>

const demoSources = import.meta.glob('./demos/**/*.tsx', {
  import: 'default',
  query: '?raw',
}) as Record<string, DocumentationDemoSourceLoader>

const demoCache = new Map<string, Promise<DocumentationDemo>>()

export function documentationDemo(key: string): Promise<DocumentationDemo> {
  const path = `./demos/${key}.tsx`
  const cached = demoCache.get(path)
  if (cached !== undefined) return cached

  const loadModule = demoModules[path]
  const loadSource = demoSources[path]

  if (loadModule === undefined || loadSource === undefined) {
    throw new Error(`Missing Documentation demo: ${key}`)
  }

  const demo = Promise.all([loadModule(), loadSource()]).then(([module, source]) => ({
    component: module.default,
    source: source.trimEnd(),
  }))

  demoCache.set(path, demo)
  return demo
}
