import { type CSSProperties, useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { TabListProps } from '../core/tabs-types'
import { assignRef } from './internal/assign-ref'
import { useTabsContext } from './internal/tabs-context'
import { View } from './View'

interface IndicatorRect {
  left: number
  top: number
  width: number
  height: number
}

function sameRect(previous: IndicatorRect | null, next: IndicatorRect): boolean {
  if (previous === null) return false

  return (
    Math.abs(previous.left - next.left) < 0.5 &&
    Math.abs(previous.top - next.top) < 0.5 &&
    Math.abs(previous.width - next.width) < 0.5 &&
    Math.abs(previous.height - next.height) < 0.5
  )
}

export function TabList({ children, viewProps = {} }: TabListProps) {
  const context = useTabsContext('TabList')
  const listRef = useRef<HTMLDivElement | null>(null)
  const [indicatorRect, setIndicatorRect] = useState<IndicatorRect | null>(null)

  const setListRef = useCallback(
    (element: HTMLDivElement | null) => {
      listRef.current = element
      assignRef(viewProps.ref, element)
    },
    [viewProps.ref],
  )

  useLayoutEffect(() => {
    const list = listRef.current
    if (list === null || context.variant !== 'underline' || context.value === null) {
      setIndicatorRect(null)
      return
    }

    const update = () => {
      const selected = [...list.querySelectorAll<HTMLElement>('[data-weave-tab]')].find(
        (tab) => tab.dataset.weaveTabValue === context.value,
      )
      if (selected === undefined) return

      const listRect = list.getBoundingClientRect()
      const tabRect = selected.getBoundingClientRect()
      const next: IndicatorRect = {
        left: tabRect.left - listRect.left,
        top: tabRect.top - listRect.top,
        width: tabRect.width,
        height: tabRect.height,
      }

      setIndicatorRect((previous) => (sameRect(previous, next) ? previous : next))
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(list)
    for (const tab of list.querySelectorAll<HTMLElement>('[data-weave-tab]')) {
      observer.observe(tab)
    }

    return () => observer.disconnect()
  }, [context.orientation, context.value, context.variant])

  const indicatorStyle: CSSProperties | undefined =
    indicatorRect === null
      ? undefined
      : context.orientation === 'horizontal'
        ? {
            left: `${indicatorRect.left}px`,
            width: `${indicatorRect.width}px`,
            bottom: 0,
          }
        : {
            top: `${indicatorRect.top}px`,
            height: `${indicatorRect.height}px`,
            left: 0,
          }

  return (
    <View
      {...viewProps}
      ref={setListRef}
      role="tablist"
      aria-orientation={context.orientation}
      layout="flex"
      direction={context.orientation === 'vertical' ? 'column' : 'row'}
      wrap={false}
      className={['weave-tab-list', viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-tab-list': '',
        'weave-tab-list-orientation': context.orientation,
      }}
    >
      {children}
      {indicatorStyle === undefined ? null : (
        <View
          aria-hidden="true"
          className="weave-tab-indicator"
          layoutAnimation={{
            spring: 'snappy',
            interruption: 'continue',
          }}
          style={indicatorStyle}
          data={{
            'weave-tab-indicator': '',
          }}
        />
      )}
    </View>
  )
}
