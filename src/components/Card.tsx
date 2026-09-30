import type { KeyboardEvent, MouseEvent } from 'react'
import { useInsertionEffect } from 'react'
import type { CardProps } from '../core/card-types'
import { ensureCardStylesheet } from '../renderers/dom/card-stylesheet'
import { resolveCardTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { fromInteractiveDescendant } from './internal/interactive-descendant'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { View } from './View'

export function Card({
  children,
  clickable = false,
  selectable = false,
  selected,
  defaultSelected = false,
  onSelectedChange,
  viewProps = {},
}: CardProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('card-theme', resolveCardTheme(theme))
  const { value: resolvedSelected, request: requestSelected } = useControllableBoolean(
    selected,
    defaultSelected,
    onSelectedChange,
  )
  const interactive = clickable || selectable
  const disabled = viewProps.disabled === true

  useInsertionEffect(ensureCardStylesheet, [])

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    if (fromInteractiveDescendant(event.target, event.currentTarget)) {
      return
    }

    if (clickable) {
      viewProps.onClick?.(event)
    }

    if (event.defaultPrevented || !selectable) {
      return
    }

    requestSelected(!resolvedSelected)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    viewProps.onKeyDown?.(event)

    if (
      event.defaultPrevented ||
      !interactive ||
      fromInteractiveDescendant(event.target, event.currentTarget)
    ) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.currentTarget.click()
    }
  }

  return (
    <View
      {...viewProps}
      role={interactive ? 'button' : viewProps.role}
      pressed={selectable ? resolvedSelected : undefined}
      tabIndex={interactive ? (viewProps.tabIndex ?? 0) : viewProps.tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={['weave-card', themeClassName, viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-card': '',
        'weave-card-interactive': interactive ? 'true' : 'false',
        'weave-card-clickable': clickable ? 'true' : 'false',
        'weave-card-selectable': selectable ? 'true' : 'false',
        'weave-card-selected': selectable && resolvedSelected ? 'true' : 'false',
      }}
    >
      {children}
    </View>
  )
}
