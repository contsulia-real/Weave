import type { EmptyStateProps } from '../core/empty-state-types'
import { Column } from './Column'
import { Text } from './Text'
import { View } from './View'

export function EmptyState({
  title,
  description,
  icon,
  action,
  viewProps = {},
}: EmptyStateProps): import('react').JSX.Element {
  return (
    <Column
      width="fill"
      align="center"
      justify="center"
      gap={12}
      padding={24}
      {...viewProps}
      data={{ ...viewProps.data, 'weave-empty-state': '' }}
    >
      {icon === undefined ? null : (
        <View role="presentation" aria-hidden="true">
          {icon}
        </View>
      )}
      <Text typo="title-medium" align="center">
        {title}
      </Text>
      {description === undefined ? null : (
        <Text typo="body-medium" color="secondary" align="center">
          {description}
        </Text>
      )}
      {action}
    </Column>
  )
}
