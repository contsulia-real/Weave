import { useTranslation } from 'react-i18next'
import { Breadcrumb, MenuItem } from '../../../index'
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
        {
          text: t('Components'),
          menu: (
            <>
              <MenuItem text="Link" onSelect={() => navigate('/docs/components/Link')} />
              <MenuItem
                text="Pagination"
                onSelect={() => navigate('/docs/components/Pagination')}
              />
            </>
          ),
        },
        { text: current },
      ]}
    />
  )
}
