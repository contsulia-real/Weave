import { Fragment } from 'react'
import type { BreadcrumbProps } from '../core/breadcrumb-types'
import { Button } from './Button'
import { Icon } from './Icon'
import { chevronDownIcon, chevronRightIcon } from './internal/control-icons'
import { useDateLocalization } from './internal/date-localization'
import { Link } from './Link'
import { Menu } from './Menu'
import { Row } from './Row'
import { Text } from './Text'

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
              <span aria-hidden="true">
                {separator === undefined ? <Icon svg={chevronRightIcon} size="small" /> : separator}
              </span>
            ) : null}
            {item.menu !== undefined ? (
              <Menu
                trigger={
                  <Button
                    text={item.text}
                    icon={chevronDownIcon}
                    iconPosition="end"
                    variant="ghost"
                    size="small"
                    viewProps={{
                      'aria-current': index === items.length - 1 ? 'page' : undefined,
                    }}
                  />
                }
              >
                {item.menu}
              </Menu>
            ) : index === items.length - 1 ? (
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
