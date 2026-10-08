import { type MouseEvent, useMemo } from 'react'
import type { SegmentedButtonItem, SegmentedButtonProps } from '../core/segmented-button-types'
import { ensureSegmentedButtonStylesheet } from '../renderers/dom/segmented-button-stylesheet'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { Button } from './Button'
import { useSelection } from './internal/use-selection'
import { Row } from './Row'

function itemButton(
  item: SegmentedButtonItem,
  props: SegmentedButtonProps,
  pressed: boolean | undefined,
  selectItem: (id: string) => void,
) {
  const { variant, size } = props
  const itemViewProps = item.viewProps ?? {}
  const viewProps = {
    ...itemViewProps,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      itemViewProps.onClick?.(event)
      if (!event.defaultPrevented) selectItem(item.id)
    },
  }

  return (
    <Button
      key={item.id}
      variant={variant}
      size={size}
      disabled={item.disabled}
      pressed={pressed}
      viewProps={viewProps}
    >
      {item.children}
    </Button>
  )
}

export function SegmentedButton(props: SegmentedButtonProps): import('react').JSX.Element {
  const { items, viewProps = {} } = props
  const enabledIds = useMemo(
    () => items.filter((item) => item.disabled !== true).map((item) => item.id),
    [items],
  )
  const { selection, selectedIds, selectItem } = useSelection(props, enabledIds)

  useStaticStylesheet(ensureSegmentedButtonStylesheet)

  return (
    <Row
      {...viewProps}
      role="group"
      gap={0}
      className={['weave-segmented-button', viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-segmented-button': '',
        'weave-segmented-button-selection': selection,
      }}
    >
      {items.map((item) =>
        itemButton(
          item,
          props,
          selection === 'none' ? undefined : selectedIds.has(item.id),
          selectItem,
        ),
      )}
    </Row>
  )
}
