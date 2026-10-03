import { useRef, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
  Column,
  Form,
  Input,
  Row,
  Snack,
  SnackProvider,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabPanel,
  Tabs,
  Text,
} from '../index'

export function ButtonClickExample() {
  const [clicks, setClicks] = useState(0)

  return (
    <Row gap={1} align="center">
      <Button
        text="Click me"
        viewProps={{
          onClick: () => {
            setClicks((current) => current + 1)
          },
        }}
      />
      <Text>{clicks === 1 ? '1 click' : `${clicks} clicks`}</Text>
    </Row>
  )
}

export function ButtonPressedExample() {
  const [pressed, setPressed] = useState(false)

  return (
    <Button
      text={pressed ? 'Pressed' : 'Not pressed'}
      pressed={pressed}
      viewProps={{
        onClick: () => {
          setPressed((current) => !current)
        },
      }}
    />
  )
}

export function ButtonFormExample() {
  const [status, setStatus] = useState('Waiting')

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        setStatus('Submitted')
      }}
      onReset={() => {
        setStatus('Reset')
      }}
      viewProps={{ width: 20 }}
    >
      <Column gap={1}>
        <Input placeholder="Message" type="text" />
        <Row gap={1}>
          <Button type="submit" text="Submit" />
          <Button type="reset" text="Reset" variant="secondary" />
        </Row>
        <Text typo="body-small">{status}</Text>
      </Column>
    </Form>
  )
}

export function SampleTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead align="end">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="alpha">
          <TableCell id="name">Alpha</TableCell>
          <TableCell id="value" align="end">
            42
          </TableCell>
        </TableRow>
        <TableRow id="beta">
          <TableCell id="name">Beta</TableCell>
          <TableCell id="value" align="end">
            84
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export function SampleAccordion() {
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

export function SampleTabs() {
  return (
    <Tabs defaultValue="overview" indicatorThickness={2}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="details">Details</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel.</TabPanel>
      <TabPanel value="details">Details panel.</TabPanel>
    </Tabs>
  )
}

export function SnackExample() {
  const hostRef = useRef<HTMLDivElement>(null)

  return (
    <Column ref={hostRef} width="fill" minHeight={8}>
      <SnackProvider container={hostRef}>
        <Snack
          text="Saved successfully"
          variant="success"
          duration={4000}
          persistent
          placement="bottom-center"
          defaultOpen
        />
      </SnackProvider>
    </Column>
  )
}
