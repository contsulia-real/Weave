import { useRef } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Column,
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
} from '../index'

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
    <Column ref={hostRef} minHeight={8}>
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
