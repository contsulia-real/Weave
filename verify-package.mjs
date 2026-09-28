import { readFile } from 'node:fs/promises'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const packageJson = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url), 'utf8'),
)
const packageEntry = packageJson.exports?.['.']

assert(packageEntry?.import === './dist/weave.js', 'Package import entry must point to ./dist/weave.js')
assert(packageEntry?.types === './dist/index.d.ts', 'Package type entry must point to ./dist/index.d.ts')

const runtimeEntry = new URL(packageEntry.import, import.meta.url)
const typeEntry = new URL(packageEntry.types, import.meta.url)
const runtimeSource = await readFile(runtimeEntry, 'utf8')
const typeSource = await readFile(typeEntry, 'utf8')
const weave = await import(runtimeEntry.href)

const expectedRuntimeExports = [
  'Absolute',
  'Badge',
  'Button',
  'Checkbox',
  'Column',
  'Flex',
  'Grid',
  'Icon',
  'Image',
  'Input',
  'List',
  'ListItem',
  'Link',
  'Presence',
  'Progress',
  'Radio',
  'Row',
  'Snack',
  'Stack',
  'SnackProvider',
  'Switch',
  'Text',
  'ThemeProvider',
  'ToolTip',
  'View',
  'createRoot',
  'createTheme',
  'defaultTheme',
  'useSnack',
  'useTheme',
]

for (const name of expectedRuntimeExports) {
  assert(name in weave, `Built package is missing runtime export: ${name}`)
}

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
assert(typeSource.includes('ViewLayoutAnimation'), 'Built declarations are missing ViewLayoutAnimation')
assert(typeSource.includes('PresenceProps'), 'Built declarations are missing PresenceProps')
assert(typeSource.includes('ReducedMotionPreference'), 'Built declarations are missing ReducedMotionPreference')
assert(typeSource.includes('AbsoluteProps'), 'Built declarations are missing AbsoluteProps')
assert(typeSource.includes('FlexProps'), 'Built declarations are missing FlexProps')
assert(typeSource.includes('GridProps'), 'Built declarations are missing GridProps')
assert(typeSource.includes('RowProps'), 'Built declarations are missing RowProps')
assert(typeSource.includes('StackProps'), 'Built declarations are missing StackProps')
assert(typeSource.includes('BadgeProps'), 'Built declarations are missing BadgeProps')
assert(typeSource.includes('ListProps'), 'Built declarations are missing ListProps')
assert(typeSource.includes('LinkProps'), 'Built declarations are missing LinkProps')
assert(typeSource.includes('RadioProps'), 'Built declarations are missing RadioProps')
assert(typeSource.includes('CheckboxProps'), 'Built declarations are missing CheckboxProps')

assert(
  /from\s*["']react-dom\/client["']/.test(runtimeSource),
  'Built package must keep react-dom/client external',
)
assert(
  !runtimeSource.includes('rendererPackageName: "react-dom"') &&
    !runtimeSource.includes('Incompatible React versions:'),
  'Built package contains bundled ReactDOM renderer internals',
)

console.log('Package verification passed.')
