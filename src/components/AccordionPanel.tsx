import type { AccordionPanelProps } from '../core/accordion-types'
import { useAccordionContext, useAccordionItemContext } from './internal/accordion-context'
import { Presence } from './Presence'
import { View } from './View'

export function AccordionPanel({ children, viewProps = {} }: AccordionPanelProps) {
  const accordion = useAccordionContext('AccordionPanel')
  const item = useAccordionItemContext('AccordionPanel')
  const open = accordion.isOpen(item.value)
  const { enter = 'fade', exit = 'fade', ...panelViewProps } = viewProps

  return (
    <Presence present={open}>
      <View
        {...panelViewProps}
        id={accordion.panelId(item.value)}
        role="region"
        labelledBy={accordion.triggerId(item.value)}
        inert={!open}
        aria-hidden={open ? undefined : true}
        enter={enter}
        exit={exit}
        className={['weave-accordion-panel', viewProps.className].filter(Boolean).join(' ')}
        data={{
          ...viewProps.data,
          'weave-accordion-panel': '',
          'weave-accordion-panel-value': item.value,
        }}
      >
        {children}
      </View>
    </Presence>
  )
}
