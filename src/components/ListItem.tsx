import type { FocusEvent, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react'
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useContext,
  useInsertionEffect,
} from 'react'
import type { ListItemProps } from '../core/list-types'
import type { TextProps } from '../core/text-types'
import { ensureListStylesheet } from '../renderers/dom/list-stylesheet'
import { resolveListItemTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { fromInteractiveDescendant } from './internal/interactive-descendant'
import { ListContext } from './internal/list-context'
import { Text } from './Text'
import { View } from './View'

function singleLineChildren(children: ReactNode, enabled: boolean): ReactNode {
  if (!enabled) return children

  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return (
        <Text singleLine viewProps={{ grow: 1, minWidth: 0 }}>
          {child}
        </Text>
      )
    }

    if (!isValidElement(child)) return child

    if (child.type === Fragment) {
      const fragment = child as ReactElement<{ children?: ReactNode }>
      return cloneElement(fragment, {
        children: singleLineChildren(fragment.props.children, true),
      })
    }

    if (child.type === Text) {
      const text = child as ReactElement<TextProps>
      return cloneElement(text, {
        singleLine: true,
        viewProps: {
          grow: 1,
          minWidth: 0,
          ...text.props.viewProps,
        },
      })
    }

    return child
  })
}

export function ListItem({ id, children, disabled = false, viewProps = {} }: ListItemProps) {
  const context = useContext(ListContext)
  const { theme } = useTheme()

  useInsertionEffect(ensureListStylesheet, [])

  const themeClassName = useRuntimeStyleClass('list-item-theme', resolveListItemTheme(theme))

  const selectable = context !== null && context.selection !== 'none'
  const selected = selectable && context.selectedIds.has(id)
  const effectiveDisabled = disabled || context?.disabled === true
  const focusTarget = selectable && context.focusId === id

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (effectiveDisabled) {
      event.preventDefault()
      return
    }

    viewProps.onClick?.(event)

    if (
      event.defaultPrevented ||
      !selectable ||
      context === null ||
      fromInteractiveDescendant(event.target, event.currentTarget)
    ) {
      return
    }

    context.setFocusId(id)
    context.selectItem(id)
  }

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (effectiveDisabled) {
      return
    }

    viewProps.onFocus?.(event)

    if (
      event.defaultPrevented ||
      !selectable ||
      context === null ||
      event.target !== event.currentTarget
    ) {
      return
    }

    context.setFocusId(id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (effectiveDisabled) {
      event.preventDefault()
      return
    }

    viewProps.onKeyDown?.(event)

    if (
      event.defaultPrevented ||
      !selectable ||
      context === null ||
      fromInteractiveDescendant(event.target, event.currentTarget)
    ) {
      return
    }

    const previousKey = context.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = context.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      context.selectItem(id)
      return
    }

    if (event.key === previousKey) {
      event.preventDefault()
      context.moveFocus(id, 'previous')
      return
    }

    if (event.key === nextKey) {
      event.preventDefault()
      context.moveFocus(id, 'next')
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      context.moveFocus(id, 'first')
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      context.moveFocus(id, 'last')
    }
  }

  return (
    <View
      {...viewProps}
      role={selectable ? 'option' : 'listitem'}
      selected={selectable ? selected : undefined}
      disabled={effectiveDisabled ? true : undefined}
      tabIndex={selectable ? (viewProps.tabIndex ?? (focusTarget ? 0 : -1)) : viewProps.tabIndex}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      className={['weave-list-item', themeClassName, viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-list-item': '',
        'weave-list-item-id': id,
        'weave-list-item-selectable': selectable ? 'true' : 'false',
        'weave-list-item-selected': selected ? 'true' : 'false',
      }}
    >
      {singleLineChildren(children, context?.singleLine === true)}
    </View>
  )
}
