import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '../../../index'

export default function AccordionBasicUsageDemo() {
  return (
    <Accordion defaultValue="first" collapsible>
      <AccordionItem value="first">
        <AccordionTrigger>First item</AccordionTrigger>
        <AccordionPanel>First panel content.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionTrigger>Second item</AccordionTrigger>
        <AccordionPanel>Second panel content.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
