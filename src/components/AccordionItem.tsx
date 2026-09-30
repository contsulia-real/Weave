import type { AccordionItemProps } from '../core/accordion-types'
import { AccordionItemContext, useAccordionContext } from './internal/accordion-context'
import { View } from './View'

export function AccordionItem({
  value,
  children,
  disabled = false,
  viewProps = {},
}: AccordionItemProps) {
  const accordion = useAccordionContext('AccordionItem')
  const resolvedDisabled = accordion.disabled || disabled
  const open = accordion.isOpen(value)

  return (
    <AccordionItemContext.Provider value={{ value, disabled: resolvedDisabled }}>
      <View
        {...viewProps}
        className={['weave-accordion-item', viewProps.className].filter(Boolean).join(' ')}
        data={{
          ...viewProps.data,
          'weave-accordion-item': '',
          'weave-accordion-item-value': value,
          'weave-accordion-item-open': open ? 'true' : 'false',
          'weave-accordion-item-disabled': resolvedDisabled ? 'true' : 'false',
        }}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  )
}
