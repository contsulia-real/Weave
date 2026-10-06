import { access, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'

const rootDir = resolve('dist')
const entryFile = join(rootDir, 'package.d.ts')
const codeTypesFile = join(rootDir, 'core', 'code-types.d.ts')
const codeShikiTypesFile = join(rootDir, 'core', 'code-shiki-types.d.ts')
const checkOnly = process.argv.includes('--check')
const shikiTypeImport = "import type { BundledLanguage, LanguageRegistration } from 'shiki';"
const packagedTypeImport =
  "import type { BundledLanguage, LanguageRegistration } from './code-shiki-types';"

async function listDeclarationFiles(directory) {
  const files = []

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listDeclarationFiles(path)))
    } else if (entry.name.endsWith('.d.ts')) {
      files.push(path)
    }
  }

  return files
}

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function packagedShikiTypesDeclaration(bundledLanguages) {
  const languageUnion = Object.keys(bundledLanguages)
    .sort()
    .map((language) => `  | ${JSON.stringify(language)}`)
    .join('\n')

  return `export type BundledLanguage =
${languageUnion}

export interface LanguageRegistration {
  name: string
  scopeName: string
  repository: Readonly<Record<string, unknown>>
  patterns: readonly unknown[]
  displayName?: string
  aliases?: readonly string[]
  embeddedLangs?: readonly string[]
  embeddedLanguages?: readonly string[]
  embeddedLangsLazy?: readonly string[]
  balancedBracketSelectors?: readonly string[]
  unbalancedBracketSelectors?: readonly string[]
  foldingStopMarker?: string
  foldingStartMarker?: string
  injectTo?: readonly string[]
  injections?: Readonly<Record<string, unknown>>
  injectionSelector?: string
  fileTypes?: readonly string[]
  firstLineMatch?: string
}
`
}

async function prepareCodeDeclarations() {
  const { bundledLanguages } = await import('shiki')
  const expectedShikiTypes = packagedShikiTypesDeclaration(bundledLanguages)
  const codeTypesSource = await readFile(codeTypesFile, 'utf8')

  if (checkOnly) {
    if (
      codeTypesSource.includes(shikiTypeImport) ||
      !codeTypesSource.includes(packagedTypeImport)
    ) {
      throw new Error('Published Code declarations must not require Shiki types')
    }

    const packagedShikiTypes = await readFile(codeShikiTypesFile, 'utf8')
    if (packagedShikiTypes !== expectedShikiTypes) {
      throw new Error('Published Code language types are out of sync with Shiki')
    }
    return
  }

  if (!codeTypesSource.includes(shikiTypeImport)) {
    throw new Error('Code declaration output no longer matches the expected Shiki type import')
  }

  await writeFile(codeTypesFile, codeTypesSource.replace(shikiTypeImport, packagedTypeImport))
  await writeFile(codeShikiTypesFile, expectedShikiTypes)
}

async function resolveDeclaration(fromFile, specifier) {
  if (!specifier.startsWith('.')) return undefined

  const target = resolve(dirname(fromFile), specifier)
  const candidates = target.endsWith('.js')
    ? [`${target.slice(0, -3)}.d.ts`]
    : target.endsWith('.d.ts')
      ? [target]
      : [`${target}.d.ts`, join(target, 'index.d.ts')]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate
  }

  throw new Error(
    `Declaration graph contains an unresolved relative reference: ${relative(rootDir, fromFile)} -> ${specifier}`,
  )
}

async function declarationDependencies(file) {
  const source = await readFile(file, 'utf8')
  const dependencies = new Set()
  const moduleSpecifier = /(?:from\s*|import\s*(?:\(\s*)?)['"]([^'"]+)['"]/gu

  for (const match of source.matchAll(moduleSpecifier)) {
    const dependency = await resolveDeclaration(file, match[1])
    if (dependency) dependencies.add(dependency)
  }

  return dependencies
}

async function collectReachableDeclarations() {
  const reachable = new Set()
  const queue = [entryFile]

  while (queue.length > 0) {
    const file = queue.pop()
    if (!file || reachable.has(file)) continue

    reachable.add(file)
    for (const dependency of await declarationDependencies(file)) {
      queue.push(dependency)
    }
  }

  return reachable
}

await prepareCodeDeclarations()
const declarations = await listDeclarationFiles(rootDir)
const reachable = await collectReachableDeclarations()
const unreachable = declarations.filter((file) => !reachable.has(file))

if (checkOnly && unreachable.length > 0) {
  throw new Error(
    `Found unreachable declaration files:\n${unreachable
      .map((file) => `- ${relative(rootDir, file)}`)
      .join('\n')}`,
  )
}

if (!checkOnly) {
  await Promise.all(unreachable.map((file) => rm(file)))
}

console.log(
  checkOnly
    ? `Declaration graph verified: ${reachable.size} reachable files.`
    : `Declaration graph pruned: kept ${reachable.size}, removed ${unreachable.length} files.`,
)
