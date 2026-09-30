import {
  Children,
  isValidElement,
  type ReactNode,
  useCallback,
  useId,
  useInsertionEffect,
  useMemo,
  useState,
} from 'react'
import type { TabProps, TabsProps } from '../core/tabs-types'
import { resolveTabsTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureTabsStylesheet } from '../renderers/dom/tabs-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Flex } from './Flex'
import { TabsContext } from './internal/tabs-context'
import { Tab } from './Tab'
import { TabList } from './TabList'

interface TabDescriptor {
  value: string
  disabled: boolean
}

function collectTabsFromList(children: ReactNode, output: TabDescriptor[]): void {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    if (child.type === Tab) {
      const props = child.props as TabProps
      output.push({
        value: props.value,
        disabled: props.disabled === true,
      })
      return
    }

    const props = child.props as { children?: ReactNode }
    if (props.children !== undefined) {
      collectTabsFromList(props.children, output)
    }
  })
}

function collectTabDescriptors(children: ReactNode): TabDescriptor[] {
  const output: TabDescriptor[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== TabList) return
    collectTabsFromList((child.props as { children?: ReactNode }).children, output)
  })

  return output
}

function valueToken(value: string): string {
  return encodeURIComponent(value)
}

function assertUniqueTabValues(descriptors: readonly TabDescriptor[]): void {
  const values = new Set<string>()

  for (const descriptor of descriptors) {
    if (values.has(descriptor.value)) {
      throw new Error(`Tab value "${descriptor.value}" must be unique within Tabs`)
    }

    values.add(descriptor.value)
  }
}

export function Tabs({
  children,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activation = 'automatic',
  variant = 'underline',
  indicatorThickness,
  viewProps = {},
}: TabsProps) {
  useInsertionEffect(ensureTabsStylesheet, [])

  const descriptors = useMemo(() => {
    const collected = collectTabDescriptors(children)
    assertUniqueTabValues(collected)
    return collected
  }, [children])
  const enabledValues = useMemo(
    () => descriptors.filter((tab) => !tab.disabled).map((tab) => tab.value),
    [descriptors],
  )
  const initialValue = value ?? defaultValue ?? enabledValues[0] ?? null
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(() => initialValue)
  const [focusValue, setFocusValue] = useState<string | null>(() => initialValue)
  const resolvedUncontrolledValue =
    uncontrolledValue !== null && enabledValues.includes(uncontrolledValue)
      ? uncontrolledValue
      : (enabledValues[0] ?? null)
  const selectedValue = value === undefined ? resolvedUncontrolledValue : value
  const resolvedFocusValue =
    focusValue !== null && enabledValues.includes(focusValue)
      ? focusValue
      : (selectedValue ?? enabledValues[0] ?? null)
  const controlled = value !== undefined
  const baseId = useId().replace(/:/g, '')
  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass('tabs-theme', resolveTabsTheme(theme))
  const indicatorClassName = useRuntimeStyleClass(
    'tabs-props',
    indicatorThickness === undefined
      ? undefined
      : { '--weave-tabs-indicator-thickness': `${Math.max(0, indicatorThickness)}px` },
  )

  const requestValue = useCallback(
    (nextValue: string) => {
      if (nextValue === selectedValue || !enabledValues.includes(nextValue)) return

      if (!controlled) {
        setUncontrolledValue(nextValue)
      }

      onValueChange?.(nextValue)
    },
    [controlled, enabledValues, onValueChange, selectedValue],
  )

  const requestFocus = useCallback(
    (nextValue: string) => {
      if (!enabledValues.includes(nextValue)) return
      setFocusValue(nextValue)
    },
    [enabledValues],
  )

  const tabId = useCallback(
    (tabValue: string) => `weave-tabs-${baseId}-tab-${valueToken(tabValue)}`,
    [baseId],
  )
  const panelId = useCallback(
    (tabValue: string) => `weave-tabs-${baseId}-panel-${valueToken(tabValue)}`,
    [baseId],
  )

  const contextValue = useMemo(
    () => ({
      value: selectedValue,
      focusValue: resolvedFocusValue,
      orientation,
      activation,
      variant,
      requestValue,
      requestFocus,
      tabId,
      panelId,
    }),
    [
      activation,
      orientation,
      panelId,
      requestFocus,
      requestValue,
      resolvedFocusValue,
      selectedValue,
      tabId,
      variant,
    ],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <Flex
        {...viewProps}
        direction={orientation === 'vertical' ? 'row' : 'column'}
        className={['weave-tabs', themeClassName, indicatorClassName, viewProps.className]
          .filter(Boolean)
          .join(' ')}
        data={{
          ...viewProps.data,
          'weave-tabs': '',
          'weave-tabs-orientation': orientation,
          'weave-tabs-activation': activation,
          'weave-tabs-variant': variant,
          'weave-reduced-motion': reducedMotion ? 'reduce' : undefined,
        }}
      >
        {children}
      </Flex>
    </TabsContext.Provider>
  )
}
