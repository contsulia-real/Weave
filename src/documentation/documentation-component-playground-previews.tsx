import { createElement, type ElementType, useRef } from 'react'
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
  playgroundAttributes = {},
  playgroundViewProps = {},
}: {
  dense?: boolean
  verticalBorders?: boolean
  stickyHeader?: boolean
  selectable?: boolean
  playgroundAttributes?: Record<string, DocumentationPlaygroundValue>
  playgroundViewProps?: Record<string, DocumentationPlaygroundValue>
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

  const resolvedChildren = playgroundAttributes.children ?? content

  return createElement(
    Table as ElementType,
    {
      selectable,
      dense,
      verticalBorders,
      stickyHeader,
      ...playgroundAttributes,
      viewProps: playgroundViewProps,
    },
    resolvedChildren,
  )
}

export function SampleAccordion({
  multiple = false,
  collapsible = true,
  disabled = false,
  noDividers = false,
  playgroundAttributes = {},
  playgroundViewProps = {},
}: {
  multiple?: boolean
  collapsible?: boolean
  disabled?: boolean
  noDividers?: boolean
  playgroundAttributes?: Record<string, DocumentationPlaygroundValue>
  playgroundViewProps?: Record<string, DocumentationPlaygroundValue>
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

  const resolvedChildren = playgroundAttributes.children ?? children

  return createElement(
    Accordion as ElementType,
    {
      multiple,
      defaultValue: multiple ? ['first'] : 'first',
      collapsible: multiple ? undefined : collapsible,
      disabled,
      noDividers,
      ...playgroundAttributes,
      viewProps: playgroundViewProps,
    },
    resolvedChildren,
  )
}

export function SampleTabs({
  orientation = 'horizontal',
  activation = 'automatic',
  variant = 'underline',
  indicatorThickness = 2,
  playgroundAttributes = {},
  playgroundViewProps = {},
}: {
  orientation?: (typeof tabsOrientationOptions)[number]
  activation?: (typeof tabsActivationOptions)[number]
  variant?: (typeof tabsVariantOptions)[number]
  indicatorThickness?: number
  playgroundAttributes?: Record<string, DocumentationPlaygroundValue>
  playgroundViewProps?: Record<string, DocumentationPlaygroundValue>
}) {
  return createElement(
    Tabs as ElementType,
    {
      defaultValue: 'overview',
      orientation,
      activation,
      variant,
      indicatorThickness,
      ...playgroundAttributes,
      viewProps: playgroundViewProps,
    },
    <>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="details">Details</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel.</TabPanel>
      <TabPanel value="details">Details panel.</TabPanel>
    </>,
  )
}

export function SnackPreview({
  values,
  playgroundAttributes = {},
  playgroundViewProps = {},
}: {
  values: Record<string, DocumentationPlaygroundValue>
  playgroundAttributes?: Record<string, DocumentationPlaygroundValue>
  playgroundViewProps?: Record<string, DocumentationPlaygroundValue>
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const snack = createElement(Snack as ElementType, {
    text: textValue(values, 'text'),
    variant: optionValue(values, 'variant', snackVariantOptions),
    duration: numberValue(values, 'duration'),
    persistent: booleanValue(values, 'persistent'),
    progress: booleanValue(values, 'progress'),
    placement: optionValue(values, 'placement', snackPlacementOptions),
    defaultOpen: true,
    ...playgroundAttributes,
    viewProps: playgroundViewProps,
  })

  return (
    <Column ref={hostRef} minHeight={8}>
      <SnackProvider container={hostRef}>{snack}</SnackProvider>
    </Column>
  )
}
