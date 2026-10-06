import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const checkOnly = process.argv.includes('--check')
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const slash = (file) => file.replace(/\\/g, '/')
const api = readJson(
  path.join(root, 'src/documentation/generated/documentation-component-api.json'),
)
const guidance = readJson(path.join(root, 'ai/guidance.json'))
const packageJson = readJson(path.join(root, 'package.json'))

function filesUnder(directory, suffix) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const file = path.join(directory, entry.name)
      return entry.isDirectory()
        ? filesUnder(file, suffix)
        : entry.name.endsWith(suffix)
          ? [file]
          : []
    })
    .sort()
}

function sourceFile(file) {
  return ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
}

const literal = (node) =>
  ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : undefined
const propertyName = (name) =>
  ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)
    ? name.text
    : undefined
const objectProperty = (object, name) =>
  object.properties.find(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  )

function rootRuntimeExports() {
  const source = sourceFile(path.join(root, 'src/package.ts'))
  const output = []

  for (const statement of source.statements) {
    if (
      !ts.isExportDeclaration(statement) ||
      statement.isTypeOnly ||
      statement.exportClause === undefined ||
      !ts.isNamedExports(statement.exportClause)
    ) {
      continue
    }

    for (const item of statement.exportClause.elements) {
      if (!item.isTypeOnly) output.push(item.name.text)
    }
  }

  return output.sort()
}

function navigationMetadata() {
  const source = sourceFile(path.join(root, 'src/documentation/documentation-navigation-data.ts'))
  const categories = {}
  const parents = {}

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'componentSection'
    ) {
      const category = literal(node.arguments[0])
      const list = node.arguments[2]
      if (category !== undefined && list !== undefined && ts.isArrayLiteralExpression(list)) {
        for (const item of list.elements) {
          const name = literal(item)
          if (name !== undefined && name !== 'Typo' && name !== 'Layout')
            categories[name] = category
        }
      }
    }

    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'apiDemoParents' &&
      node.initializer !== undefined
    ) {
      let value = node.initializer
      while (ts.isAsExpression(value) || ts.isSatisfiesExpression(value)) value = value.expression
      if (ts.isObjectLiteralExpression(value)) {
        for (const property of value.properties) {
          if (!ts.isPropertyAssignment(property)) continue
          const name = propertyName(property.name)
          const parent = literal(property.initializer)
          if (name !== undefined && parent !== undefined) parents[name] = parent
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  for (const [name, parent] of Object.entries(parents)) {
    if (categories[name] === undefined && categories[parent] !== undefined)
      categories[name] = categories[parent]
  }
  return { categories, parents }
}

function documentationMetadata() {
  const examples = {}
  const descriptions = {}
  const directory = path.join(root, 'src/documentation')

  for (const file of filesUnder(directory, '.tsx').filter((item) =>
    path.basename(item).startsWith('documentation-component-example'),
  )) {
    const source = sourceFile(file)

    function visit(node) {
      if (ts.isPropertyAssignment(node) && ts.isObjectLiteralExpression(node.initializer)) {
        const name = propertyName(node.name)
        const description = objectProperty(node.initializer, 'description')
        const exampleList = objectProperty(node.initializer, 'examples')
        if (
          name !== undefined &&
          /^[A-Z]/.test(name) &&
          description !== undefined &&
          exampleList !== undefined
        ) {
          const text = literal(description.initializer)
          if (text !== undefined) descriptions[name] = text
        }
      }

      if (ts.isObjectLiteralExpression(node)) {
        const demo = objectProperty(node, 'demo')
        if (demo !== undefined) {
          const id = literal(demo.initializer)
          const title = objectProperty(node, 'title')
          const description = objectProperty(node, 'description')
          if (id !== undefined) {
            examples[id] = {
              title: title === undefined ? undefined : literal(title.initializer),
              description: description === undefined ? undefined : literal(description.initializer),
            }
          }
        }
      }

      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'basicExample'
      ) {
        const id = literal(node.arguments[0])
        if (id !== undefined && examples[id] === undefined) examples[id] = { title: 'Basic usage' }
      }

      ts.forEachChild(node, visit)
    }

    visit(source)
  }

  return { examples, descriptions }
}

function importedComponents(source, publicComponents) {
  const output = new Set()

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
      continue
    const moduleName = statement.moduleSpecifier.text
    const bindings = statement.importClause?.namedBindings
    if (
      bindings === undefined ||
      !ts.isNamedImports(bindings) ||
      !(
        moduleName === packageJson.name ||
        moduleName.startsWith(`${packageJson.name}/components/`) ||
        /(?:^|\/)index$/.test(moduleName)
      )
    ) {
      continue
    }

    for (const item of bindings.elements) {
      const name = item.propertyName?.text ?? item.name.text
      if (publicComponents.has(name)) output.add(name)
    }
  }

  return [...output].sort()
}

function keywords(...values) {
  const stop = new Set(['and', 'for', 'from', 'the', 'with', 'into', 'use', 'using'])
  const words = values
    .flat()
    .filter(Boolean)
    .join(' ')
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3 && !stop.has(word))
  return [...new Set(words)].sort()
}

function examplesManifest(navigation, docs) {
  const publicComponents = new Set(Object.keys(api.components))
  const directory = path.join(root, 'src/documentation/demos')

  return filesUnder(directory, '.tsx').map((file) => {
    const relative = slash(path.relative(directory, file))
    const id = relative.replace(/\.tsx$/, '')
    const folder = relative.split('/')[0]
    const meta = docs.examples[id] ?? {}
    const components = importedComponents(sourceFile(file), publicComponents)
    const component = navigation.parents[folder] ?? folder
    return {
      id,
      component,
      title: meta.title ?? path.basename(id).replaceAll('-', ' '),
      description: meta.description,
      components,
      concepts: keywords(id, meta.title, meta.description, components),
      documentationRoute: `/docs/components/${component}`,
      source: fs.readFileSync(file, 'utf8').trimEnd(),
    }
  })
}

function unwrap(node) {
  let value = node
  while (
    ts.isAsExpression(value) ||
    ts.isSatisfiesExpression(value) ||
    ts.isParenthesizedExpression(value) ||
    ts.isTypeAssertionExpression(value)
  ) {
    value = value.expression
  }
  return value
}

function staticThemeValue(name) {
  const source = sourceFile(path.join(root, 'src/theme/default-theme.ts'))
  const declarations = new Map()

  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer !== undefined) {
        declarations.set(declaration.name.text, declaration.initializer)
      }
    }
  }

  function evaluate(node, stack = new Set()) {
    const value = unwrap(node)
    if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) return value.text
    if (ts.isNumericLiteral(value)) return Number(value.text)
    if (value.kind === ts.SyntaxKind.TrueKeyword) return true
    if (value.kind === ts.SyntaxKind.FalseKeyword) return false
    if (value.kind === ts.SyntaxKind.NullKeyword) return null

    if (ts.isPrefixUnaryExpression(value)) {
      const operand = evaluate(value.operand, stack)
      if (typeof operand !== 'number') throw new Error('Theme unary value must be numeric.')
      return value.operator === ts.SyntaxKind.MinusToken ? -operand : operand
    }

    if (ts.isArrayLiteralExpression(value))
      return value.elements.map((item) => evaluate(item, stack))

    if (ts.isObjectLiteralExpression(value)) {
      const output = {}
      for (const property of value.properties) {
        if (ts.isSpreadAssignment(property)) {
          Object.assign(output, evaluate(property.expression, stack))
          continue
        }
        if (ts.isShorthandPropertyAssignment(property)) {
          output[property.name.text] = evaluate(property.name, stack)
          continue
        }

        if (!ts.isPropertyAssignment(property)) {
          throw new Error(`Unsupported Theme property: ${property.getText()}`)
        }
        const key = propertyName(property.name)
        if (key === undefined) throw new Error(`Unsupported Theme key: ${property.getText()}`)
        output[key] = evaluate(property.initializer, stack)
      }
      return output
    }

    if (ts.isPropertyAccessExpression(value)) {
      const object = evaluate(value.expression, stack)
      if (object === null || typeof object !== 'object') {
        throw new Error(`Theme property access needs an object: ${value.getText()}`)
      }
      return object[value.name.text]
    }

    if (ts.isIdentifier(value)) {
      if (value.text === 'undefined') return undefined
      if (stack.has(value.text)) throw new Error(`Circular Theme reference: ${value.text}`)
      const initializer = declarations.get(value.text)
      if (initializer === undefined) throw new Error(`Unknown Theme identifier: ${value.text}`)
      return evaluate(initializer, new Set([...stack, value.text]))
    }

    throw new Error(`Unsupported Theme expression: ${value.getText()}`)
  }

  const initializer = declarations.get(name)
  if (initializer === undefined) throw new Error(`Missing Theme declaration: ${name}`)
  return evaluate(initializer)
}

function themeManifest() {
  const light = staticThemeValue('defaultThemeTemplate')
  return {
    generatedFrom: 'src/theme/default-theme.ts',
    defaultSeed: staticThemeValue('DEFAULT_THEME_COLOR_SEED'),
    breakpoints: staticThemeValue('defaultBreakpoints'),
    layers: light.layers,
    tokens: light.tokens,
    components: light.components,
    darkOverride: staticThemeValue('defaultDarkThemeTemplate'),
  }
}

function componentsManifest(navigation, docs, examples) {
  const examplesByComponent = new Map()
  for (const example of examples) {
    for (const name of example.components) {
      const list = examplesByComponent.get(name) ?? []
      list.push(example.id)
      examplesByComponent.set(name, list)
    }
  }

  return Object.fromEntries(
    Object.keys(api.components)
      .sort()
      .map((name) => {
        const metadata = api.components[name]
        const parent = navigation.parents[name]
        const guide = guidance.components[name] ?? {}
        const profile = api.profiles[metadata.props] ?? []
        return [
          name,
          {
            name,
            import: `import { ${name} } from '${metadata.importPath}'`,
            importPath: metadata.importPath,
            category:
              navigation.categories[name] ?? navigation.categories[parent] ?? 'uncategorized',
            intent: guide.intent ?? docs.descriptions[name] ?? `Public Weave ${name} component.`,
            preferWhen: guide.preferWhen ?? [],
            avoidWhen: guide.avoidWhen ?? [],
            alternatives: guide.alternatives ?? [],
            relationship: {
              demoParent: parent ?? null,
              standaloneDocumentationPage: parent === undefined,
            },
            viewPropsMode:
              name === 'View'
                ? 'direct'
                : metadata.hasViewProps
                  ? 'nested'
                  : metadata.usesViewProps
                    ? 'direct'
                    : 'none',
            nativeProps: metadata.nativeProps,
            documentationRoute: `/docs/components/${parent ?? name}`,
            apiRoute: `/docs/components-api/${name}`,
            examples: examplesByComponent.get(name) ?? [],
            props: profile.map((id) => api.props[id]),
          },
        ]
      }),
  )
}

function selectedConstraints(spec) {
  const wanted = new Set([
    1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 29, 30, 31, 39, 41, 42,
  ])
  const start = spec.indexOf('# 28. 全局硬约束汇总')
  if (start < 0) return []
  return spec
    .slice(start)
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(/^(\d+)\.\s+(.*)$/)
      return match !== null && wanted.has(Number(match[1])) ? [`${match[1]}. ${match[2]}`] : []
    })
}

function packageSection(spec) {
  const start = spec.indexOf('### 1.2 包导出模型')
  if (start < 0) return ''
  const end = spec.indexOf('\n---', start)
  return spec.slice(start, end < 0 ? undefined : end).trim()
}

function generatedDesign(spec, framework) {
  return `# Weave Design for LLMs

> Generated by \`pnpm ai:generate\`. \`Weave UI.md\` is authoritative; do not edit this file by hand.

Weave is a browser-native React UI framework. React DOM + real DOM + CSS is the only rendering path. Public APIs are semantic and the browser remains responsible for native Web behavior.

## Package model

${packageSection(spec)}

Root runtime exports: ${framework.rootRuntimeExports.map((name) => `\`${name}\``).join(', ')}.

## High-value hard constraints

${selectedConstraints(spec).join('\n')}

## Component-selection guide

${guidance.decisionGuide.map((item) => `- **${item.id}** — ${item.rule}`).join('\n')}

## Machine-readable sources

- \`ai/generated/framework.json\`
- \`ai/generated/components.json\`
- \`ai/generated/examples.json\`
- \`ai/generated/theme.json\`
- \`ai/guidance.json\` contains only LLM selection intent annotations.

For exact behavior, read \`Weave UI.md\`.
`
}

function generatedLlms() {
  return `# Weave

> Browser-native React UI framework with semantic components, real DOM, and CSS.

## Imports
- Root application/theme runtime: \`${packageJson.name}\`.
- Components: \`${packageJson.name}/components/<ComponentName>\`.
- \`ThemeProvider\` is a root runtime export and imports from \`${packageJson.name}\`.
- \`${packageJson.name}/components/internal/*\` is package-private.

## LLM resources
- \`DESIGN.md\` — generated concise design contract.
- \`ai/generated/framework.json\` — package and framework contract.
- \`ai/generated/components.json\` — component intent, imports, props, relationships, and examples.
- \`ai/generated/examples.json\` — real Documentation demo source.
- \`ai/generated/theme.json\` — default Theme projection.

## Agent workflow
1. Search by intent.
2. Read the component contract and a real example.
3. Generate package-correct imports.
4. Run \`pnpm ai:check -- <files>\`.
5. Use \`pnpm ai:mcp\` from MCP-capable clients.

Authoritative design: \`Weave UI.md\`.
Public API: \`src/index.ts\`.
Root runtime: \`src/package.ts\`.
Real examples: \`src/documentation/demos/**/*.tsx\`.
`
}

function emit(file, content) {
  const next = content.endsWith('\n') ? content : `${content}\n`
  if (checkOnly) {
    let current

    try {
      current = fs.readFileSync(file, 'utf8')
    } catch {
      current = undefined
    }

    const currentMatches =
      file.endsWith('.json') && current !== undefined
        ? JSON.stringify(JSON.parse(current)) === JSON.stringify(JSON.parse(next))
        : current === next

    if (!currentMatches) {
      console.error(
        `AI metadata is stale: ${slash(path.relative(root, file))}. Run "pnpm ai:generate".`,
      )
      process.exitCode = 1
    }
    return
  }

  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, next)
}

const navigation = navigationMetadata()
const docs = documentationMetadata()
const examples = examplesManifest(navigation, docs)
const components = componentsManifest(navigation, docs, examples)
const runtimeExports = rootRuntimeExports()
const spec = fs.readFileSync(path.join(root, 'Weave UI.md'), 'utf8')
const framework = {
  generatedFrom: [
    'src/package.ts',
    'src/index.ts',
    'src/documentation/generated/documentation-component-api.json',
    'src/documentation/demos/**/*.tsx',
    'src/documentation/documentation-navigation-data.ts',
    'Weave UI.md',
  ],
  package: packageJson.name,
  platform: 'web',
  host: 'React DOM',
  rendering: 'real DOM + CSS',
  rootRuntimeExports: runtimeExports,
  componentImportPattern: `${packageJson.name}/components/<ComponentName>`,
  internalImportPattern: `${packageJson.name}/components/internal/*`,
  internalImportsPublic: false,
  publicComponentCount: Object.keys(components).length,
  realExampleCount: examples.length,
  rules: guidance.decisionGuide,
  commands: {
    generateMetadata: 'pnpm ai:generate',
    checkMetadata: 'pnpm ai:metadata:check',
    semanticCheck: 'pnpm ai:check -- <files>',
    mcpServer: 'pnpm ai:mcp',
    benchmark: 'pnpm ai:benchmark -- --candidates <dir>',
  },
}

const generated = path.join(root, 'ai/generated')
emit(path.join(generated, 'framework.json'), JSON.stringify(framework, null, 2))
emit(
  path.join(generated, 'components.json'),
  JSON.stringify({ generatedFrom: api.generatedFrom, components }, null, 2),
)
emit(
  path.join(generated, 'examples.json'),
  JSON.stringify({ generatedFrom: 'src/documentation/demos/**/*.tsx', examples }, null, 2),
)
emit(path.join(generated, 'theme.json'), JSON.stringify(themeManifest(), null, 2))
emit(path.join(root, 'DESIGN.md'), generatedDesign(spec, framework))
emit(path.join(root, 'llms.txt'), generatedLlms())

if (process.exitCode !== 1) {
  console.log(
    checkOnly
      ? `AI metadata is current: ${Object.keys(components).length} components, ${examples.length} real examples.`
      : `Generated AI metadata: ${Object.keys(components).length} components, ${examples.length} real examples.`,
  )
}
