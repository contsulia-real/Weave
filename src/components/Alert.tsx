import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react'
import type { AlertProps, AlertVariant } from '../core/alert-types'
import { Grid } from './Grid'
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
    <Grid
      width="fill"
      columns="auto minmax(0, 1fr)"
      align="start"
      gap={4}
      padding={16}
      border={1}
      radius="medium"
      background={`color-mix(in srgb, ${tint} 10%, var(--weave-color-surface))`}
      borderColor={`color-mix(in srgb, ${tint} 32%, var(--weave-color-surface))`}
      {...viewProps}
      style={{ columnGap: 12, ...viewProps.style }}
      role={variant === 'warning' || variant === 'error' ? 'alert' : 'status'}
      data={{
        ...viewProps.data,
        'weave-alert': '',
        'weave-alert-variant': variant,
      }}
    >
      <Icon
        icon={icon}
        viewProps={{ color, 'aria-hidden': true, column: 1, row: 1, alignSelf: 'center' }}
      />
      <Text typo="title-small" viewProps={{ column: 2, row: 1 }}>
        {title}
      </Text>
      {description === undefined ? null : (
        <Text typo="body-medium" color="secondary" viewProps={{ column: 2 }}>
          {description}
        </Text>
      )}
      {action === undefined ? null : (
        <Row column={2} marginTop={8}>
          {action}
        </Row>
      )}
    </Grid>
  )
}
