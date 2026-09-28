import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import type {
  IconComponent,
  IconSvg,
} from '../../core/icon-types'
import type {
  ListDataItem,
  ListItemIcon,
  ListItemProps,
} from '../../core/list-types'
import type { TextTypo } from '../../core/text-types'
import { Icon } from '../Icon'
import { ListItem } from '../ListItem'
import { Text } from '../Text'
import { View } from '../View'
import type { VirtualListEntry } from './VirtualListWindow'

export interface ListDescriptor {
  id: string
  disabled: boolean
}

export function listDescriptors(
  items: readonly ListDataItem[] | undefined,
  children: ReactNode,
): readonly ListDescriptor[] {
  const output: ListDescriptor[] = []

  if (items !== undefined) {
    for (const item of items) {
      output.push({
        id: item.id,
        disabled: item.disabled === true,
      })
    }
  } else {
    collectCompositeDescriptors(children, output)
  }

  assertUniqueIds(output)
  return output
}

function collectCompositeDescriptors(
  children: ReactNode,
  output: ListDescriptor[],
): void {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    if (child.type === Fragment) {
      collectCompositeDescriptors(
        (child.props as { children?: ReactNode }).children,
        output,
      )
      return
    }

    if (child.type !== ListItem) return

    const itemProps = child.props as ListItemProps
    output.push({
      id: itemProps.id,
      disabled: itemProps.disabled === true,
    })
  })
}

function assertUniqueIds(
  descriptors: readonly ListDescriptor[],
): void {
  const seen = new Set<string>()

  for (const item of descriptors) {
    if (seen.has(item.id)) {
      throw new Error(
        `List item id "${item.id}" is duplicated`,
      )
    }

    seen.add(item.id)
  }
}

export function compositeVirtualEntries(
  children: ReactNode,
): VirtualListEntry[] {
  const output: VirtualListEntry[] = []
  collectVirtualEntries(children, output)
  return output
}

function collectVirtualEntries(
  children: ReactNode,
  output: VirtualListEntry[],
): void {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    if (child.type === Fragment) {
      collectVirtualEntries(
        (child.props as { children?: ReactNode }).children,
        output,
      )
      return
    }

    if (child.type !== ListItem) return

    const element = child as ReactElement<ListItemProps>
    output.push({
      id: element.props.id,
      node: cloneElement(element, {
        key: element.props.id,
      }),
    })
  })
}

function listIcon(icon: ListItemIcon) {
  if (isValidElement(icon)) {
    return (
      <Icon
        svg={icon as IconSvg}
        size="medium"
        stroke="regular"
        viewProps={{
          className: 'weave-list-item__icon',
          width: 'var(--weave-list-item-icon-size)',
          height: 'var(--weave-list-item-icon-size)',
          'aria-hidden': true,
        }}
      />
    )
  }

  return (
    <Icon
      icon={icon as IconComponent}
      size="medium"
      stroke="regular"
      viewProps={{
        className: 'weave-list-item__icon',
        'aria-hidden': true,
      }}
    />
  )
}

function dataItemContent(
  item: ListDataItem,
  primaryTypo: TextTypo | undefined,
  secondaryTypo: TextTypo | undefined,
) {
  return (
    <>
      {item.icon === undefined
        ? null
        : listIcon(item.icon)}

      <View className="weave-list-item__text">
        <Text typo={primaryTypo ?? 'body-medium'}>
          {item.text}
        </Text>

        {item.secondaryText === undefined
          ? null
          : (
              <Text
                typo={secondaryTypo ?? 'body-small'}
                viewProps={{
                  className:
                    'weave-list-item__secondary',
                }}
              >
                {item.secondaryText}
              </Text>
            )}
      </View>

      {item.trailing === undefined
        ? null
        : (
            <View className="weave-list-item__trailing">
              {item.trailing}
            </View>
          )}
    </>
  )
}

export function dataVirtualEntries(
  items: readonly ListDataItem[],
  disabled: boolean,
  primaryTypo: TextTypo | undefined,
  secondaryTypo: TextTypo | undefined,
): VirtualListEntry[] {
  return items.map((item) => ({
    id: item.id,
    node: (
      <ListItem
        key={item.id}
        id={item.id}
        disabled={disabled || item.disabled}
      >
        {dataItemContent(
          item,
          primaryTypo,
          secondaryTypo,
        )}
      </ListItem>
    ),
  }))
}
