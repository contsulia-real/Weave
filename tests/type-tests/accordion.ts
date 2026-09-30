import type {
  AccordionMultipleProps,
  AccordionSingleProps,
  AccordionTriggerViewProps,
} from '../../src'

const single: AccordionSingleProps = {
  children: null,
  value: 'account',
  collapsible: true,
}

const multiple: AccordionMultipleProps = {
  children: null,
  multiple: true,
  value: ['account', 'security'],
}

const invalidMultipleCollapsible: AccordionMultipleProps = {
  children: null,
  multiple: true,
  // @ts-expect-error multiple mode does not expose collapsible
  collapsible: true,
}

const invalidSingleValue: AccordionSingleProps = {
  children: null,
  // @ts-expect-error single mode value is not an array
  value: ['account'],
}

const invalidTriggerExpanded: AccordionTriggerViewProps = {
  // @ts-expect-error AccordionTrigger owns aria-expanded
  expanded: true,
}

const invalidTriggerControls: AccordionTriggerViewProps = {
  // @ts-expect-error AccordionTrigger owns aria-controls
  controls: 'panel',
}

void [
  single,
  multiple,
  invalidMultipleCollapsible,
  invalidSingleValue,
  invalidTriggerExpanded,
  invalidTriggerControls,
]
