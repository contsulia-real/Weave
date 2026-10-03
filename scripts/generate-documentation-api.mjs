import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const outputPath = path.join(
  root,
  'src',
  'documentation',
  'generated',
  'documentation-component-api.json',
)
const checkOnly = process.argv.includes('--check')

function readConfig() {
  const configPath = path.join(root, 'tsconfig.app.json')
  const config = ts.readConfigFile(configPath, ts.sys.readFile)

  if (config.error !== undefined) {
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'))
  }

  return ts.parseJsonConfigFileContent(config.config, ts.sys, root, undefined, configPath)
}

function resolvedSymbol(checker, symbol) {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
}

function declarationForSymbol(symbol, fallback) {
  return symbol.valueDeclaration ?? symbol.declarations?.[0] ?? fallback
}

function unionParts(type) {
  return type.isUnion() ? type.types : [type]
}

function propertyEntries(checker, type, fallbackNode) {
  return checker
    .getPropertiesOfType(type)
    .map((symbol) => {
      const declaration = declarationForSymbol(symbol, fallbackNode)
      const propertyType = checker.getTypeOfSymbolAtLocation(symbol, declaration)

      return {
        name: symbol.getName(),
        type: checker.typeToString(
          propertyType,
          declaration,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
        ),
        optional:
          (symbol.flags & ts.SymbolFlags.Optional) !== 0 ||
          unionParts(propertyType).some((part) => (part.flags & ts.TypeFlags.Undefined) !== 0),
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

function main() {
  const parsed = readConfig()
  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
    projectReferences: parsed.projectReferences,
  })
  const checker = program.getTypeChecker()

  const indexPath = path.join(root, 'src', 'index.ts')
  const indexSource = program.getSourceFile(indexPath)

  if (indexSource === undefined) {
    throw new Error('Documentation API generation could not load src/index.ts.')
  }

  const indexSymbol = checker.getSymbolAtLocation(indexSource)

  if (indexSymbol === undefined) {
    throw new Error('Documentation API generation could not resolve src/index.ts exports.')
  }

  const exportsByName = new Map(
    checker.getExportsOfModule(indexSymbol).map((symbol) => [symbol.getName(), symbol]),
  )
  const componentNames = [...exportsByName.keys()]
    .filter(
      (name) =>
        /^[A-Z]/.test(name) &&
        exportsByName.has(`${name}Props`) &&
        (resolvedSymbol(checker, exportsByName.get(name)).flags & ts.SymbolFlags.Value) !== 0,
    )
    .sort((left, right) => left.localeCompare(right))

  const viewPropsExport = exportsByName.get('ViewProps')

  if (viewPropsExport === undefined) {
    throw new Error('Documentation API generation could not resolve ViewProps.')
  }

  const viewPropsSymbol = resolvedSymbol(checker, viewPropsExport)
  const viewPropsDeclaration = declarationForSymbol(viewPropsSymbol, indexSource)
  const viewPropsType = checker.getDeclaredTypeOfSymbol(viewPropsSymbol)
  const viewProps = propertyEntries(checker, viewPropsType, viewPropsDeclaration).map((prop) => ({
    ...prop,
    type: prop.type.replaceAll('TElement', 'HTMLDivElement'),
  }))
  const viewPropsByName = new Map(viewProps.map((prop) => [prop.name, prop]))

  const propPool = {}
  const profilePool = {}
  const propIds = new Map()
  const profileIds = new Map()
  const components = {}

  function internProp(prop) {
    const key = JSON.stringify(prop)
    const existing = propIds.get(key)

    if (existing !== undefined) return existing

    const id = `p${propIds.size}`
    propIds.set(key, id)
    propPool[id] = prop
    return id
  }

  function internProfile(props) {
    const ids = props.map(internProp)
    const key = ids.join(',')
    const existing = profileIds.get(key)

    if (existing !== undefined) return existing

    const id = `r${profileIds.size}`
    profileIds.set(key, id)
    profilePool[id] = ids
    return id
  }

  for (const componentName of componentNames) {
    const propsName = `${componentName}Props`
    const exported = exportsByName.get(propsName)

    if (exported === undefined) {
      throw new Error(
        `Missing public type export ${propsName} for public component ${componentName}.`,
      )
    }

    const propsSymbol = resolvedSymbol(checker, exported)
    const propsType = checker.getDeclaredTypeOfSymbol(propsSymbol)
    const propsDeclaration = declarationForSymbol(propsSymbol, indexSource)
    const allProps = propertyEntries(checker, propsType, propsDeclaration)
    const hasViewProps = checker.getPropertyOfType(propsType, 'viewProps') !== undefined
    const usesViewProps =
      componentName !== 'View' &&
      !hasViewProps &&
      allProps.length === viewProps.length &&
      allProps.every((prop) => viewPropsByName.has(prop.name))

    const ownProps = hasViewProps
      ? allProps.filter((prop) => prop.name !== 'viewProps')
      : usesViewProps
        ? allProps.filter((prop) => {
            const viewProp = viewPropsByName.get(prop.name)
            return (
              viewProp === undefined ||
              viewProp.type !== prop.type ||
              viewProp.optional !== prop.optional
            )
          })
        : allProps

    components[componentName] = {
      hasViewProps,
      usesViewProps,
      props: internProfile(ownProps),
    }
  }

  const data = {
    generatedFrom: 'src/index.ts',
    components,
    profiles: profilePool,
    props: propPool,
  }
  const output = `${JSON.stringify(data, null, 2)}\n`

  if (checkOnly) {
    let current = null

    try {
      current = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
    } catch {
      current = null
    }

    if (JSON.stringify(current) !== JSON.stringify(data)) {
      console.error(
        'Documentation API metadata is stale. Run "pnpm docs:api" and commit the generated file.',
      )
      process.exit(1)
    }

    console.log('Documentation API metadata is current.')
    return
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, output)
  console.log(`Generated ${path.relative(root, outputPath)}.`)
}

main()
