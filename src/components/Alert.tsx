import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react'
import type { AlertProps, AlertVariant } from '../core/alert-types'
import { Column } from './Column'
import { Icon } from './Icon'
import { Row } from './Row'
import { Text } from './Text'

const appearances = {
  info: { color: 'primary', icon: IconInfoCircle },
  success: { color: 'success', icon: IconCircleCheck },
  warning: { color: 'warning', icon: IconAlertTriangle },
  error: { color: 'danger', icon: IconAlertCircle },
} as const satisfies Record<AlertVariant, { color: string; icon: typeof IconInfoCircle }>

export function Alert({
  variant = 'info',
  title,
  description,
  action,
  viewProps = {},
}: AlertProps): import('react').JSX.Element {
  const { color, icon } = appearances[variant]
  const tint = `var(--weave-color-${color})`

  return (
    <Row
      width="fill"
      align="start"
      gap={12}
      padding={16}
      border={1}
      radius="medium"
      background={`color-mix(in srgb, ${tint} 10%, var(--weave-color-surface))`}
      borderColor={`color-mix(in srgb, ${tint} 32%, var(--weave-color-surface))`}
      {...viewProps}
      role={variant === 'warning' || variant === 'error' ? 'alert' : 'status'}
      data={{
        ...viewProps.data,
        'weave-alert': '',
        'weave-alert-variant': variant,
      }}
    >
      <Icon icon={icon} viewProps={{ color, 'aria-hidden': true }} />
      <Column gap={4} grow={1} minWidth={0}>
        <Text typo="title-small">{title}</Text>
        {description === undefined ? null : (
          <Text typo="body-medium" color="secondary">
            {description}
          </Text>
        )}
        {action === undefined ? null : <Row marginTop={8}>{action}</Row>}
      </Column>
    </Row>
  )
}
