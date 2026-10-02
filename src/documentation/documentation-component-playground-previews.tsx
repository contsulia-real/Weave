import { useRef } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
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
  useSnack,
} from '../index'
import {
  booleanValue,
  type DocumentationPlaygroundValue,
  numberValue,
  optionValue,
  snackPlacementOptions,
  snackVariantOptions,
  tabsActivationOptions,
  tabsOrientationOptions,
  tabsVariantOptions,
  textValue,
} from './documentation-component-playground-data'

export function SampleTable({
  dense = false,
  verticalBorders = false,
  stickyHeader = false,
  selectable = false,
}: {
  dense?: boolean
  verticalBorders?: boolean
  stickyHeader?: boolean
  selectable?: boolean
}) {
  const content = (
    <>
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
    </>
  )

  return selectable ? (
    <Table selectable dense={dense} verticalBorders={verticalBorders} stickyHeader={stickyHeader}>
      {content}
    </Table>
  ) : (
    <Table
      selectable={false}
      dense={dense}
      verticalBorders={verticalBorders}
      stickyHeader={stickyHeader}
    >
      {content}
    </Table>
  )
}

export function SampleAccordion({
  multiple = false,
  collapsible = true,
  disabled = false,
  noDividers = false,
}: {
  multiple?: boolean
  collapsible?: boolean
  disabled?: boolean
  noDividers?: boolean
}) {
  const children = (
    <>
      <AccordionItem value="first">
        <AccordionTrigger>First item</AccordionTrigger>
        <AccordionPanel>First panel content.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionTrigger>Second item</AccordionTrigger>
        <AccordionPanel>Second panel content.</AccordionPanel>
      </AccordionItem>
    </>
  )

  return multiple ? (
    <Accordion multiple defaultValue={['first']} disabled={disabled} noDividers={noDividers}>
      {children}
    </Accordion>
  ) : (
    <Accordion
      multiple={false}
      defaultValue="first"
      collapsible={collapsible}
      disabled={disabled}
      noDividers={noDividers}
    >
      {children}
    </Accordion>
  )
}

export function SampleTabs({
  orientation = 'horizontal',
  activation = 'automatic',
  variant = 'underline',
  indicatorThickness = 2,
}: {
  orientation?: (typeof tabsOrientationOptions)[number]
  activation?: (typeof tabsActivationOptions)[number]
  variant?: (typeof tabsVariantOptions)[number]
  indicatorThickness?: number
}) {
  return (
    <Tabs
      defaultValue="overview"
      orientation={orientation}
      activation={activation}
      variant={variant}
      indicatorThickness={indicatorThickness}
    >
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="details">Details</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel.</TabPanel>
      <TabPanel value="details">Details panel.</TabPanel>
    </Tabs>
  )
}

export function SnackPreview({ values }: { values: Record<string, DocumentationPlaygroundValue> }) {
  const hostRef = useRef<HTMLDivElement>(null)

  return (
    <Column ref={hostRef} minHeight={8}>
      <SnackProvider container={hostRef}>
        <Snack
          text={textValue(values, 'text')}
          variant={optionValue(values, 'variant', snackVariantOptions)}
          duration={numberValue(values, 'duration')}
          persistent={booleanValue(values, 'persistent')}
          progress={booleanValue(values, 'progress')}
          placement={optionValue(values, 'placement', snackPlacementOptions)}
          defaultOpen
        />
      </SnackProvider>
    </Column>
  )
}

export function SnackProviderTrigger({ label }: { label: string }) {
  const snack = useSnack()

  return (
    <Button
      text={label}
      viewProps={{
        onClick: () => {
          snack.show({ text: 'Snack from this provider', variant: 'info' })
        },
      }}
    />
  )
}
