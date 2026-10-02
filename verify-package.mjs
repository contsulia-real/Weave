import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const repositoryRoot = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))
const packageEntry = packageJson.exports?.['.']

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
  packageEntry?.import === './dist/weave.js',
  'Package import entry must point to ./dist/weave.js',
)
assert(
  packageEntry?.types === './dist/index.d.ts',
  'Package type entry must point to ./dist/index.d.ts',
)

const runtimeEntry = new URL(packageEntry.import, import.meta.url)
const typeEntry = new URL(packageEntry.types, import.meta.url)
const runtimeSource = await readFile(runtimeEntry, 'utf8')
assert(
  !runtimeSource.includes('i18next'),
  'Built Weave runtime must not include documentation i18n',
)
const typeSource = await readFile(typeEntry, 'utf8')
const weave = await import(runtimeEntry.href)

const expectedRuntimeExports = [
  'Absolute',
  'Accordion',
  'AccordionItem',
  'AccordionPanel',
  'AccordionTrigger',
  'AppBar',
  'Avatar',
  'Badge',
  'Button',
  'Card',
  'Checkbox',
  'Code',
  'Column',
  'Combobox',
  'ComboboxOption',
  'Dialog',
  'Drawer',
  'Flex',
  'Form',
  'FormDescription',
  'FormError',
  'FormField',
  'FormFieldset',
  'FormLabel',
  'FormLegend',
  'Grid',
  'Icon',
  'Image',
  'Input',
  'List',
  'ListItem',
  'Link',
  'MarkSlider',
  'Menu',
  'MenuItem',
  'Divider',
  'Presence',
  'Popover',
  'Progress',
  'Radio',
  'RangeSlider',
  'Row',
  'Select',
  'SelectOption',
  'Skeleton',
  'Slider',
  'SplitBox',
  'SplitBoxPane',
  'Snack',
  'Stack',
  'SnackProvider',
  'Switch',
  'Tab',
  'TabList',
  'TabPanel',
  'Tabs',
  'Table',
  'TableBody',
  'TableCell',
  'TableHead',
  'TableHeader',
  'TableRow',
  'Text',
  'ThemeProvider',
  'ToolTip',
  'View',
  'createRoot',
  'createTheme',
  'createThemeFromColorSeed',
  'defaultTheme',
  'useSnack',
  'useTheme',
]

for (const name of expectedRuntimeExports) {
  assert(name in weave, `Built package is missing runtime export: ${name}`)
}

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

assert(
  /export\s*\{\s*List\s*\}\s*from\s*['"]\.\/components\/List['"]/.test(typeSource),
  'Built declarations are missing the List export',
)
assert(
  /export\s*\{\s*ListItem\s*\}\s*from\s*['"]\.\/components\/ListItem['"]/.test(typeSource),
  'Built declarations are missing the ListItem export',
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

assert(/from\s*["']shiki["']/.test(runtimeSource), 'Built package must keep shiki external')
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
assert(packedFiles.has('dist/index.d.ts'), 'Packed npm artifact is missing dist/index.d.ts')
assert(
  !packedFiles.has('dist/favicon.svg'),
  'Packed npm artifact must not include the playground favicon',
)
assert(
  ![...packedFiles].some((file) => file.endsWith('.d.ts.map')),
  'Packed npm artifact must not include declaration maps without their source files',
)

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

for (const declaration of await listDeclarationFiles(join(repositoryRoot, 'dist'))) {
  const packagePath = relative(repositoryRoot, declaration).replaceAll('\\', '/')
  assert(packedFiles.has(packagePath), `Packed npm artifact is missing declaration: ${packagePath}`)
}

console.log(`Package verification passed: ${packedFiles.size} packed files.`)
