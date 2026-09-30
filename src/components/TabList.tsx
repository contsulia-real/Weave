import {
  type CSSProperties,
  useCallback,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { TabListProps } from '../core/tabs-types'
import { ensureButtonStylesheet } from '../renderers/dom/button-stylesheet'
import { ensureInputStylesheet } from '../renderers/dom/input-stylesheet'
import { resolveButtonTheme, resolveInputTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { Flex } from './Flex'
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
  const { theme } = useTheme()
  const inputThemeClassName = useRuntimeStyleClass('input-theme', resolveInputTheme(theme))
  const buttonThemeClassName = useRuntimeStyleClass('button-theme', resolveButtonTheme(theme))
  const listRef = useRef<HTMLDivElement | null>(null)
  const [indicatorRect, setIndicatorRect] = useState<IndicatorRect | null>(null)
  const pill = context.variant === 'pill'

  useInsertionEffect(() => {
    if (!pill) return
    ensureInputStylesheet()
    ensureButtonStylesheet()
  }, [pill])

  const setListRef = useCallback(
    (element: HTMLDivElement | null) => {
      listRef.current = element
      assignRef(viewProps.ref, element)
    },
    [viewProps.ref],
  )

  useLayoutEffect(() => {
    const list = listRef.current
    if (list === null || context.value === null) {
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
      : pill
        ? {
            left: `${indicatorRect.left}px`,
            top: `${indicatorRect.top}px`,
            width: `${indicatorRect.width}px`,
            height: `${indicatorRect.height}px`,
            opacity: 1,
          }
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
    <Flex
      {...viewProps}
      ref={setListRef}
      role="tablist"
      aria-orientation={context.orientation}
      direction={context.orientation === 'vertical' ? 'column' : 'row'}
      wrap={false}
      align={
        viewProps.align ?? (pill && context.orientation === 'horizontal' ? 'start' : undefined)
      }
      gap={viewProps.gap ?? (pill ? 'var(--weave-tabs-list-gap)' : undefined)}
      width={viewProps.width ?? (pill ? 'fit' : undefined)}
      minWidth={viewProps.minWidth ?? (pill ? 0 : undefined)}
      padding={viewProps.padding ?? (pill ? 0.25 : undefined)}
      className={[
        'weave-tab-list',
        pill ? 'weave-select' : undefined,
        pill ? inputThemeClassName : undefined,
        pill ? buttonThemeClassName : undefined,
        viewProps.className,
      ]
        .filter(Boolean)
        .join(' ')}
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
          aria-disabled={pill ? 'true' : undefined}
          className={[
            'weave-tab-indicator',
            pill ? 'weave-tab-indicator--pill' : 'weave-tab-indicator--underline',
            pill ? 'weave-button' : undefined,
            pill ? 'weave-button--primary' : undefined,
            pill ? 'weave-button--medium' : undefined,
            pill ? buttonThemeClassName : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
          layoutAnimation={{
            spring: 'snappy',
            interruption: 'continue',
          }}
          minWidth={pill ? 0 : undefined}
          minHeight={pill ? 0 : undefined}
          padding={pill ? 0 : undefined}
          pointerEvents="none"
          style={indicatorStyle}
          data={{
            'weave-tab-indicator': '',
            'weave-tab-indicator-variant': context.variant,
          }}
        />
      )}
    </Flex>
  )
}
