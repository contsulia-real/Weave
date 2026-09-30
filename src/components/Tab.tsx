import type { KeyboardEvent, MouseEvent } from 'react'
import type { TabProps } from '../core/tabs-types'
import type { ViewProps } from '../core/view-types'
import { useTabsContext } from './internal/tabs-context'
import { useViewHost } from './internal/use-view-host'

type TabMove = 'previous' | 'next' | 'first' | 'last'

function enabledTabs(current: HTMLButtonElement): HTMLButtonElement[] {
  const tabList = current.closest('[role="tablist"]')

  if (tabList === null) return []

  return [...tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')]
}

function movedTab(current: HTMLButtonElement, move: TabMove): HTMLButtonElement | null {
  const tabs = enabledTabs(current)

  if (tabs.length === 0) return null

  if (move === 'first') return tabs[0] ?? null
  if (move === 'last') return tabs[tabs.length - 1] ?? null

  const index = Math.max(0, tabs.indexOf(current))
  const delta = move === 'previous' ? -1 : 1
  const nextIndex = (index + delta + tabs.length) % tabs.length

  return tabs[nextIndex] ?? null
}

export function Tab({ value, children, disabled = false, viewProps = {} }: TabProps) {
  const context = useTabsContext('Tab')
  const selected = context.value === value
  const focused = context.focusValue === value
  const hostProps: ViewProps<HTMLButtonElement> = {
    ...viewProps,
    disabled,
    tabIndex: viewProps.tabIndex ?? (focused ? 0 : -1),
    layout: 'flex',
    align: 'center',
    justify: 'center',
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    viewProps.onClick?.(event)

    if (event.defaultPrevented || disabled) return

    context.requestFocus(value)
    context.requestValue(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    viewProps.onKeyDown?.(event)

    if (event.defaultPrevented || disabled) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      context.requestFocus(value)
      context.requestValue(value)
      return
    }

    const previousKey = context.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = context.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

    let move: TabMove | null = null

    if (event.key === previousKey) {
      move = 'previous'
    } else if (event.key === nextKey) {
      move = 'next'
    } else if (event.key === 'Home') {
      move = 'first'
    } else if (event.key === 'End') {
      move = 'last'
    }

    if (move === null) return

    event.preventDefault()

    const nextTab = movedTab(event.currentTarget, move)
    if (nextTab === null) return

    nextTab.focus()

    const nextValue = nextTab.dataset.weaveTabValue
    if (nextValue === undefined) return

    context.requestFocus(nextValue)

    if (context.activation === 'automatic') {
      context.requestValue(nextValue)
    }
  }

  return (
    <button
      {...resolved.domProps}
      ref={elementRef}
      type="button"
      id={context.tabId(value)}
      role="tab"
      aria-selected={selected}
      aria-controls={context.panelId(value)}
      aria-disabled={disabled ? true : undefined}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-weave-view=""
      data-weave-tab=""
      data-weave-tab-value={value}
      data-weave-tab-selected={selected ? 'true' : 'false'}
      data-weave-layout={resolved.layout}
      className={['weave-tab', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </button>
  )
}
