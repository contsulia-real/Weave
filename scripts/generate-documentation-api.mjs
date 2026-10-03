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

function componentNamesFromNavigation(sourceFile) {
  const names = []

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'componentSection'
    ) {
      const components = node.arguments[2]

      if (components !== undefined && ts.isArrayLiteralExpression(components)) {
        for (const element of components.elements) {
          if (ts.isStringLiteral(element)) {
            names.push(element.text)
          }
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return names
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

function withoutNullish(checker, type) {
  const parts = unionParts(type).filter(
    (part) =>
      (part.flags & ts.TypeFlags.Undefined) === 0 &&
      (part.flags & ts.TypeFlags.Null) === 0 &&
      (part.flags & ts.TypeFlags.Never) === 0,
  )

  if (parts.length === 0) return type
  if (parts.length === 1) return parts[0]
  return checker.getUnionType(parts, ts.UnionReduction.None)
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
  const navigationPath = path.join(root, 'src', 'documentation', 'documentation-navigation-data.ts')
  const indexSource = program.getSourceFile(indexPath)
  const navigationSource = program.getSourceFile(navigationPath)

  if (indexSource === undefined || navigationSource === undefined) {
    throw new Error('Documentation API generation could not load its source files.')
  }

  const indexSymbol = checker.getSymbolAtLocation(indexSource)

  if (indexSymbol === undefined) {
    throw new Error('Documentation API generation could not resolve src/index.ts exports.')
  }

  const exportsByName = new Map(
    checker.getExportsOfModule(indexSymbol).map((symbol) => [symbol.getName(), symbol]),
  )
  const componentNames = componentNamesFromNavigation(navigationSource)
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
        `Missing public type export ${propsName} for Documentation component ${componentName}.`,
      )
    }

    const propsSymbol = resolvedSymbol(checker, exported)
    const propsType = checker.getDeclaredTypeOfSymbol(propsSymbol)
    const propsDeclaration = declarationForSymbol(propsSymbol, indexSource)
    const viewPropsSymbol = checker.getPropertyOfType(propsType, 'viewProps')
    const allProps = propertyEntries(checker, propsType, propsDeclaration)

    if (viewPropsSymbol === undefined) {
      components[componentName] = {
        hasViewProps: false,
        attributes: internProfile([]),
        viewProps: internProfile(allProps),
      }
      continue
    }

    const viewPropsDeclaration = declarationForSymbol(viewPropsSymbol, propsDeclaration)
    const viewPropsType = withoutNullish(
      checker,
      checker.getTypeOfSymbolAtLocation(viewPropsSymbol, viewPropsDeclaration),
    )

    components[componentName] = {
      hasViewProps: true,
      attributes: internProfile(allProps.filter((prop) => prop.name !== 'viewProps')),
      viewProps: internProfile(propertyEntries(checker, viewPropsType, viewPropsDeclaration)),
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
