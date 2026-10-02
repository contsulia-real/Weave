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
    componentSection('foundation-layout', 'docs.nav.foundationLayout', [
      'View',
      'Flex',
      'Row',
      'Column',
      'Grid',
      'Stack',
      'Absolute',
      'SplitBox',
      'Presence',
    ]),
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

export function documentationNavigationSectionForPath(pathname: string): string {
  return (
    documentationNavigationSections.find((section) =>
      section.items.some((item) => item.path === pathname),
    )?.value ?? 'overview'
  )
}

export function documentationComponentNameForPath(pathname: string): string | null {
  const prefix = '/docs/components/'
  if (!pathname.startsWith(prefix)) return null

  const name = pathname.slice(prefix.length)
  if (name.length === 0 || name.includes('/')) return null

  const exists = documentationNavigationSections.some((section) =>
    section.items.some((item) => item.path === pathname && item.label === name),
  )

  return exists ? name : null
}
