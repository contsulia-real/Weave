import { useState } from 'react'
import type { AccordionPanelProps } from '../core/accordion-types'
import { useAccordionContext, useAccordionItemContext } from './internal/accordion-context'
import { Presence } from './Presence'
import { View } from './View'

function useAccordionEnter(open: boolean): boolean {
  const [motionState, setMotionState] = useState(() => ({
    open,
    animateEnter: false,
  }))

  if (motionState.open === open) {
    return motionState.animateEnter
  }

  const nextState = {
    open,
    animateEnter: open,
  }
  setMotionState(nextState)
  return nextState.animateEnter
}

export function AccordionPanel(props: AccordionPanelProps): import('react').JSX.Element {
  const { children, viewProps = {} } = props
  const accordion = useAccordionContext('AccordionPanel')
  const item = useAccordionItemContext('AccordionPanel')
  const open = accordion.isOpen(item.value)
  const animateEnter = useAccordionEnter(open)

  const {
    enter = { animation: 'fade-down', spring: 'gentle' },
    exit = { animation: 'fade-up', spring: 'gentle' },
    ...panelViewProps
  } = viewProps

  return (
    <View
      {...panelViewProps}
      minHeight={panelViewProps.minHeight ?? 0}
      overflow={panelViewProps.overflow ?? 'hidden'}
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
        <View
          className="weave-accordion-panel__content"
          enter={animateEnter ? enter : undefined}
          exit={exit}
        >
          {children}
        </View>
      </Presence>
    </View>
  )
}
