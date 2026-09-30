import type { AccordionPanelProps } from '../core/accordion-types'
import { useAccordionContext, useAccordionItemContext } from './internal/accordion-context'
import { Presence } from './Presence'
import { View } from './View'

export function AccordionPanel({ children, viewProps = {} }: AccordionPanelProps) {
  const accordion = useAccordionContext('AccordionPanel')
  const item = useAccordionItemContext('AccordionPanel')
  const open = accordion.isOpen(item.value)
  const {
    enter = { animation: 'fade-down', spring: 'gentle' },
    exit = { animation: 'fade-up', spring: 'gentle' },
    ...panelViewProps
  } = viewProps

  return (
    <View
      {...panelViewProps}
      id={accordion.panelId(item.value)}
      role="region"
      labelledBy={accordion.triggerId(item.value)}
      inert={!open}
      aria-hidden={open ? undefined : true}
      className={['weave-accordion-panel', viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-accordion-panel': '',
        'weave-accordion-panel-value': item.value,
        'weave-accordion-panel-open': open ? 'true' : 'false',
      }}
    >
      <Presence present={open}>
        <View className="weave-accordion-panel__content" enter={enter} exit={exit}>
          {children}
        </View>
      </Presence>
    </View>
  )
}
