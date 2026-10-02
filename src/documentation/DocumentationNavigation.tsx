import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Card,
  List,
  ListItem,
} from '../index'

const documentationOverview = [
  { key: 'docs.nav.gettingStarted', path: '/docs/getting-started' },
  { key: 'docs.nav.installation', path: '/docs/installation' },
  { key: 'docs.nav.weaveAZ', path: '/docs/a-z' },
] as const

const documentationComponentGroups = [
  {
    value: 'foundation-layout',
    labelKey: 'docs.nav.foundationLayout',
    components: [
      'View',
      'Flex',
      'Row',
      'Column',
      'Grid',
      'Stack',
      'Absolute',
      'SplitBox',
      'SplitBoxPane',
      'Presence',
    ],
  },
  {
    value: 'content-actions',
    labelKey: 'docs.nav.contentActions',
    components: [
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
    ],
  },
  {
    value: 'forms-status',
    labelKey: 'docs.nav.formsStatus',
    components: [
      'Input',
      'Select',
      'SelectOption',
      'Combobox',
      'ComboboxOption',
      'Slider',
      'RangeSlider',
      'Switch',
      'Radio',
      'Checkbox',
      'Progress',
      'Skeleton',
    ],
  },
  {
    value: 'composite-ui',
    labelKey: 'docs.nav.compositeUI',
    components: [
      'Form',
      'FormField',
      'FormLabel',
      'FormDescription',
      'FormError',
      'FormFieldset',
      'FormLegend',
      'Table',
      'TableHeader',
      'TableBody',
      'TableRow',
      'TableHead',
      'TableCell',
      'Accordion',
      'AccordionItem',
      'AccordionTrigger',
      'AccordionPanel',
      'ToolTip',
      'Popover',
      'Dialog',
      'Drawer',
      'Menu',
      'MenuItem',
      'Tabs',
      'TabList',
      'Tab',
      'TabPanel',
      'Snack',
      'SnackProvider',
      'List',
      'ListItem',
    ],
  },
  {
    value: 'theme-application',
    labelKey: 'docs.nav.themeApplication',
    components: ['ThemeProvider'],
  },
] as const

export interface DocumentationNavigationProps {
  onNavigate: (path: string) => void
}

export function DocumentationNavigation({ onNavigate }: DocumentationNavigationProps) {
  const { t } = useTranslation()

  return (
    <Card viewProps={{ height: 'fill' }}>
      <Accordion noDividers>
        <AccordionItem value="overview">
          <AccordionTrigger viewProps={{ radius: 'full' }}>
            {t('docs.nav.overview')}
          </AccordionTrigger>
          <AccordionPanel>
            <List noDividers>
              {documentationOverview.map(({ key, path }) => (
                <ListItem key={path} id={path} viewProps={{ onClick: () => onNavigate(path) }}>
                  {t(key)}
                </ListItem>
              ))}
            </List>
          </AccordionPanel>
        </AccordionItem>

        {documentationComponentGroups.map(({ value, labelKey, components }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger viewProps={{ radius: 'full' }}>{t(labelKey)}</AccordionTrigger>
            <AccordionPanel>
              <List noDividers>
                {components.map((component) => {
                  const path = `/docs/components/${component}`

                  return (
                    <ListItem
                      key={component}
                      id={component}
                      viewProps={{ onClick: () => onNavigate(path) }}
                    >
                      {component}
                    </ListItem>
                  )
                })}
              </List>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  )
}
