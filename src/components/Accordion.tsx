import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useId,
  useInsertionEffect,
  useMemo,
  useState,
} from 'react'
import type {
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
} from '../core/accordion-types'
import { ensureAccordionStylesheet } from '../renderers/dom/accordion-stylesheet'
import { resolveAccordionTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { AccordionItem } from './AccordionItem'
import { Column } from './Column'
import { Divider } from './Divider'
import { AccordionContext } from './internal/accordion-context'

interface AccordionItemDescriptor {
  value: string
  disabled: boolean
}

function itemDescriptors(children: ReactNode): AccordionItemDescriptor[] {
  const output: AccordionItemDescriptor[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== AccordionItem) return

    const props = child.props as AccordionItemProps
    output.push({
      value: props.value,
      disabled: props.disabled === true,
    })
  })

  return output
}

function assertUniqueValues(descriptors: readonly AccordionItemDescriptor[]): void {
  const values = new Set<string>()

  for (const descriptor of descriptors) {
    if (values.has(descriptor.value)) {
      throw new Error(`AccordionItem value "${descriptor.value}" must be unique within Accordion`)
    }

    values.add(descriptor.value)
  }
}

function itemToken(value: string): string {
  return encodeURIComponent(value)
}

function accordionChildren(children: ReactNode, noDividers: boolean): ReactNode {
  const items = Children.toArray(children)
  if (noDividers) return items

  return items.flatMap((child, index) => {
    if (index === items.length - 1) return [child]

    return [
      child,
      <Divider
        key={`accordion-divider-${index}`}
        viewProps={{
          className: 'weave-accordion__divider',
          data: { 'weave-accordion-divider': '' },
        }}
      />,
    ]
  })
}

function SingleAccordion({
  children,
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  disabled = false,
  noDividers = false,
  viewProps = {},
}: AccordionSingleProps) {
  const descriptors = useMemo(() => {
    const collected = itemDescriptors(children)
    assertUniqueValues(collected)
    return collected
  }, [children])
  const firstEnabledValue = descriptors.find((item) => !item.disabled)?.value ?? null
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(() =>
    defaultValue === undefined ? firstEnabledValue : defaultValue,
  )
  const controlled = value !== undefined
  const resolvedValue = controlled ? value : uncontrolledValue
  const baseId = useId().replace(/:/g, '')
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('accordion-theme', resolveAccordionTheme(theme))

  useInsertionEffect(ensureAccordionStylesheet, [])

  const requestToggle = useCallback(
    (nextValue: string) => {
      if (disabled) return

      const descriptor = descriptors.find((item) => item.value === nextValue)
      if (descriptor?.disabled !== false) return

      const next = resolvedValue === nextValue ? (collapsible ? null : resolvedValue) : nextValue
      if (next === resolvedValue) return

      if (!controlled) {
        setUncontrolledValue(next)
      }

      onValueChange?.(next)
    },
    [collapsible, controlled, descriptors, disabled, onValueChange, resolvedValue],
  )

  const contextValue = useMemo(
    () => ({
      disabled,
      isOpen: (itemValue: string) => resolvedValue === itemValue,
      requestToggle,
      triggerId: (itemValue: string) => `weave-accordion-${baseId}-trigger-${itemToken(itemValue)}`,
      panelId: (itemValue: string) => `weave-accordion-${baseId}-panel-${itemToken(itemValue)}`,
    }),
    [baseId, disabled, requestToggle, resolvedValue],
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <Column
        {...viewProps}
        className={['weave-accordion', themeClassName, viewProps.className]
          .filter(Boolean)
          .join(' ')}
        data={{
          ...viewProps.data,
          'weave-accordion': '',
          'weave-accordion-multiple': 'false',
          'weave-accordion-disabled': disabled ? 'true' : 'false',
        }}
      >
        {accordionChildren(children, noDividers)}
      </Column>
    </AccordionContext.Provider>
  )
}

function MultipleAccordion({
  children,
  value,
  defaultValue = [],
  onValueChange,
  disabled = false,
  noDividers = false,
  viewProps = {},
}: AccordionMultipleProps) {
  const descriptors = useMemo(() => {
    const collected = itemDescriptors(children)
    assertUniqueValues(collected)
    return collected
  }, [children])
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => [...defaultValue])
  const controlled = value !== undefined
  const resolvedValue = controlled ? value : uncontrolledValue
  const selectedValues = useMemo(() => new Set(resolvedValue), [resolvedValue])
  const baseId = useId().replace(/:/g, '')
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('accordion-theme', resolveAccordionTheme(theme))

  useInsertionEffect(ensureAccordionStylesheet, [])

  const requestToggle = useCallback(
    (nextValue: string) => {
      if (disabled) return

      const descriptor = descriptors.find((item) => item.value === nextValue)
      if (descriptor?.disabled !== false) return

      const next = selectedValues.has(nextValue)
        ? resolvedValue.filter((itemValue) => itemValue !== nextValue)
        : [...resolvedValue, nextValue]

      if (!controlled) {
        setUncontrolledValue(next)
      }

      onValueChange?.(next)
    },
    [controlled, descriptors, disabled, onValueChange, resolvedValue, selectedValues],
  )

  const contextValue = useMemo(
    () => ({
      disabled,
      isOpen: (itemValue: string) => selectedValues.has(itemValue),
      requestToggle,
      triggerId: (itemValue: string) => `weave-accordion-${baseId}-trigger-${itemToken(itemValue)}`,
      panelId: (itemValue: string) => `weave-accordion-${baseId}-panel-${itemToken(itemValue)}`,
    }),
    [baseId, disabled, requestToggle, selectedValues],
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <Column
        {...viewProps}
        className={['weave-accordion', themeClassName, viewProps.className]
          .filter(Boolean)
          .join(' ')}
        data={{
          ...viewProps.data,
          'weave-accordion': '',
          'weave-accordion-multiple': 'true',
          'weave-accordion-disabled': disabled ? 'true' : 'false',
        }}
      >
        {accordionChildren(children, noDividers)}
      </Column>
    </AccordionContext.Provider>
  )
}

export function Accordion(props: AccordionProps): ReactElement {
  return props.multiple === true ? <MultipleAccordion {...props} /> : <SingleAccordion {...props} />
}
