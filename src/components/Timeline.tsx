import type { TimelineProps } from '../core/timeline-types'
import { Column } from './Column'
import { Row } from './Row'
import { Text } from './Text'
import { View } from './View'

export function Timeline({ items, viewProps = {} }: TimelineProps): import('react').JSX.Element {
  return (
    <Column {...viewProps} role="list" data={{ ...viewProps.data, 'weave-timeline': '' }}>
      {items.map((item, index) => {
        const hasNext = index < items.length - 1

        return (
          <Row key={item.id} role="listitem" align="stretch" gap={12} minWidth={0}>
            <Column width={16} minWidth={16} align="center" aria-hidden="true">
              <View width={12} height={12} minWidth={12} radius="full" background="primary" />
              {hasNext ? <View width={2} minHeight={16} grow={1} background="outline" /> : null}
            </Column>
            <Column grow={1} minWidth={0} gap={4} paddingBottom={hasNext ? 20 : 0}>
              {item.time === undefined ? null : (
                <Text typo="label-small" color="secondary">
                  {item.time}
                </Text>
              )}
              <Text typo="title-small">{item.title}</Text>
              {item.description === undefined ? null : (
                <Text typo="body-small" color="secondary">
                  {item.description}
                </Text>
              )}
            </Column>
          </Row>
        )
      })}
    </Column>
  )
}
