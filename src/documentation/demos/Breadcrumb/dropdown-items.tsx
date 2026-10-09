import { useTranslation } from 'react-i18next'
import { Breadcrumb, Column, MenuItem } from '../../../index'
import {
  componentNavigationSections,
  documentationNavigationSectionForPath,
} from '../../documentation-navigation-data'
import { useDocsRoute } from '../../router'

export default function BreadcrumbDropdownItemsDemo() {
  const { t } = useTranslation(['translation', 'copy'])
  const { pathname, navigate } = useDocsRoute()
  const activeSection = documentationNavigationSectionForPath(pathname)
  const activeGroup = componentNavigationSections.find((group) => group.value === activeSection)
  const current = pathname.startsWith('/docs/components/')
    ? pathname.slice('/docs/components/'.length)
    : 'Breadcrumb'

  return (
    <Breadcrumb
      items={[
        { text: t('copy:Home'), href: '/docs' },
        {
          text: t(activeGroup?.labelKey ?? 'copy:Components'),
          menu: componentNavigationSections.map((group) => (
            <MenuItem
              key={group.value}
              text={t(group.labelKey)}
              onSelect={() => {
                const first = group.items[0]
                if (first !== undefined) navigate(first.path)
              }}
            />
          )),
        },
        {
          text: current,
          menu: (
            <Column maxHeight={320} overflow="auto">
              {activeGroup?.items.map((item) => (
                <MenuItem key={item.path} text={item.label} onSelect={() => navigate(item.path)} />
              ))}
            </Column>
          ),
        },
      ]}
    />
  )
}
