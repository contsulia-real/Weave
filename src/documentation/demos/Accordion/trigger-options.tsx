import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '../../../index'

const expandIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M6 12h12M12 6v12" />
  </svg>
)

const collapseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M6 12h12" />
  </svg>
)

export default function AccordionTriggerOptionsDemo() {
  return (
    <Accordion defaultValue="details" viewProps={{ width: 320 }}>
      <AccordionItem value="details">
        <AccordionTrigger singleLine expandIcon={expandIcon} collapseIcon={collapseIcon}>
          A deliberately long trigger label that truncates within the available width
        </AccordionTrigger>
        <AccordionPanel>Custom trigger options keep the same accordion semantics.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
