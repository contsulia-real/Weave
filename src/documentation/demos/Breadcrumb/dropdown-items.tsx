import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Breadcrumb,
  Column,
  MenuItem,
} from '../../../index'
import {
  componentNavigationSections,
  documentationNavigationSectionForPath,
} from '../../documentation-navigation-data'
import { useDocsRoute } from '../../router'

export default function BreadcrumbDropdownItemsDemo() {
  const { t } = useTranslation(['translation', 'copy'])
  const { pathname, navigate } = useDocsRoute()
  const activeSection = documentationNavigationSectionForPath(pathname)
  const current = pathname.startsWith('/docs/components/')
    ? pathname.slice('/docs/components/'.length)
    : 'Breadcrumb'

  return (
    <Breadcrumb
      items={[
        { text: t('copy:Home'), href: '/docs' },
        { text: t('copy:Components') },
        {
          text: current,
          menu: (
            <Column maxHeight={320} overflow="auto">
              <Accordion noDividers defaultValue={activeSection} viewProps={{ width: 'fill' }}>
                {componentNavigationSections.map((section) => (
                  <AccordionItem key={section.value} value={section.value}>
                    <AccordionTrigger singleLine>{t(section.labelKey)}</AccordionTrigger>
                    <AccordionPanel>
                      {section.items.map((item) => (
                        <MenuItem
                          key={item.path}
                          text={item.label}
                          onSelect={() => navigate(item.path)}
                        />
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Column>
          ),
        },
      ]}
    />
  )
}
