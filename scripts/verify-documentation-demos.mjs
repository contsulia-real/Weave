import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const documentationDirectory = path.join(root, 'src', 'documentation')
const demosDirectory = path.join(documentationDirectory, 'demos')
const metadataFiles = [
  'documentation-component-examples-foundation.tsx',
  'documentation-component-examples-content.tsx',
  'documentation-component-examples-forms.tsx',
  'documentation-component-examples-composite.tsx',
  'documentation-component-examples-theme.tsx',
  'documentation-component-example-additions.tsx',
]
const liveRuntimeImports = new Set([
  '@tabler/icons-react',
  'react',
  'react-i18next',
  '../../../index',
  '../../documentation-example-fixtures',
])
const forbiddenMetadataFields = new Set(['preview', 'code', 'codeMode'])

function propertyName(name) {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null
}

function staticString(node, context) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }

  throw new Error(`${context} must be a static string literal.`)
}

function collectDemoReferences() {
  const references = new Set()

  for (const fileName of metadataFiles) {
    const filePath = path.join(documentationDirectory, fileName)
    const source = fs.readFileSync(filePath, 'utf8')
    const sourceFile = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    )

    function addReference(key) {
      if (references.has(key)) {
        throw new Error(`Duplicate Documentation demo reference: ${key}`)
      }

      references.add(key)
    }

    function visit(node) {
      if (ts.isPropertyAssignment(node)) {
        const name = propertyName(node.name)

        if (name !== null && forbiddenMetadataFields.has(name)) {
          throw new Error(
            `${path.relative(root, filePath)} still contains forbidden demo field "${name}".`,
          )
        }

        if (name === 'demo') {
          addReference(staticString(node.initializer, `Demo reference in ${fileName}`))
        }
      }

      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'basicExample'
      ) {
        const key = node.arguments[0]

        if (key === undefined) {
          throw new Error(`basicExample in ${fileName} is missing its demo reference.`)
        }

        addReference(staticString(key, `basicExample reference in ${fileName}`))
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
  }

  return references
}

function collectDemoFiles() {
  const files = []

  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filePath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        walk(filePath)
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        files.push(filePath)
      }
    }
  }

  walk(demosDirectory)
  return files
}

function demoKey(filePath) {
  return path
    .relative(demosDirectory, filePath)
    .replaceAll('\\', '/')
    .replace(/\.tsx$/, '')
}

function verifyDemoFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  let hasDefaultExport = false

  for (const statement of sourceFile.statements) {
    if (
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword) ||
      ts.isExportAssignment(statement)
    ) {
      hasDefaultExport = true
    }

    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text

      if (!liveRuntimeImports.has(specifier)) {
        throw new Error(
          `${path.relative(root, filePath)} imports "${specifier}", which the live demo runtime does not support.`,
        )
      }
    }
  }

  if (!hasDefaultExport) {
    throw new Error(`${path.relative(root, filePath)} must have a default export.`)
  }
}

const references = collectDemoReferences()
const files = collectDemoFiles()
const actual = new Set(files.map(demoKey))
const missing = [...references].filter((key) => !actual.has(key))
const orphaned = [...actual].filter((key) => !references.has(key))

if (missing.length > 0 || orphaned.length > 0) {
  throw new Error(
    [
      missing.length === 0 ? null : `Missing demo files: ${missing.join(', ')}`,
      orphaned.length === 0 ? null : `Unreferenced demo files: ${orphaned.join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

for (const filePath of files) {
  verifyDemoFile(filePath)
}

const dataGridDemoSource = fs.readFileSync(
  path.join(demosDirectory, 'DataGrid', 'basic-usage.tsx'),
  'utf8',
)
if (!dataGridDemoSource.includes('localeCompare(right.name, undefined, { numeric: true })')) {
  throw new Error('DataGrid Name demo sorting must remain numeric-aware.')
}

console.log(
  `Documentation demos are current: ${references.size} references match ${files.length} real TSX files.`,
)
