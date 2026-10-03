import {
  Button,
  Card,
  Column,
  Dialog,
  Drawer,
  Form,
  List,
  ListItem,
  Menu,
  MenuItem,
  Popover,
  ToolTip,
} from '../index'
import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'
import {
  SampleAccordion,
  SampleTable,
  SampleTabs,
  SnackExample,
} from './documentation-component-example-previews'

export const compositeComponentExamples: Record<
  string,
  DocumentationComponentDocumentationDefinition
> = {
  Form: {
    description:
      'A semantic form root that preserves native submit/reset behavior while using Weave layout.',
    examples: [basicExample(<Form>Form content</Form>, `<Form>Form content</Form>`)],
  },
  Table: {
    description:
      'A structured table surface with density, borders, sticky header, and optional cell selection.',
    examples: [
      basicExample(
        <SampleTable />,
        `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead align="end">Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow id="alpha">
      <TableCell id="name">Alpha</TableCell>
      <TableCell id="value" align="end">42</TableCell>
    </TableRow>
    <TableRow id="beta">
      <TableCell id="name">Beta</TableCell>
      <TableCell id="value" align="end">84</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
      ),
    ],
  },
  Accordion: {
    description:
      'A single- or multi-open disclosure group with shared item, trigger, and panel semantics.',
    examples: [
      basicExample(
        <SampleAccordion />,
        `<Accordion defaultValue="first" collapsible>
  <AccordionItem value="first">
    <AccordionTrigger>First item</AccordionTrigger>
    <AccordionPanel>First panel content.</AccordionPanel>
  </AccordionItem>
  <AccordionItem value="second">
    <AccordionTrigger>Second item</AccordionTrigger>
    <AccordionPanel>Second panel content.</AccordionPanel>
  </AccordionItem>
</Accordion>`,
      ),
    ],
  },
  ToolTip: {
    description: 'A delayed, positioned tooltip attached to a single trigger element.',
    examples: [
      basicExample(
        <ToolTip content="Helpful tooltip" placement="top" delay={0} offset={0.5} defaultOpen>
          <Button text="Tooltip target" />
        </ToolTip>,
        `<ToolTip
  content="Helpful tooltip"
  placement="top"
  delay={0}
  offset={0.5}
  defaultOpen
>
  <Button text="Tooltip target" />
</ToolTip>`,
      ),
    ],
  },
  Popover: {
    description:
      'A positioned non-modal surface anchored to a trigger with focus and placement controls.',
    examples: [
      basicExample(
        <Popover
          content={<Card>Popover content</Card>}
          placement="bottom"
          offset={0.5}
          autoFocus={false}
          restoreFocus
          defaultOpen
        >
          <Button text="Popover target" />
        </Popover>,
        `<Popover
  content={<Card>Popover content</Card>}
  placement="bottom"
  offset={0.5}
  autoFocus={false}
  restoreFocus
  defaultOpen
>
  <Button text="Popover target" />
</Popover>`,
      ),
    ],
  },
  Dialog: {
    description:
      'A dialog surface that supports non-modal anchored and native modal top-layer modes.',
    examples: [
      basicExample(
        <Dialog
          modal={false}
          trigger={<Button text="Dialog trigger" />}
          placement="bottom"
          offset={0.5}
          autoFocus={false}
          restoreFocus
          defaultOpen
        >
          <Card>Dialog content</Card>
        </Dialog>,
        `<Dialog
  modal={false}
  trigger={<Button text="Dialog trigger" />}
  placement="bottom"
  offset={0.5}
  autoFocus={false}
  restoreFocus
  defaultOpen
>
  <Card>Dialog content</Card>
</Dialog>`,
      ),
    ],
  },
  Drawer: {
    description:
      'A side surface that reuses modal Dialog on narrow layouts and SplitBox for non-modal layouts.',
    examples: [
      basicExample(
        <Drawer
          side="left"
          mode="non-modal"
          defaultSize={8}
          resizable
          defaultOpen
          drawer={<Column padding={1}>Drawer surface</Column>}
          viewProps={{ width: 'fill', height: 12 }}
        >
          <Column padding={1}>Drawer content</Column>
        </Drawer>,
        `<Drawer
  side="left"
  mode="non-modal"
  defaultSize={8}
  resizable
  defaultOpen
  drawer={<Column padding={1}>Drawer surface</Column>}
  viewProps={{ width: 'fill', height: 12 }}
>
  <Column padding={1}>Drawer content</Column>
</Drawer>`,
      ),
    ],
  },
  Menu: {
    description:
      'A trigger-anchored command menu with keyboard focus, placement, and selection dismissal.',
    examples: [
      basicExample(
        <Menu
          trigger={<Button text="Menu trigger" />}
          placement="bottom-left"
          offset={0.5}
          closeOnSelect
          defaultOpen
        >
          <MenuItem text="First action" />
          <MenuItem text="Second action" />
        </Menu>,
        `<Menu
  trigger={<Button text="Menu trigger" />}
  placement="bottom-left"
  offset={0.5}
  closeOnSelect
  defaultOpen
>
  <MenuItem text="First action" />
  <MenuItem text="Second action" />
</Menu>`,
      ),
    ],
  },
  Tabs: {
    description:
      'Coordinates TabList, Tab, and TabPanel with orientation, activation, and indicator variants.',
    examples: [
      basicExample(
        <SampleTabs />,
        `<Tabs defaultValue="overview" indicatorThickness={2}>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="details">Details</Tab>
  </TabList>
  <TabPanel value="overview">Overview panel.</TabPanel>
  <TabPanel value="details">Details panel.</TabPanel>
</Tabs>`,
      ),
    ],
  },
  Snack: {
    description:
      'A transient status or alert message rendered through SnackProvider, with lifetime, progress, placement, and semantic variants.',
    examples: [
      {
        id: 'basic-usage',
        title: 'Basic usage',
        preview: <SnackExample />,
        codeMode: 'body',
        code: `const hostRef = useRef(null)

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
)`,
      },
    ],
  },
  List: {
    description:
      'A vertical or horizontal item collection with optional selection and virtualization semantics.',
    examples: [
      basicExample(
        <List orientation="vertical" selection="none">
          <ListItem id="one">First item</ListItem>
          <ListItem id="two">Second item</ListItem>
          <ListItem id="three">Third item</ListItem>
        </List>,
        `<List orientation="vertical" selection="none">
  <ListItem id="one">First item</ListItem>
  <ListItem id="two">Second item</ListItem>
  <ListItem id="three">Third item</ListItem>
</List>`,
      ),
    ],
  },
}
