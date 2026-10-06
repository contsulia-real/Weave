import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger, Card } from '../../../index'

export default function AccordionDividerlessAccordionDemo() {
  return (
    <Card>
      <Accordion noDividers defaultValue="summary">
        <AccordionItem value="summary">
          <AccordionTrigger>Summary</AccordionTrigger>
          <AccordionPanel>Compact panel content</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
