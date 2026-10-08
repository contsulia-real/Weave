import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function listFiles(directory, suffix) {
  const files = []

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listFiles(path, suffix)))
    } else if (entry.name.endsWith(suffix)) {
      files.push(path)
    }
  }

  return files
}

const repositoryRoot = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))
const jsrJson = JSON.parse(await readFile(new URL('./jsr.json', import.meta.url), 'utf8'))
const licenseText = await readFile(new URL('./LICENSE', import.meta.url), 'utf8')
const packageEntry = packageJson.exports?.['.']
const componentEntry = packageJson.exports?.['./components/*']

assert(packageJson.name === '@contsulia/weave', 'Public package name must remain @contsulia/weave')
assert(packageJson.private === true, 'npm publication must remain disabled with private=true')
assert(packageJson.license === 'MIT', 'Package license must remain MIT')
assert(licenseText.startsWith('MIT License'), 'LICENSE must contain the MIT license')
assert(jsrJson.name === packageJson.name, 'JSR package name must match package.json')
assert(jsrJson.version === packageJson.version, 'JSR package version must match package.json')
assert(jsrJson.license === packageJson.license, 'JSR license must match package.json')
assert(jsrJson.exports?.['.'] === './dist/weave.js', 'JSR root export must use built JavaScript')
assert(
  jsrJson.exports?.['./registry'] === './src/core/registry-types.ts',
  'JSR registry export must use src/core/registry-types.ts',
)
assert(
  packageJson.exports?.['./registry']?.types === './dist/core/registry-types.d.ts',
  'Package registry export must expose registry declarations',
)

const jsrExportNames = Object.keys(jsrJson.exports ?? {})
const sourceComponentEntries = (
  await readdir(join(repositoryRoot, 'src', 'components'), {
    withFileTypes: true,
  })
)
  .filter((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
  .sort((left, right) => left.name.localeCompare(right.name))

assert(
  jsrExportNames.length === sourceComponentEntries.length + 2,
  'JSR exports must contain exactly the root, registry and every public component source entry',
)

for (const entry of sourceComponentEntries) {
  const name = entry.name.replace(/\.(?:ts|tsx)$/, '')
  assert(
    jsrJson.exports?.[`./components/${name}`] === `./dist/components/${name}.js`,
    `JSR export is missing or stale for components/${name}`,
  )
  const jsEntry = await readFile(join(repositoryRoot, 'dist', 'components', `${name}.js`), 'utf8')
  assert(
    jsEntry.startsWith(`/* @ts-self-types="./${name}.d.ts" */`),
    `JSR component entry must reference its published types: ${name}`,
  )
  await readFile(join(repositoryRoot, 'dist', 'components', `${name}.d.ts`), 'utf8')
}

assert(
  !jsrExportNames.some((name) => name.startsWith('./components/internal/')),
  'JSR exports must not expose internal component modules',
)
for (const required of [
  'LICENSE',
  'README.md',
  'package.json',
  'dist/**/*.js',
  'dist/**/*.d.ts',
  'src/core/registry-types.ts',
]) {
  assert(jsrJson.publish?.include?.includes(required), `JSR publish include is missing ${required}`)
}
assert(
  jsrJson.publish?.exclude?.includes('!dist'),
  'JSR publish must un-ignore the built dist directory',
)

assert(
  packageJson.devDependencies?.i18next !== undefined &&
    packageJson.devDependencies?.['react-i18next'] !== undefined,
  'Documentation i18n packages must remain devDependencies',
)
assert(
  packageJson.dependencies?.i18next === undefined &&
    packageJson.dependencies?.['react-i18next'] === undefined,
  'Documentation i18n packages must not become Weave runtime dependencies',
)

assert(
  packageJson.peerDependencies?.shiki !== undefined &&
    packageJson.peerDependenciesMeta?.shiki?.optional === true,
  'Shiki must remain an optional peer dependency',
)
assert(
  packageJson.devDependencies?.shiki !== undefined,
  'Shiki must remain available for local builds',
)
assert(packageJson.dependencies?.shiki === undefined, 'Shiki must not be a runtime dependency')

assert(packageJson.sideEffects === false, 'Package must remain side-effect free for tree-shaking')
assert(
  packageEntry?.import === './dist/weave.js',
  'Package import entry must point to ./dist/weave.js',
)
assert(
  packageEntry?.types === './dist/package.d.ts',
  'Package type entry must point to ./dist/package.d.ts',
)

assert(
  componentEntry?.import === './dist/components/*.js' &&
    componentEntry?.types === './dist/components/*.d.ts',
  'Component subpath exports must point at preserved component modules',
)
assert(
  packageJson.exports?.['./components/internal/*'] === null,
  'Internal component modules must not be public package subpaths',
)

const runtimeEntry = new URL(packageEntry.import, import.meta.url)
assert(
  (await readFile(runtimeEntry, 'utf8')).startsWith('/* @ts-self-types="./package.d.ts" */'),
  'JSR root entry must reference built package declarations',
)
const typeEntry = new URL(packageEntry.types, import.meta.url)
const runtimeFiles = await listFiles(join(repositoryRoot, 'dist'), '.js')
const runtimeSource = (await Promise.all(runtimeFiles.map((file) => readFile(file, 'utf8')))).join(
  '\n',
)
assert(
  !runtimeSource.includes('i18next'),
  'Built Weave runtime must not include documentation i18n',
)
assert(
  !runtimeSource.includes('@tabler/icons-react'),
  'Built Weave runtime must not include Tabler Icons',
)
const rootTypeSource = await readFile(typeEntry, 'utf8')
assert(
  rootTypeSource.includes("export type * from './index';"),
  'Package type entry must expose root types without restoring component runtime exports',
)
const typeSource = `${rootTypeSource}\n${await readFile(new URL('./dist/index.d.ts', import.meta.url), 'utf8')}`
assert(
  typeSource.includes('BreakpointRegistry'),
  'Built declarations are missing BreakpointRegistry',
)
assert(
  typeSource.includes('ColorTokenRegistry'),
  'Built declarations are missing ColorTokenRegistry',
)
assert(
  typeSource.includes('RegisteredBreakpointName'),
  'Built declarations are missing RegisteredBreakpointName',
)
assert(
  typeSource.includes('RegisteredColorTokenName'),
  'Built declarations are missing RegisteredColorTokenName',
)
const weave = await import(runtimeEntry.href)
const componentButton = await import(`${packageJson.name}/components/Button`)
const componentDataGrid = await import(`${packageJson.name}/components/DataGrid`)
assert(typeof componentButton.Button === 'function', 'Button subpath must expose Button')
assert(!('Button' in weave), 'Package root must not expose Button')

let internalSubpathBlocked = false
try {
  await import(`${packageJson.name}/components/internal/use-view-host`)
} catch (error) {
  internalSubpathBlocked = error?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED'
}
assert(internalSubpathBlocked, 'Internal component modules must stay package-private')

const expectedRuntimeExports = [
  'ThemeProvider',
  'createRoot',
  'createTheme',
  'createThemeFromColorSeed',
  'defaultTheme',
  'hydrateRoot',
  'useTheme',
]

for (const name of expectedRuntimeExports) {
  assert(name in weave, `Built package is missing runtime export: ${name}`)
}

const dataGridRows = [{ id: 'row-1', name: 'Ada', role: 'Engineering', score: 99 }]
const dataGridColumns = [
  {
    id: 'name',
    header: 'Name',
    cell: (row) => row.name,
    minWidth: 140,
    maxWidth: 320,
    resizable: true,
  },
  {
    id: 'role',
    header: 'Role',
    cell: (row) => row.role,
    minWidth: 140,
    maxWidth: 280,
    resizable: true,
  },
  {
    id: 'score',
    header: 'Score',
    cell: (row) => row.score,
    minWidth: 96,
    maxWidth: 180,
    resizable: true,
  },
]
const dataGridMarkup = renderToStaticMarkup(
  createElement(componentDataGrid.DataGrid, {
    columns: dataGridColumns,
    rows: dataGridRows,
    defaultColumnWidths: { name: 180, role: 500, score: 120 },
  }),
)
assert(
  dataGridMarkup.includes('data-weave-data-grid-tracks="fixed"') &&
    dataGridMarkup.includes('<colgroup>'),
  'Built DataGrid must render fixed column tracks when widths are known',
)
assert(
  dataGridMarkup.includes('width:180px') &&
    dataGridMarkup.includes('width:280px') &&
    dataGridMarkup.includes('width:120px') &&
    !dataGridMarkup.includes('width:500px'),
  'Built DataGrid column tracks must clamp rendered widths to min/max constraints',
)
assert(
  runtimeSource.includes('data-weave-data-grid-last-column') &&
    runtimeSource.includes('inset-inline-end:0'),
  'Built DataGrid final resize handle must stay inside the table scroll extent',
)
assert(
  dataGridMarkup.includes('weave-data-grid__filler-column') &&
    dataGridMarkup.includes('weave-data-grid__filler-cell') &&
    runtimeSource.includes('width:max(100%, var(--weave-data-grid-table-width))') &&
    runtimeSource.includes('border-left:0!important'),
  'Built DataGrid must fill unused viewport width without exposing a fake column divider',
)
assert(
  runtimeSource.includes('width:1rem') &&
    runtimeSource.includes('background:var(--weave-table-row-hover-background)'),
  'Built DataGrid must use the larger resize hit target and Table-themed sortable header feedback',
)
assert(
  runtimeSource.includes(':where(.weave-data-grid__spacer-cell)') &&
    runtimeSource.includes('visibility:hidden'),
  'Built DataGrid virtualization spacers must remain visually inert',
)

const defaultSeedTheme = weave.createThemeFromColorSeed(weave.defaultTheme.tokens.color.primary)
assert(
  JSON.stringify(defaultSeedTheme.tokens?.color) ===
    JSON.stringify(weave.defaultTheme.tokens.color),
  'Default color seed must reproduce the default light color tokens exactly',
)
assert(
  JSON.stringify(defaultSeedTheme.modes?.dark?.tokens?.color) ===
    JSON.stringify({
      primary: '#a99cff',
      onPrimary: '#1b1633',
      primaryHover: '#b8adff',
      primaryActive: '#9283f0',
      secondary: '#aaa3b5',
      tertiary: '#e9e5ef',
      disabled: '#716b78',
      surface: '#18161b',
      surfaceHover: '#242129',
      success: '#55d792',
      warning: '#f4b44c',
      danger: '#ff7272',
      outline: '#5b5262',
      focus: '#b8adff',
    }),
  'Default color seed must reproduce the default dark color tokens exactly',
)

const actualRuntimeExports = Object.keys(weave).sort()
const sortedExpectedRuntimeExports = [...expectedRuntimeExports].sort()

assert(
  JSON.stringify(actualRuntimeExports) === JSON.stringify(sortedExpectedRuntimeExports),
  `Built package runtime exports changed unexpectedly: ${actualRuntimeExports.join(', ')}`,
)

assert(typeSource.includes('hydrateRoot'), 'Built declarations are missing the hydrateRoot export')

assert(
  /export\s*\{\s*List\s*\}\s*from\s*['"]\.\/components\/List['"]/.test(typeSource),
  'Built declarations are missing the List export',
)
assert(
  /export\s*\{\s*ListItem\s*\}\s*from\s*['"]\.\/components\/ListItem['"]/.test(typeSource),
  'Built declarations are missing the ListItem export',
)
assert(
  /export\s*\{\s*SegmentedButton\s*\}\s*from\s*['"]\.\/components\/SegmentedButton['"]/.test(
    typeSource,
  ),
  'Built declarations are missing the SegmentedButton export',
)
assert(
  /export\s*\{\s*DataGrid\s*\}\s*from\s*['"]\.\/components\/DataGrid['"]/.test(typeSource),
  'Built declarations are missing the DataGrid export',
)
assert(typeSource.includes('ViewTransition'), 'Built declarations are missing ViewTransition')
assert(typeSource.includes('ViewEnterExit'), 'Built declarations are missing ViewEnterExit')
assert(
  typeSource.includes('ViewLayoutAnimation'),
  'Built declarations are missing ViewLayoutAnimation',
)
assert(
  typeSource.includes('ViewAnimationConfig'),
  'Built declarations are missing ViewAnimationConfig',
)
assert(typeSource.includes('MotionSpring'), 'Built declarations are missing MotionSpring')
assert(
  typeSource.includes('MotionInterruption'),
  'Built declarations are missing MotionInterruption',
)
assert(typeSource.includes('PresenceProps'), 'Built declarations are missing PresenceProps')
assert(typeSource.includes('PopoverProps'), 'Built declarations are missing PopoverProps')
assert(typeSource.includes('MenuProps'), 'Built declarations are missing MenuProps')
assert(typeSource.includes('MenuItemProps'), 'Built declarations are missing MenuItemProps')
assert(typeSource.includes('DialogProps'), 'Built declarations are missing DialogProps')
assert(typeSource.includes('DialogViewProps'), 'Built declarations are missing DialogViewProps')
assert(typeSource.includes('ModalDialogProps'), 'Built declarations are missing ModalDialogProps')
assert(
  typeSource.includes('ModalDialogViewProps'),
  'Built declarations are missing ModalDialogViewProps',
)
assert(
  typeSource.includes('NonModalDialogProps'),
  'Built declarations are missing NonModalDialogProps',
)
assert(typeSource.includes('DividerProps'), 'Built declarations are missing DividerProps')
assert(typeSource.includes('DrawerProps'), 'Built declarations are missing DrawerProps')
assert(typeSource.includes('DrawerMode'), 'Built declarations are missing DrawerMode')
assert(typeSource.includes('DrawerSide'), 'Built declarations are missing DrawerSide')
assert(typeSource.includes('SelectProps'), 'Built declarations are missing SelectProps')
assert(typeSource.includes('SelectOptionProps'), 'Built declarations are missing SelectOptionProps')
assert(typeSource.includes('ComboboxProps'), 'Built declarations are missing ComboboxProps')
assert(
  typeSource.includes('ComboboxOptionProps'),
  'Built declarations are missing ComboboxOptionProps',
)
assert(
  typeSource.includes('ReducedMotionPreference'),
  'Built declarations are missing ReducedMotionPreference',
)
assert(typeSource.includes('AbsoluteProps'), 'Built declarations are missing AbsoluteProps')
assert(typeSource.includes('FlexProps'), 'Built declarations are missing FlexProps')
assert(typeSource.includes('GridProps'), 'Built declarations are missing GridProps')
assert(typeSource.includes('RowProps'), 'Built declarations are missing RowProps')
assert(typeSource.includes('StackProps'), 'Built declarations are missing StackProps')
assert(typeSource.includes('AvatarProps'), 'Built declarations are missing AvatarProps')
assert(typeSource.includes('BadgeProps'), 'Built declarations are missing BadgeProps')
assert(typeSource.includes('CardProps'), 'Built declarations are missing CardProps')
assert(typeSource.includes('AppBarProps'), 'Built declarations are missing AppBarProps')
assert(typeSource.includes('AppBarMode'), 'Built declarations are missing AppBarMode')
assert(typeSource.includes('AppBarSize'), 'Built declarations are missing AppBarSize')
assert(typeSource.includes('AppBarTitleAlign'), 'Built declarations are missing AppBarTitleAlign')
assert(typeSource.includes('InputIcon'), 'Built declarations are missing InputIcon')
assert(typeSource.includes('CodeProps'), 'Built declarations are missing CodeProps')
assert(typeSource.includes('CodeLanguage'), 'Built declarations are missing CodeLanguage')
assert(typeSource.includes('CodeViewProps'), 'Built declarations are missing CodeViewProps')
assert(typeSource.includes('TextHostElement'), 'Built declarations are missing TextHostElement')
assert(typeSource.includes('FormProps'), 'Built declarations are missing FormProps')
assert(typeSource.includes('FormFieldProps'), 'Built declarations are missing FormFieldProps')
assert(typeSource.includes('FormLabelProps'), 'Built declarations are missing FormLabelProps')
assert(
  typeSource.includes('FormDescriptionProps'),
  'Built declarations are missing FormDescriptionProps',
)
assert(typeSource.includes('FormErrorProps'), 'Built declarations are missing FormErrorProps')
assert(typeSource.includes('FormFieldsetProps'), 'Built declarations are missing FormFieldsetProps')
assert(typeSource.includes('FormLegendProps'), 'Built declarations are missing FormLegendProps')
assert(typeSource.includes('ButtonType'), 'Built declarations are missing ButtonType')
assert(typeSource.includes('SkeletonProps'), 'Built declarations are missing SkeletonProps')
assert(typeSource.includes('SliderProps'), 'Built declarations are missing SliderProps')
assert(typeSource.includes('RangeSliderProps'), 'Built declarations are missing RangeSliderProps')
assert(typeSource.includes('RangeSliderValue'), 'Built declarations are missing RangeSliderValue')
assert(
  typeSource.includes('RangeSliderViewProps'),
  'Built declarations are missing RangeSliderViewProps',
)
assert(typeSource.includes('SplitBoxProps'), 'Built declarations are missing SplitBoxProps')
assert(typeSource.includes('SplitBoxPaneProps'), 'Built declarations are missing SplitBoxPaneProps')
assert(
  typeSource.includes('SplitBoxCollapsible'),
  'Built declarations are missing SplitBoxCollapsible',
)
assert(typeSource.includes('SplitBoxCollapsed'), 'Built declarations are missing SplitBoxCollapsed')
assert(typeSource.includes('ListProps'), 'Built declarations are missing ListProps')
assert(typeSource.includes('LinkProps'), 'Built declarations are missing LinkProps')
assert(typeSource.includes('AccordionProps'), 'Built declarations are missing AccordionProps')
assert(
  typeSource.includes('AccordionItemProps'),
  'Built declarations are missing AccordionItemProps',
)
assert(
  typeSource.includes('AccordionTriggerProps'),
  'Built declarations are missing AccordionTriggerProps',
)
assert(
  typeSource.includes('AccordionPanelProps'),
  'Built declarations are missing AccordionPanelProps',
)
assert(typeSource.includes('TabsProps'), 'Built declarations are missing TabsProps')
assert(typeSource.includes('TabListProps'), 'Built declarations are missing TabListProps')
assert(typeSource.includes('TabProps'), 'Built declarations are missing TabProps')
assert(typeSource.includes('TabPanelProps'), 'Built declarations are missing TabPanelProps')
assert(typeSource.includes('TabsVariant'), 'Built declarations are missing TabsVariant')
assert(typeSource.includes('TabsActivation'), 'Built declarations are missing TabsActivation')
assert(typeSource.includes('TableProps'), 'Built declarations are missing TableProps')
assert(typeSource.includes('TableHeaderProps'), 'Built declarations are missing TableHeaderProps')
assert(typeSource.includes('TableBodyProps'), 'Built declarations are missing TableBodyProps')
assert(typeSource.includes('TableRowProps'), 'Built declarations are missing TableRowProps')
assert(typeSource.includes('TableHeadProps'), 'Built declarations are missing TableHeadProps')
assert(typeSource.includes('TableCellProps'), 'Built declarations are missing TableCellProps')
assert(typeSource.includes('TableSelectedCell'), 'Built declarations are missing TableSelectedCell')
assert(typeSource.includes('RadioProps'), 'Built declarations are missing RadioProps')
assert(typeSource.includes('CheckboxProps'), 'Built declarations are missing CheckboxProps')

const expectedThemeTypeExports = [
  'UseThemeResult',
  'ThemeComponents',
  'ThemeScaleValue',
  'InputTheme',
  'SelectTheme',
  'ComboboxTheme',
  'SliderTheme',
  'SwitchTheme',
  'SplitBoxTheme',
  'SplitBoxThemeBase',
  'ChoiceControlTheme',
  'AvatarTheme',
  'BadgeTheme',
  'LinkTheme',
  'ButtonTheme',
  'AppBarTheme',
  'AppBarThemeBase',
  'AppBarThemeSize',
  'CardTheme',
  'SkeletonTheme',
  'DialogTheme',
  'DrawerTheme',
  'DrawerThemeBase',
  'FormTheme',
  'FormThemeBase',
  'AccordionTheme',
  'AccordionThemeBase',
  'TabsTheme',
  'TabsThemeBase',
  'TableTheme',
  'TableThemeBase',
  'TableThemeDensity',
  'PopoverTheme',
  'MenuTheme',
  'ProgressTheme',
  'ScrollbarTheme',
  'ToolTipTheme',
  'SnackTheme',
  'ListTheme',
  'ListItemTheme',
]

for (const name of expectedThemeTypeExports) {
  assert(typeSource.includes(name), `Built declarations are missing theme type export: ${name}`)
}

assert(
  !/from\s*["']shiki["']/.test(runtimeSource) && /import\(["']shiki["']\)/.test(runtimeSource),
  'Built package must lazy-load external shiki',
)
assert(
  /from\s*["']react-dom\/client["']/.test(runtimeSource),
  'Built package must keep react-dom/client external',
)
assert(
  !runtimeSource.includes('rendererPackageName: "react-dom"') &&
    !runtimeSource.includes('Incompatible React versions:'),
  'Built package contains bundled ReactDOM renderer internals',
)

execFileSync(process.execPath, ['scripts/prune-declarations.mjs', '--check'], {
  cwd: repositoryRoot,
  stdio: 'inherit',
})

const packArgs = ['pack', '--dry-run', '--json', '--ignore-scripts']
const packJson =
  process.platform === 'win32'
    ? execFileSync(
        process.env.ComSpec ?? 'cmd.exe',
        ['/d', '/s', '/c', `npm ${packArgs.join(' ')}`],
        {
          cwd: repositoryRoot,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      )
    : execFileSync('npm', packArgs, {
        cwd: repositoryRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
const parsedPackResult = JSON.parse(packJson)
const packResult = Array.isArray(parsedPackResult)
  ? parsedPackResult[0]
  : (parsedPackResult[packageJson.name] ?? Object.values(parsedPackResult)[0])

assert(packResult?.files, 'npm pack did not return a package file manifest')

const packedFiles = new Set(packResult.files.map((file) => file.path.replaceAll('\\', '/')))

assert(packedFiles.has('dist/weave.js'), 'Packed npm artifact is missing dist/weave.js')
assert(packedFiles.has('dist/package.d.ts'), 'Packed npm artifact is missing dist/package.d.ts')
assert(
  packedFiles.has('dist/components/Button.js'),
  'Packed npm artifact is missing Button subpath',
)
assert(packedFiles.has('dist/components/Code.js'), 'Packed npm artifact is missing Code subpath')
assert(
  !packedFiles.has('dist/favicon.svg'),
  'Packed npm artifact must not include the playground favicon',
)
assert(
  ![...packedFiles].some((file) => file.endsWith('.d.ts.map')),
  'Packed npm artifact must not include declaration maps without their source files',
)

for (const declaration of await listFiles(join(repositoryRoot, 'dist'), '.d.ts')) {
  const packagePath = relative(repositoryRoot, declaration).replaceAll('\\', '/')
  assert(packedFiles.has(packagePath), `Packed npm artifact is missing declaration: ${packagePath}`)
}

console.log(`Package verification passed: ${packedFiles.size} packed files.`)
