import { useState } from 'react'
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '../../../index'

export default function AccordionControlledSingleDemo() {
  const [value, setValue] = useState<string | null>('general')

  return (
    <Accordion value={value} onValueChange={setValue} collapsible={false}>
      <AccordionItem value="general">
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionPanel>General settings</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger>Security</AccordionTrigger>
        <AccordionPanel>Security settings</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
