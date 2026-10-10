import { Fragment, type ReactNode } from 'react'
import type { BreadcrumbProps } from '../core/breadcrumb-types'
import { ensureLinkStylesheet } from '../renderers/dom/link-stylesheet'
import { resolveLinkTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Icon } from './Icon'
import { chevronDownIcon, chevronRightIcon } from './internal/control-icons'
import { useDateLocalization } from './internal/date-localization'
import { useViewHost } from './internal/use-view-host'
import { Link } from './Link'
import { Menu } from './Menu'
import { Row } from './Row'
import { Text } from './Text'

function BreadcrumbMenuTrigger({
  text,
  current,
}: {
  text: ReactNode
  current: boolean
}): import('react').JSX.Element {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('link-theme', resolveLinkTheme(theme))
  const { elementRef, className, inlineStyle, resolved } = useViewHost<HTMLButtonElement>({
    background: 'transparent',
    paddingX: 12,
    paddingY: 8,
    radius: 'medium',
    clickable: true,
    transition: { properties: ['background-color'], duration: 'normal' },
  })

  useStaticStylesheet(ensureLinkStylesheet)

  return (
    <button
      {...resolved.domProps}
      ref={elementRef}
      type="button"
      aria-current={current ? 'page' : undefined}
      data-weave-view=""
      data-weave-link-underline="hidden"
      data-weave-layout={resolved.layout}
      className={['weave-link', themeClassName, className].filter(Boolean).join(' ')}
      style={{
        ...inlineStyle,
        appearance: 'none',
        border: 0,
        font: 'inherit',
      }}
    >
      <Text viewProps={{ className: 'weave-link__text' }}>{text}</Text>
      <Icon
        svg={chevronDownIcon}
        size="small"
        viewProps={{
          width: 'var(--weave-link-theme-icon-size)',
          height: 'var(--weave-link-theme-icon-size)',
          pointerEvents: 'none',
        }}
      />
    </button>
  )
}

export function Breadcrumb({
  items,
  separator,
  label,
  viewProps = {},
}: BreadcrumbProps): import('react').JSX.Element {
  const { messages } = useDateLocalization()

  return (
    <nav aria-label={label ?? messages.breadcrumbs} data-weave-breadcrumb="">
      <Row {...viewProps} align="center" gap={8} wrap>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 ? (
              <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {separator === undefined ? <Icon svg={chevronRightIcon} size="small" /> : separator}
              </span>
            ) : null}
            {item.menu !== undefined ? (
              <Menu
                trigger={
                  <BreadcrumbMenuTrigger text={item.text} current={index === items.length - 1} />
                }
              >
                {item.menu}
              </Menu>
            ) : index === items.length - 1 ? (
              <Text viewProps={{ 'aria-current': 'page' }}>{item.text}</Text>
            ) : item.href !== undefined ? (
              <Link
                href={item.href}
                text={item.text}
                hideIcon
                hideUnderline
                viewProps={{
                  background: 'transparent',
                  paddingX: 12,
                  paddingY: 8,
                  radius: 'medium',
                  clickable: true,
                  transition: { properties: ['background-color'], duration: 'normal' },
                }}
              />
            ) : (
              <Text>{item.text}</Text>
            )}
          </Fragment>
        ))}
      </Row>
    </nav>
  )
}
