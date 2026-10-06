import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const root = process.cwd()
const componentsPath = path.join(root, 'ai', 'generated', 'components.json')
const packageName = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).name

function componentMetadata() {
  return JSON.parse(fs.readFileSync(componentsPath, 'utf8')).components
}

function location(source, position) {
  const point = source.getLineAndCharacterOfPosition(position)
  return { line: point.line + 1, column: point.character + 1 }
}

function diagnostic(source, node, code, severity, message, suggestion) {
  return {
    code,
    severity,
    file: slash(source.fileName),
    ...location(source, node.getStart(source)),
    message,
    suggestion,
  }
}

function slash(file) {
  return file.replace(/\\/g, '/')
}

function jsxTagName(node) {
  return ts.isIdentifier(node.tagName) ? node.tagName.text : undefined
}

function jsxAttribute(opening, name) {
  return opening.attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.text === name,
  )
}

function literalJsxValue(attribute) {
  if (attribute === undefined || !ts.isJsxAttribute(attribute)) return undefined
  if (attribute.initializer === undefined) return true
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text

  if (ts.isJsxExpression(attribute.initializer)) {
    const expression = attribute.initializer.expression
    if (expression === undefined) return true
    if (expression.kind === ts.SyntaxKind.TrueKeyword) return true
    if (expression.kind === ts.SyntaxKind.FalseKeyword) return false
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      return expression.text
    }
  }

  return undefined
}

function importedWeaveComponents(source, metadata, diagnostics) {
  const imports = new Map()

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    const moduleName = ts.isStringLiteral(statement.moduleSpecifier)
      ? statement.moduleSpecifier.text
      : undefined

    if (moduleName === undefined) continue

    if (moduleName.startsWith(`${packageName}/components/internal/`)) {
      diagnostics.push(
        diagnostic(
          source,
          statement.moduleSpecifier,
          'WEAVE_IMPORT_002',
          'error',
          'Weave internal component modules are package-private.',
          `Use a public component or public package API instead of ${packageName}/components/internal/*.`,
        ),
      )
      continue
    }

    const bindings = statement.importClause?.namedBindings
    if (bindings === undefined || !ts.isNamedImports(bindings)) continue

    for (const element of bindings.elements) {
      const imported = element.propertyName?.text ?? element.name.text
      const meta = metadata[imported]
      if (meta === undefined) continue

      imports.set(element.name.text, imported)

      if (moduleName === packageName && meta.importPath !== packageName) {
        diagnostics.push(
          diagnostic(
            source,
            element,
            'WEAVE_IMPORT_001',
            'error',
            `${imported} is not a root runtime export.`,
            `Import it from '${meta.importPath}'.`,
          ),
        )
      }

      if (moduleName.startsWith(`${packageName}/components/`) && moduleName !== meta.importPath) {
        diagnostics.push(
          diagnostic(
            source,
            element,
            'WEAVE_IMPORT_003',
            'error',
            `${imported} is imported from the wrong Weave component subpath.`,
            `Import it from '${meta.importPath}'.`,
          ),
        )
      }
    }
  }

  return imports
}

export function checkSource(fileName, sourceText, options = {}) {
  const metadata = componentMetadata()
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') || fileName.endsWith('.jsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  const diagnostics = []
  const imports = importedWeaveComponents(source, metadata, diagnostics)

  function visit(node) {
    const opening = ts.isJsxSelfClosingElement(node)
      ? node
      : ts.isJsxElement(node)
        ? node.openingElement
        : undefined

    if (opening !== undefined) {
      const localName = jsxTagName(opening)
      const component = localName === undefined ? undefined : imports.get(localName)

      if (component === 'View' && options.allowView !== true) {
        diagnostics.push(
          diagnostic(
            source,
            opening.tagName,
            'WEAVE_VIEW_001',
            'error',
            'View is the component-author primitive, not the normal application layout primitive.',
            'Use Column, Row, Flex, Grid, Stack, or Absolute unless this is component-author infrastructure.',
          ),
        )
      }

      if (component === 'Input') {
        const multiline = literalJsxValue(jsxAttribute(opening, 'multiline'))
        const clearable = literalJsxValue(jsxAttribute(opening, 'clearable'))

        if (multiline === true && clearable === true) {
          diagnostics.push(
            diagnostic(
              source,
              opening,
              'WEAVE_INPUT_001',
              'error',
              'clearable is unavailable when Input is multiline.',
              'Remove clearable from the multiline Input.',
            ),
          )
        }
      }

      if (component === 'Flex') {
        const direction = literalJsxValue(jsxAttribute(opening, 'direction'))

        if (direction === 'column' || direction === 'row') {
          const preferred = direction === 'column' ? 'Column' : 'Row'
          diagnostics.push(
            diagnostic(
              source,
              opening,
              'WEAVE_LAYOUT_001',
              'warning',
              `Flex has a fixed ${direction} axis that ${preferred} expresses more directly.`,
              `Prefer ${preferred} when the axis is not dynamic.`,
            ),
          )
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return diagnostics
}

export function checkFiles(files, options = {}) {
  return files.flatMap((file) =>
    checkSource(path.resolve(file), fs.readFileSync(file, 'utf8'), options),
  )
}

function projectDiagnostics(projectPath) {
  const configFile = ts.readConfigFile(projectPath, ts.sys.readFile)

  if (configFile.error !== undefined) {
    return {
      diagnostics: [configFile.error],
      files: [],
    }
  }

  const config = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(projectPath),
    undefined,
    projectPath,
  )
  const program = ts.createProgram({
    rootNames: config.fileNames,
    options: config.options,
    projectReferences: config.projectReferences,
  })

  return {
    diagnostics: ts.getPreEmitDiagnostics(program),
    files: config.fileNames,
  }
}

function normalizeTypeScriptDiagnostic(item) {
  const message = ts.flattenDiagnosticMessageText(item.messageText, '\n')
  const file = item.file?.fileName
  const start = item.start

  if (file === undefined || start === undefined || item.file === undefined) {
    return {
      code: `TS${item.code}`,
      severity: item.category === ts.DiagnosticCategory.Warning ? 'warning' : 'error',
      file: null,
      line: null,
      column: null,
      message,
      suggestion: null,
    }
  }

  const point = item.file.getLineAndCharacterOfPosition(start)
  return {
    code: `TS${item.code}`,
    severity: item.category === ts.DiagnosticCategory.Warning ? 'warning' : 'error',
    file: slash(file),
    line: point.line + 1,
    column: point.character + 1,
    message,
    suggestion: null,
  }
}

function parseArguments(argv) {
  const options = { files: [], json: false, allowView: false, project: undefined }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--') continue
    if (value === '--json') options.json = true
    else if (value === '--allow-view') options.allowView = true
    else if (value === '--project') {
      const project = argv[index + 1]
      if (project === undefined) throw new Error('--project requires a tsconfig path.')
      options.project = project
      index += 1
    } else {
      options.files.push(value)
    }
  }

  return options
}

function printDiagnostics(diagnostics, asJson) {
  if (asJson) {
    console.log(JSON.stringify({ diagnostics }, null, 2))
    return
  }

  for (const item of diagnostics) {
    const place =
      item.file === null || item.file === undefined
        ? ''
        : `${item.file}:${item.line ?? 1}:${item.column ?? 1} `
    console.log(`${place}${item.severity.toUpperCase()} ${item.code}: ${item.message}`)
    if (item.suggestion) console.log(`  Fix: ${item.suggestion}`)
  }

  if (diagnostics.length === 0) console.log('Weave check passed.')
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  const diagnostics = []
  let semanticFiles = options.files

  if (options.project !== undefined) {
    const projectPath = path.resolve(options.project)
    const project = projectDiagnostics(projectPath)
    diagnostics.push(...project.diagnostics.map(normalizeTypeScriptDiagnostic))
    if (semanticFiles.length === 0) {
      semanticFiles = project.files.filter((file) => /\.[jt]sx?$/.test(file))
    }
  }

  if (semanticFiles.length === 0 && options.project === undefined) {
    throw new Error('Provide source files or --project <tsconfig.json>.')
  }

  diagnostics.push(...checkFiles(semanticFiles, { allowView: options.allowView }))
  printDiagnostics(diagnostics, options.json)

  if (diagnostics.some((item) => item.severity === 'error')) process.exitCode = 1
}

const invokedPath =
  process.argv[1] === undefined ? null : pathToFileURL(path.resolve(process.argv[1])).href
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
