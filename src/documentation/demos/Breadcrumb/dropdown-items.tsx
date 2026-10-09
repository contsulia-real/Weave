import { useTranslation } from 'react-i18next'
import { Breadcrumb, Column, MenuItem } from '../../../index'
import { documentationComponentNavigationItems } from '../../documentation-navigation-data'
import { useDocsRoute } from '../../router'

export default function BreadcrumbDropdownItemsDemo() {
  const { t } = useTranslation('copy')
  const { pathname, navigate } = useDocsRoute()
  const current = pathname.startsWith('/docs/components/')
    ? pathname.slice('/docs/components/'.length)
    : 'Breadcrumb'

  return (
    <Breadcrumb
      items={[
        { text: t('Home'), href: '/docs' },
        { text: t('Components') },
        {
          text: current,
          menu: (
            <Column maxHeight={320} overflow="auto">
              {documentationComponentNavigationItems.map((item) => (
                <MenuItem key={item.path} text={item.name} onSelect={() => navigate(item.path)} />
              ))}
            </Column>
          ),
        },
      ]}
    />
  )
}
