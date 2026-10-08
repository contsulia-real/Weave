import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Column,
  Text,
} from '../../../index'

export default function AccordionDisabledStatesDemo() {
  return (
    <Column gap={32}>
      <Column gap={8}>
        <Text typo="label-medium">Disabled item</Text>
        <Accordion defaultValue="general">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionPanel>General settings</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="security" disabled>
            <AccordionTrigger>Security</AccordionTrigger>
            <AccordionPanel>Security settings</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Column>

      <Column gap={8}>
        <Text typo="label-medium">Disabled accordion</Text>
        <Accordion defaultValue="billing" disabled>
          <AccordionItem value="billing">
            <AccordionTrigger>Billing</AccordionTrigger>
            <AccordionPanel>Billing settings stay visible.</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="team">
            <AccordionTrigger>Team</AccordionTrigger>
            <AccordionPanel>Team settings</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Column>
    </Column>
  )
}
