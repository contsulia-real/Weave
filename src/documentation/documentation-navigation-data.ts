import apiData from './generated/documentation-component-api.json'

export interface DocumentationNavigationItemDefinition {
  path: string
  labelKey?: string
  label?: string
}

export interface DocumentationNavigationSectionDefinition {
  value: string
  labelKey: string
  items: readonly DocumentationNavigationItemDefinition[]
}

const componentSection = (
  value: string,
  labelKey: string,
  components: readonly string[],
): DocumentationNavigationSectionDefinition => ({
  value,
  labelKey,
  items: components.map((component) => ({
    label: component,
    path: `/docs/components/${component}`,
  })),
})

const componentNavigationSections: readonly DocumentationNavigationSectionDefinition[] = [
  componentSection('foundation', 'docs.nav.foundation', ['View', 'Layout', 'Presence']),
  componentSection('content-actions', 'docs.nav.contentActions', [
    'Text',
    'Code',
    'Image',
    'Icon',
    'Avatar',
    'Divider',
    'Link',
    'Badge',
    'Button',
    'Card',
    'AppBar',
  ]),
  componentSection('forms-status', 'docs.nav.formsStatus', [
    'Input',
    'Select',
    'Combobox',
    'Slider',
    'MarkSlider',
    'RangeSlider',
    'Switch',
    'Radio',
    'Checkbox',
    'Progress',
    'Skeleton',
  ]),
  componentSection('composite-ui', 'docs.nav.compositeUI', [
    'Form',
    'Table',
    'Accordion',
    'ToolTip',
    'Popover',
    'Dialog',
    'Drawer',
    'Menu',
    'Tabs',
    'Snack',
    'List',
  ]),
  componentSection('theme-application', 'docs.nav.themeApplication', ['ThemeProvider']),
]

const componentApiNames = Object.keys(apiData.components).sort((left, right) =>
  left.localeCompare(right),
)

const componentApiSection: DocumentationNavigationSectionDefinition = {
  value: 'components-api',
  labelKey: 'docs.nav.componentsApi',
  items: componentApiNames.map((component) => ({
    label: component,
    path: `/docs/components-api/${component}`,
  })),
}

const apiDemoParents: Readonly<Record<string, string>> = {
  Absolute: 'Layout',
  AccordionItem: 'Accordion',
  AccordionPanel: 'Accordion',
  AccordionTrigger: 'Accordion',
  Column: 'Layout',
  ComboboxOption: 'Combobox',
  Flex: 'Layout',
  FormDescription: 'Form',
  FormError: 'Form',
  FormField: 'Form',
  FormFieldset: 'Form',
  FormLabel: 'Form',
  FormLegend: 'Form',
  Grid: 'Layout',
  ListItem: 'List',
  MenuItem: 'Menu',
  Row: 'Layout',
  SelectOption: 'Select',
  SnackProvider: 'Snack',
  SplitBox: 'Layout',
  SplitBoxPane: 'Layout',
  Stack: 'Layout',
  Tab: 'Tabs',
  TabList: 'Tabs',
  TabPanel: 'Tabs',
  TableBody: 'Table',
  TableCell: 'Table',
  TableHead: 'Table',
  TableHeader: 'Table',
  TableRow: 'Table',
}

export const documentationNavigationSections: readonly DocumentationNavigationSectionDefinition[] =
  [
    {
      value: 'overview',
      labelKey: 'docs.nav.overview',
      items: [
        { labelKey: 'docs.nav.gettingStarted', path: '/docs/getting-started' },
        { labelKey: 'docs.nav.installation', path: '/docs/installation' },
        { labelKey: 'docs.nav.weaveAZ', path: '/docs/a-z' },
      ],
    },
    ...componentNavigationSections,
    componentApiSection,
  ]

export function documentationNavigationSectionForPath(pathname: string): string {
  return (
    documentationNavigationSections.find((section) =>
      section.items.some((item) => item.path === pathname),
    )?.value ?? 'overview'
  )
}

function documentedComponentNameForPath(pathname: string, prefix: string): string | null {
  if (!pathname.startsWith(prefix)) return null

  const name = pathname.slice(prefix.length)
  if (name.length === 0 || name.includes('/')) return null

  const exists = componentNavigationSections.some((section) =>
    section.items.some((item) => item.label === name),
  )

  return exists ? name : null
}

export function documentationComponentNameForPath(pathname: string): string | null {
  return documentedComponentNameForPath(pathname, '/docs/components/')
}

export function documentationComponentApiNameForPath(pathname: string): string | null {
  const prefix = '/docs/components-api/'
  if (!pathname.startsWith(prefix)) return null

  const name = pathname.slice(prefix.length)
  if (name.length === 0 || name.includes('/') || !componentApiNames.includes(name)) return null

  return name
}

export function documentationComponentDemoNameForApi(componentName: string): string {
  return apiDemoParents[componentName] ?? componentName
}
