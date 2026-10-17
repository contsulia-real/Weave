import { IconBrandGithubFilled } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Column, Divider, Grid, Icon, Link, Row, Text } from '../index'

export function WebsiteJsrLogo() {
  return (
    <svg viewBox="0 0 13 7" xmlns="http://www.w3.org/2000/svg">
      <path fill="#083344" d="M0 6h4v1h7V5h2V1H9V0H2v2H0" />
      <path fill="#f7df1e" d="M4 5V1H3v3H2V3H1v2h6V4H5V1h3v1h4v2h-1V3h-1v3H9V2H6v1h2v3H5V5" />
    </svg>
  )
}

const footerNavigation = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/' },
      { label: 'Components', href: '/docs/components/Button' },
      { label: 'Explore layouts', href: '/docs/components/Layout' },
      { label: 'Theming', href: '/docs/components/ThemeProvider' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Get started', href: '/docs/getting-started' },
      { label: 'API reference', href: '/docs/components-api/Button' },
      { label: 'Examples', href: '/docs/components/Button' },
      { label: 'Changelog' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/contsulia-real/Weave' },
      { label: 'JSR', href: 'https://jsr.io/@contsulia/weave' },
      { label: 'Report an issue', href: 'https://github.com/contsulia-real/Weave/issues' },
      { label: 'Discussions' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About' },
      { label: 'Blog' },
      { label: 'Roadmap' },
      { label: 'Contact' },
      { label: 'Privacy policy' },
      { label: 'Terms of service' },
    ],
  },
] as const

export function WebsiteFooter() {
  const { t } = useTranslation('website')

  return (
    <Column
      width="fill"
      background="surfaceHover"
      role="contentinfo"
      data={{ 'weave-website-footer': '' }}
    >
      <Divider />
      <Column
        width="fill"
        maxWidth={1120}
        alignSelf="center"
        paddingTop={64}
        paddingBottom={32}
        gap={56}
      >
        <Grid width="fill" columns={1} xl={{ columns: 2 }} gap={48}>
          <Column width="fill" minWidth={0} gap={12}>
            <Text typo="title-large">Weave</Text>
            <Text typo="title-medium">{t('Built for developers, ready for AI')}</Text>
            <Text typo="body-medium" color="tertiary">
              {t('An interaction-first React UI framework.')}
            </Text>
            <Link
              href="/docs/getting-started"
              text={t('Get started')}
              hideIcon
              hideUnderline
              viewProps={{ style: { color: 'var(--weave-color-tertiary)' } }}
            />
          </Column>
          <Grid width="fill" columns={1} sm={{ columns: 2 }} lg={{ columns: 4 }} gap={24}>
            {footerNavigation.map((group) => (
              <Column key={group.title} minWidth={0} gap={16}>
                <Text typo="label-large">{t(group.title)}</Text>
                <Column gap={12} align="start">
                  {group.links.map((link) => {
                    const isPlaceholder = !('href' in link)
                    return (
                      <Link
                        key={link.label}
                        href={isPlaceholder ? '#' : link.href}
                        text={t(link.label)}
                        hideIcon
                        hideUnderline
                        viewProps={
                          isPlaceholder
                            ? {
                                width: 'fit',
                                disabled: true,
                                style: {
                                  color: 'var(--weave-color-tertiary)',
                                  opacity: 0.55,
                                },
                                label: `${t(link.label)} — ${t('Coming soon')}`,
                                onClick: (event) => event.preventDefault(),
                                data: { 'weave-website-footer-placeholder': '' },
                              }
                            : {
                                width: 'fit',
                                style: { color: 'var(--weave-color-tertiary)' },
                              }
                        }
                      />
                    )
                  })}
                </Column>
              </Column>
            ))}
          </Grid>
        </Grid>
        <Row width="fill" align="center" justify="space-between" gap={24} wrap>
          <Column gap={4}>
            <Text typo="body-small" color="tertiary">
              © {new Date().getFullYear()} Weave.
            </Text>
            <Text typo="body-small" color="tertiary">
              {t('Weave is open source under the MIT License.')}
            </Text>
          </Column>
          <Row align="center" gap={24} wrap>
            <Link
              href="https://github.com/contsulia-real/Weave/blob/main/LICENSE"
              text={t('License')}
              hideIcon
              hideUnderline
              viewProps={{ style: { color: 'var(--weave-color-tertiary)' } }}
            />
            <Link
              href="https://github.com/contsulia-real/Weave"
              text={<Icon icon={IconBrandGithubFilled} size="medium" />}
              hideIcon
              hideUnderline
              viewProps={{
                label: 'GitHub',
                style: { color: 'var(--weave-color-tertiary)' },
              }}
            />
            <Link
              href="https://jsr.io/@contsulia/weave"
              text={<Icon svg={<WebsiteJsrLogo />} viewProps={{ width: 26, height: 16 }} />}
              hideIcon
              hideUnderline
              viewProps={{
                label: 'JSR',
                style: { color: 'var(--weave-color-tertiary)' },
              }}
            />
          </Row>
        </Row>
      </Column>
    </Column>
  )
}
