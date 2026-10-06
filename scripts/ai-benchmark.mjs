import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { checkSource } from './weave-check.mjs'

const root = process.cwd()
const tasksPath = path.join(root, 'ai', 'benchmarks', 'tasks.json')
const componentsPath = path.join(root, 'ai', 'generated', 'components.json')
const packageName = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).name

function parseArgs(argv) {
  const options = { check: false, candidates: undefined }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--') continue
    if (value === '--check') options.check = true
    else if (value === '--candidates') {
      const directory = argv[index + 1]
      if (directory === undefined) throw new Error('--candidates requires a directory.')
      options.candidates = directory
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }

  return options
}

function componentImports(fileName, sourceText, publicComponents) {
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const output = new Set()

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
      continue
    const moduleName = statement.moduleSpecifier.text
    const bindings = statement.importClause?.namedBindings
    if (bindings === undefined || !ts.isNamedImports(bindings)) continue

    if (moduleName === packageName || moduleName.startsWith(`${packageName}/components/`)) {
      for (const element of bindings.elements) {
        const imported = element.propertyName?.text ?? element.name.text
        if (publicComponents.has(imported)) output.add(imported)
      }
    }
  }

  return output
}

function validateCorpus(tasks, publicComponents) {
  const failures = []
  const ids = new Set()

  if (tasks.length < 30 || tasks.length > 50) {
    failures.push(`Expected 30-50 benchmark tasks, found ${tasks.length}.`)
  }

  for (const task of tasks) {
    if (typeof task.id !== 'string' || task.id.length === 0)
      failures.push('Every task needs an id.')
    else if (ids.has(task.id)) failures.push(`Duplicate benchmark id: ${task.id}`)
    else ids.add(task.id)

    if (typeof task.prompt !== 'string' || task.prompt.length === 0) {
      failures.push(`${task.id ?? '<unknown>'}: prompt is required.`)
    }

    for (const field of ['requiredComponents', 'anyOfComponents', 'forbiddenComponents']) {
      for (const component of task[field] ?? []) {
        if (!publicComponents.has(component)) {
          failures.push(`${task.id}: unknown component ${component} in ${field}.`)
        }
      }
    }
  }

  return failures
}

function evaluateTask(task, sourceText, fileName, publicComponents) {
  const imports = componentImports(fileName, sourceText, publicComponents)
  const diagnostics = checkSource(fileName, sourceText)
  const failures = diagnostics
    .filter((item) => item.severity === 'error')
    .map((item) => `${item.code}: ${item.message}`)

  for (const component of task.requiredComponents ?? []) {
    if (!imports.has(component)) failures.push(`Missing required component: ${component}`)
  }

  if (
    (task.anyOfComponents?.length ?? 0) > 0 &&
    !task.anyOfComponents.some((component) => imports.has(component))
  ) {
    failures.push(`Expected one of: ${task.anyOfComponents.join(', ')}`)
  }

  for (const component of task.forbiddenComponents ?? []) {
    if (imports.has(component)) failures.push(`Forbidden component used: ${component}`)
  }

  return { pass: failures.length === 0, failures, imports: [...imports].sort() }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const { tasks } = JSON.parse(fs.readFileSync(tasksPath, 'utf8'))
  const { components } = JSON.parse(fs.readFileSync(componentsPath, 'utf8'))
  const publicComponents = new Set(Object.keys(components))
  const corpusFailures = validateCorpus(tasks, publicComponents)

  if (corpusFailures.length > 0) {
    for (const failure of corpusFailures) console.error(failure)
    process.exitCode = 1
    return
  }

  if (options.check || options.candidates === undefined) {
    console.log(`LLM benchmark corpus is valid: ${tasks.length} tasks.`)
    if (options.candidates === undefined) return
  }

  const candidates = path.resolve(options.candidates)
  let passed = 0

  for (const task of tasks) {
    const file = path.join(candidates, `${task.id}.tsx`)

    if (!fs.existsSync(file)) {
      console.log(`FAIL ${task.id}: missing candidate ${file}`)
      continue
    }

    const result = evaluateTask(task, fs.readFileSync(file, 'utf8'), file, publicComponents)

    if (result.pass) {
      passed += 1
      console.log(`PASS ${task.id}`)
    } else {
      console.log(`FAIL ${task.id}: ${result.failures.join('; ')}`)
    }
  }

  console.log(`LLM benchmark: ${passed}/${tasks.length} passed.`)
  if (passed !== tasks.length) process.exitCode = 1
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
