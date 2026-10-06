import { useState } from 'react'
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '../../../index'

export default function AccordionMultiplePanelsDemo() {
  const [value, setValue] = useState<string[]>(['first', 'second'])

  return (
    <Accordion multiple value={value} onValueChange={setValue}>
      <AccordionItem value="first">
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionPanel>General settings</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionTrigger>Advanced</AccordionTrigger>
        <AccordionPanel>Advanced settings</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
