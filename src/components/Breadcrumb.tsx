import { Fragment } from 'react'
import type { BreadcrumbProps } from '../core/breadcrumb-types'
import { Icon } from './Icon'
import { chevronRightIcon } from './internal/control-icons'
import { useDateLocalization } from './internal/date-localization'
import { Link } from './Link'
import { Row } from './Row'
import { Text } from './Text'

export function Breadcrumb({
  items,
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
              <Icon svg={chevronRightIcon} size="small" viewProps={{ 'aria-hidden': true }} />
            ) : null}
            {index === items.length - 1 ? (
              <Text viewProps={{ 'aria-current': 'page' }}>{item.text}</Text>
            ) : item.href !== undefined ? (
              <Link href={item.href} text={item.text} hideIcon />
            ) : (
              <Text>{item.text}</Text>
            )}
          </Fragment>
        ))}
      </Row>
    </nav>
  )
}
