import { IconDots, IconSearch, IconStar } from '@tabler/icons-react'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  AppBar,
  Avatar,
  Badge,
  Button,
  Card,
  Code,
  Column,
  Dialog,
  Divider,
  Drawer,
  Form,
  Icon,
  Image,
  Input,
  Link,
  List,
  ListItem,
  Menu,
  MenuItem,
  Popover,
  Presence,
  Row,
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
  ThemeProvider,
  ToolTip,
  View,
} from '../index'
import type { DocumentationComponentExampleDefinition } from './documentation-component-example-data'
import { SnackExample } from './documentation-component-example-previews'
import { documentationSampleImage } from './documentation-example-fixtures'

export const documentationComponentExampleAdditions: Record<
  string,
  readonly DocumentationComponentExampleDefinition[]
> = {
  View: [
    {
      id: 'semantic-host',
      title: 'Semantic host',
      description:
        'View can add semantic and interaction behavior while remaining the same low-level layout host.',
      preview: (
        <View
          clickable
          label="Open details"
          background="surfaceHover"
          padding={1.5}
          radius="medium"
        >
          Clickable semantic surface
        </View>
      ),
      code: '<View\n  clickable\n  label="Open details"\n  background="surfaceHover"\n  padding={1.5}\n  radius="medium"\n>\n  Clickable semantic surface\n</View>',
    },
    {
      id: 'responsive-view',
      title: 'Responsive view',
      description:
        'Breakpoint props let the same View change layout values without creating a second responsive wrapper.',
      preview: (
        <View
          background="surfaceHover"
          padding={1}
          md={{ padding: 2 }}
          lg={{ padding: 3 }}
          radius="medium"
        >
          Resize the viewport
        </View>
      ),
      code: '<View\n  background="surfaceHover"\n  padding={1}\n  md={{ padding: 2 }}\n  lg={{ padding: 3 }}\n  radius="medium"\n>\n  Resize the viewport\n</View>',
    },
  ],
  Presence: [
    {
      id: 'toggle-presence',
      title: 'Toggle presence',
      description:
        'Presence keeps exiting content mounted long enough for its View exit motion to complete.',
      preview: (
        <Presence present>
          <Card viewProps={{ enter: { animation: 'fade-down' }, exit: { animation: 'fade-up' } }}>
            Animated content
          </Card>
        </Presence>
      ),
      codeMode: 'body',
      code: "const [visible, setVisible] = useState(true)\n\nreturn (\n  <Column gap={1}>\n    <Button\n      text={visible ? 'Hide' : 'Show'}\n      viewProps={{ onClick: () => setVisible((current) => !current) }}\n    />\n    <Presence present={visible}>\n      <Card viewProps={{ enter: { animation: 'fade-down' }, exit: { animation: 'fade-up' } }}>\n        Animated content\n      </Card>\n    </Presence>\n  </Column>\n)",
    },
    {
      id: 'presence-layout',
      title: 'Presence in layout',
      description:
        'Presence can reserve no extra wrapper semantics while its child participates in the surrounding layout.',
      preview: (
        <Row gap={1} align="center">
          <Card>Always present</Card>
          <Presence present>
            <Card viewProps={{ enter: { animation: 'fade-in' }, exit: { animation: 'fade-out' } }}>
              Conditional
            </Card>
          </Presence>
        </Row>
      ),
      code: "<Row gap={1} align=\"center\">\n  <Card>Always present</Card>\n  <Presence present>\n    <Card viewProps={{ enter: { animation: 'fade-in' }, exit: { animation: 'fade-out' } }}>\n      Conditional\n    </Card>\n  </Presence>\n</Row>",
    },
  ],
  Text: [
    {
      id: 'truncated-copy',
      title: 'Truncated copy',
      description:
        'Limit long content to a known number of lines when the surrounding layout must stay compact.',
      preview: (
        <Text maxLines={2} overflow="ellipsis" viewProps={{ width: 18 }}>
          A long description can stay readable without forcing every card in the same row to grow to
          the height of the longest piece of content.
        </Text>
      ),
      code: '<Text maxLines={2} overflow="ellipsis" viewProps={{ width: 18 }}>\n  A long description can stay readable without forcing every card in the same row\n  to grow to the height of the longest piece of content.\n</Text>',
    },
    {
      id: 'text-emphasis',
      title: 'Text emphasis',
      description:
        'Weight, decoration, case, and semantic colors can communicate emphasis without replacing Text.',
      preview: (
        <Column gap={0.5}>
          <Text bold color="primary">
            Primary emphasis
          </Text>
          <Text italic color="secondary">
            Secondary note
          </Text>
          <Text strikethrough color="disabled">
            Deprecated value
          </Text>
          <Text case="uppercase" typo="label-small">
            Metadata
          </Text>
        </Column>
      ),
      code: '<Column gap={0.5}>\n  <Text bold color="primary">Primary emphasis</Text>\n  <Text italic color="secondary">Secondary note</Text>\n  <Text strikethrough color="disabled">Deprecated value</Text>\n  <Text case="uppercase" typo="label-small">Metadata</Text>\n</Column>',
    },
  ],
  Code: [
    {
      id: 'tsx-snippet',
      title: 'TSX snippet',
      description:
        'Use TSX highlighting when documentation needs to show component composition rather than plain TypeScript.',
      preview: <Code language="tsx">{'<Button text="Save" variant="primary" />'}</Code>,
      code: '<Code language="tsx">\n  {\'<Button text="Save" variant="primary" />\'}\n</Code>',
    },
    {
      id: 'scrolling-code',
      title: 'Scrolling code',
      description:
        'Constrain long snippets with ordinary View sizing so only the code surface becomes scrollable.',
      preview: (
        <Code language="typescript" viewProps={{ maxHeight: 8, overflow: 'auto', width: 24 }}>
          {
            'const first = 1\nconst second = 2\nconst third = 3\nconst fourth = 4\nconst fifth = 5\nconst sixth = 6'
          }
        </Code>
      ),
      code: "<Code\n  language=\"typescript\"\n  viewProps={{ maxHeight: 8, overflow: 'auto', width: 24 }}\n>\n  {'const first = 1\\\\nconst second = 2\\\\nconst third = 3\\\\nconst fourth = 4\\\\nconst fifth = 5\\\\nconst sixth = 6'}\n</Code>",
    },
  ],
  Image: [
    {
      id: 'contained-image',
      title: 'Contained image',
      description:
        'contain keeps the complete source visible when the image should fit inside a fixed presentation box.',
      preview: (
        <Image
          src={documentationSampleImage}
          alt="Contained example landscape"
          fit="contain"
          viewProps={{ width: 20, height: 8, background: 'surfaceHover', radius: 'medium' }}
        />
      ),
      code: '<Image\n  src={imageUrl}\n  alt="Contained example landscape"\n  fit="contain"\n  viewProps={{ width: 20, height: 8, background: \'surfaceHover\', radius: \'medium\' }}\n/>',
    },
    {
      id: 'focal-position',
      title: 'Focal position',
      description:
        'Combine cover with position when a crop should preserve a particular area of the source.',
      preview: (
        <Image
          src={documentationSampleImage}
          alt="Top-aligned example landscape"
          fit="cover"
          position="top"
          loading="eager"
          viewProps={{ width: 16, height: 6, radius: 'medium' }}
        />
      ),
      code: '<Image\n  src={imageUrl}\n  alt="Top-aligned example landscape"\n  fit="cover"\n  position="top"\n  loading="eager"\n  viewProps={{ width: 16, height: 6, radius: \'medium\' }}\n/>',
    },
  ],
  Icon: [
    {
      id: 'stroke-emphasis',
      title: 'Stroke emphasis',
      description:
        'Stroke weight lets one icon source adapt to quieter metadata or stronger action affordances.',
      preview: (
        <Row gap={1.5} align="center">
          <Icon icon={IconSearch} stroke="thin" />
          <Icon icon={IconSearch} stroke="regular" />
          <Icon icon={IconSearch} stroke="bold" />
        </Row>
      ),
      code: '<Row gap={1.5} align="center">\n  <Icon icon={IconSearch} stroke="thin" />\n  <Icon icon={IconSearch} stroke="regular" />\n  <Icon icon={IconSearch} stroke="bold" />\n</Row>',
    },
    {
      id: 'semantic-icon-color',
      title: 'Semantic icon color',
      description:
        'Icons inherit View color so they can follow the same semantic color system as surrounding content.',
      preview: (
        <Row gap={1.5}>
          <Icon icon={IconStar} viewProps={{ color: 'primary' }} />
          <Icon icon={IconStar} viewProps={{ color: 'success' }} />
          <Icon icon={IconStar} viewProps={{ color: 'danger' }} />
        </Row>
      ),
      code: "<Row gap={1.5}>\n  <Icon icon={IconStar} viewProps={{ color: 'primary' }} />\n  <Icon icon={IconStar} viewProps={{ color: 'success' }} />\n  <Icon icon={IconStar} viewProps={{ color: 'danger' }} />\n</Row>",
    },
  ],
  Avatar: [
    {
      id: 'image-avatar',
      title: 'Image avatar',
      description:
        'Provide src when an entity has an image and retain name plus fallback for accessible and failure states.',
      preview: (
        <Avatar
          src={documentationSampleImage}
          name="Landscape account"
          fallback="LA"
          viewProps={{ width: 4, height: 4 }}
        />
      ),
      code: '<Avatar\n  src={imageUrl}\n  name="Landscape account"\n  fallback="LA"\n  viewProps={{ width: 4, height: 4 }}\n/>',
    },
    {
      id: 'avatar-status',
      title: 'Avatar status',
      description:
        'Compose Avatar with Badge when status belongs to the entity rather than the image itself.',
      preview: (
        <Badge dot placement="bottom-right" visible>
          <Avatar name="Online user" fallback="OU" />
        </Badge>
      ),
      code: '<Badge dot placement="bottom-right" visible>\n  <Avatar name="Online user" fallback="OU" />\n</Badge>',
    },
  ],
  Divider: [
    {
      id: 'vertical-divider',
      title: 'Vertical divider',
      description:
        'Vertical dividers separate adjacent actions without introducing another layout primitive.',
      preview: (
        <Row height={3} gap={1} align="center">
          <Text>Preview</Text>
          <Divider direction="vertical" />
          <Text>Publish</Text>
        </Row>
      ),
      code: '<Row height={3} gap={1} align="center">\n  <Text>Preview</Text>\n  <Divider direction="vertical" />\n  <Text>Publish</Text>\n</Row>',
    },
    {
      id: 'spaced-divider',
      title: 'Spaced divider',
      description:
        'Use gap when a divider should carry its own breathing room between content groups.',
      preview: (
        <Column width={20}>
          <Text>First section</Text>
          <Divider gap={1} size={2} />
          <Text>Second section</Text>
        </Column>
      ),
      code: '<Column width={20}>\n  <Text>First section</Text>\n  <Divider gap={1} size={2} />\n  <Text>Second section</Text>\n</Column>',
    },
  ],
  Link: [
    {
      id: 'quiet-link',
      title: 'Quiet link',
      description:
        'Hide the underline when the surrounding layout already makes the affordance obvious.',
      preview: <Link href="#details" text="View details" hideUnderline hideIcon />,
      code: '<Link href="#details" text="View details" hideUnderline hideIcon />',
    },
    {
      id: 'new-tab-link',
      title: 'New tab link',
      description:
        'target remains native anchor behavior, so links can opt into a new browsing context without custom routing.',
      preview: (
        <Link href="https://example.com" target="_blank" text="Open reference in a new tab" />
      ),
      code: '<Link\n  href="https://example.com"\n  target="_blank"\n  text="Open reference in a new tab"\n/>',
    },
  ],
  Badge: [
    {
      id: 'status-dot',
      title: 'Status dot',
      description: 'Dot badges communicate status without introducing another text label.',
      preview: (
        <Badge dot placement="bottom-right" visible>
          <Avatar name="Active account" fallback="AA" />
        </Badge>
      ),
      code: '<Badge dot placement="bottom-right" visible>\n  <Avatar name="Active account" fallback="AA" />\n</Badge>',
    },
    {
      id: 'badge-placement',
      title: 'Badge placement',
      description: 'Placement attaches the same badge content to the edge that best fits its host.',
      preview: (
        <Row gap={2}>
          <Badge text="1" placement="top-left" visible>
            <Button text="Top left" variant="secondary" />
          </Badge>
          <Badge text="8" placement="bottom-right" visible>
            <Button text="Bottom right" variant="secondary" />
          </Badge>
        </Row>
      ),
      code: '<Row gap={2}>\n  <Badge text="1" placement="top-left" visible>\n    <Button text="Top left" variant="secondary" />\n  </Badge>\n  <Badge text="8" placement="bottom-right" visible>\n    <Button text="Bottom right" variant="secondary" />\n  </Badge>\n</Row>',
    },
  ],
  Card: [
    {
      id: 'clickable-card',
      title: 'Clickable card',
      description:
        'Clickable cards keep the whole surface interactive when the content represents one action.',
      preview: (
        <Card clickable viewProps={{ width: 20, padding: 1.5, label: 'Open project Atlas' }}>
          <Column gap={0.5}>
            <Text typo="title-medium">Open project</Text>
            <Text color="secondary">The whole surface is clickable.</Text>
          </Column>
        </Card>
      ),
      code: '<Card\n  clickable\n  viewProps={{ width: 20, padding: 1.5, label: \'Open project Atlas\' }}\n>\n  <Column gap={0.5}>\n    <Text typo="title-medium">Open project</Text>\n    <Text color="secondary">The whole surface is clickable.</Text>\n  </Column>\n</Card>',
    },
    {
      id: 'selectable-card',
      title: 'Selectable card',
      description:
        'Selectable cards expose a persistent selection state for pickers and choice grids.',
      preview: (
        <Row gap={1}>
          <Card selectable defaultSelected viewProps={{ width: 10, padding: 1.5 }}>
            <Text>Selected</Text>
          </Card>
          <Card selectable viewProps={{ width: 10, padding: 1.5 }}>
            <Text>Available</Text>
          </Card>
        </Row>
      ),
      code: '<Row gap={1}>\n  <Card selectable defaultSelected viewProps={{ width: 10, padding: 1.5 }}>\n    <Text>Selected</Text>\n  </Card>\n  <Card selectable viewProps={{ width: 10, padding: 1.5 }}>\n    <Text>Available</Text>\n  </Card>\n</Row>',
    },
  ],
  AppBar: [
    {
      id: 'centered-title',
      title: 'Centered title',
      description:
        'Center the title when leading and trailing actions should frame a single page identity.',
      preview: (
        <AppBar
          leading={<Button icon={IconDots} viewProps={{ label: 'Back' }} />}
          title={<Text>Profile</Text>}
          trailing={<Button icon={IconStar} viewProps={{ label: 'Favorite' }} />}
          titleAlign="center"
        />
      ),
      code: "<AppBar\n  leading={<Button icon={IconDots} viewProps={{ label: 'Back' }} />}\n  title={<Text>Profile</Text>}\n  trailing={<Button icon={IconStar} viewProps={{ label: 'Favorite' }} />}\n  titleAlign=\"center\"\n/>",
    },
    {
      id: 'floating-app-bar',
      title: 'Floating app bar',
      description:
        'Floating mode and elevation create a detached navigation surface when the bar should sit over page content.',
      preview: (
        <AppBar
          title={<Text>Floating</Text>}
          trailing={<Button icon={IconSearch} viewProps={{ label: 'Search' }} />}
          mode="floating"
          elevated
          size="small"
        />
      ),
      code: '<AppBar\n  title={<Text>Floating</Text>}\n  trailing={<Button icon={IconSearch} viewProps={{ label: \'Search\' }} />}\n  mode="floating"\n  elevated\n  size="small"\n/>',
    },
  ],
  Form: [
    {
      id: 'submit-and-reset',
      title: 'Submit and reset',
      description:
        'Form keeps native submit and reset events while Weave components provide the visible fields and actions.',
      preview: (
        <Form>
          <Column gap={1}>
            <Input placeholder="Project name" />
            <Row gap={1}>
              <Button type="submit" text="Save" />
              <Button type="reset" text="Reset" variant="secondary" />
            </Row>
          </Column>
        </Form>
      ),
      codeMode: 'body',
      code: 'const [status, setStatus] = useState(\'Waiting\')\n\nreturn (\n  <Form\n    onSubmit={(event) => {\n      event.preventDefault()\n      setStatus(\'Submitted\')\n    }}\n    onReset={() => setStatus(\'Reset\')}\n  >\n    <Column gap={1}>\n      <Input placeholder="Project name" required />\n      <Row gap={1}>\n        <Button type="submit" text="Save" />\n        <Button type="reset" text="Reset" variant="secondary" />\n      </Row>\n      <Text typo="body-small">{status}</Text>\n    </Column>\n  </Form>\n)',
    },
    {
      id: 'native-validation',
      title: 'Native validation',
      description:
        'Required and pattern constraints stay on the native input elements inside the semantic Form root.',
      preview: (
        <Form>
          <Column gap={1}>
            <Input name="email" type="email" placeholder="Email" required />
            <Button type="submit" text="Continue" />
          </Column>
        </Form>
      ),
      code: '<Form>\n  <Column gap={1}>\n    <Input name="email" type="email" placeholder="Email" required />\n    <Button type="submit" text="Continue" />\n  </Column>\n</Form>',
    },
  ],
  Table: [
    {
      id: 'dense-table',
      title: 'Dense data table',
      description:
        'Dense rows and vertical borders fit data-heavy surfaces while preserving the same semantic table structure.',
      preview: (
        <Table dense verticalBorders>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead align="end">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow id="one">
              <TableCell id="name">Atlas</TableCell>
              <TableCell id="score" align="end">
                92
              </TableCell>
            </TableRow>
            <TableRow id="two">
              <TableCell id="name">Borealis</TableCell>
              <TableCell id="score" align="end">
                84
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: '<Table dense verticalBorders>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Name</TableHead>\n      <TableHead align="end">Score</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow id="one">\n      <TableCell id="name">Atlas</TableCell>\n      <TableCell id="score" align="end">92</TableCell>\n    </TableRow>\n    <TableRow id="two">\n      <TableCell id="name">Borealis</TableCell>\n      <TableCell id="score" align="end">84</TableCell>\n    </TableRow>\n  </TableBody>\n</Table>',
    },
    {
      id: 'selectable-cells',
      title: 'Selectable cells',
      description:
        'Selectable tables track explicit row and cell identifiers instead of coupling selection to visual position.',
      preview: (
        <Table selectable defaultSelected={[{ rowId: 'alpha', cellId: 'value' }]}>
          <TableBody>
            <TableRow id="alpha">
              <TableCell id="name">Alpha</TableCell>
              <TableCell id="value">42</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      code: '<Table\n  selectable\n  defaultSelected={[{ rowId: \'alpha\', cellId: \'value\' }]}\n>\n  <TableBody>\n    <TableRow id="alpha">\n      <TableCell id="name">Alpha</TableCell>\n      <TableCell id="value">42</TableCell>\n    </TableRow>\n  </TableBody>\n</Table>',
    },
  ],
  Accordion: [
    {
      id: 'multiple-panels',
      title: 'Multiple panels',
      description:
        'multiple lets more than one disclosure stay open when sections are independent.',
      preview: (
        <Accordion multiple defaultValue={['first', 'second']}>
          <AccordionItem value="first">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionPanel>General settings</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="second">
            <AccordionTrigger>Advanced</AccordionTrigger>
            <AccordionPanel>Advanced settings</AccordionPanel>
          </AccordionItem>
        </Accordion>
      ),
      code: '<Accordion multiple defaultValue={[\'first\', \'second\']}>\n  <AccordionItem value="first">\n    <AccordionTrigger>General</AccordionTrigger>\n    <AccordionPanel>General settings</AccordionPanel>\n  </AccordionItem>\n  <AccordionItem value="second">\n    <AccordionTrigger>Advanced</AccordionTrigger>\n    <AccordionPanel>Advanced settings</AccordionPanel>\n  </AccordionItem>\n</Accordion>',
    },
    {
      id: 'dividerless-accordion',
      title: 'Dividerless accordion',
      description:
        'Remove dividers when disclosure items already live inside another clearly bounded surface.',
      preview: (
        <Card>
          <Accordion noDividers defaultValue="summary">
            <AccordionItem value="summary">
              <AccordionTrigger>Summary</AccordionTrigger>
              <AccordionPanel>Compact panel content</AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Card>
      ),
      code: '<Card>\n  <Accordion noDividers defaultValue="summary">\n    <AccordionItem value="summary">\n      <AccordionTrigger>Summary</AccordionTrigger>\n      <AccordionPanel>Compact panel content</AccordionPanel>\n    </AccordionItem>\n  </Accordion>\n</Card>',
    },
  ],
  ToolTip: [
    {
      id: 'icon-button-tooltip',
      title: 'Icon button tooltip',
      description:
        'Tooltips are useful when an icon-only action needs a visible description on hover or focus.',
      preview: (
        <ToolTip content="Search" placement="top" delay={0}>
          <Button icon={IconSearch} viewProps={{ label: 'Search' }} />
        </ToolTip>
      ),
      code: '<ToolTip content="Search" placement="top" delay={0}>\n  <Button icon={IconSearch} viewProps={{ label: \'Search\' }} />\n</ToolTip>',
    },
    {
      id: 'tooltip-placement',
      title: 'Tooltip placement',
      description:
        'Placement and offset keep help text attached to the trigger edge that fits the surrounding layout.',
      preview: (
        <ToolTip content="Saved items" placement="right" offset={1} delay={0} defaultOpen>
          <Button icon={IconStar} viewProps={{ label: 'Saved items' }} />
        </ToolTip>
      ),
      code: '<ToolTip\n  content="Saved items"\n  placement="right"\n  offset={1}\n  delay={0}\n  defaultOpen\n>\n  <Button icon={IconStar} viewProps={{ label: \'Saved items\' }} />\n</ToolTip>',
    },
  ],
  Popover: [
    {
      id: 'contextual-actions',
      title: 'Contextual actions',
      description:
        'Popover can host a small action surface without promoting those controls into a modal flow.',
      preview: (
        <Popover
          content={
            <Card>
              <Column gap={0.5}>
                <Button text="Rename" variant="ghost" />
                <Button text="Archive" variant="ghost" />
              </Column>
            </Card>
          }
          placement="bottom-right"
        >
          <Button icon={IconDots} viewProps={{ label: 'More actions' }} />
        </Popover>
      ),
      code: '<Popover\n  content={\n    <Card>\n      <Column gap={0.5}>\n        <Button text="Rename" variant="ghost" />\n        <Button text="Archive" variant="ghost" />\n      </Column>\n    </Card>\n  }\n  placement="bottom-right"\n>\n  <Button icon={IconDots} viewProps={{ label: \'More actions\' }} />\n</Popover>',
    },
    {
      id: 'focused-popover',
      title: 'Focused popover',
      description:
        'autoFocus moves focus into an interactive popover when its content should immediately accept keyboard input.',
      preview: (
        <Popover
          content={<Input placeholder="Filter items" />}
          placement="bottom"
          autoFocus
          restoreFocus
        >
          <Button text="Open filter" />
        </Popover>
      ),
      code: '<Popover\n  content={<Input placeholder="Filter items" />}\n  placement="bottom"\n  autoFocus\n  restoreFocus\n>\n  <Button text="Open filter" />\n</Popover>',
    },
  ],
  Dialog: [
    {
      id: 'modal-dialog',
      title: 'Modal dialog',
      description:
        'Modal Dialog uses the native top layer while the surrounding application owns the open state.',
      preview: (
        <Dialog modal open={false}>
          <Card>Modal content</Card>
        </Dialog>
      ),
      codeMode: 'body',
      code: 'const [open, setOpen] = useState(false)\n\nreturn (\n  <Column gap={1} align="start">\n    <Button text="Open dialog" viewProps={{ onClick: () => setOpen(true) }} />\n    <Dialog modal open={open} onOpenChange={setOpen} closeOnBackdrop>\n      <Card viewProps={{ padding: 2 }}>\n        <Column gap={1}>\n          <Text typo="title-medium">Delete project?</Text>\n          <Button text="Close" viewProps={{ onClick: () => setOpen(false) }} />\n        </Column>\n      </Card>\n    </Dialog>\n  </Column>\n)',
    },
    {
      id: 'non-modal-dialog',
      title: 'Non-modal dialog',
      description:
        'Non-modal Dialog reuses anchored Popover behavior for lightweight contextual surfaces.',
      preview: (
        <Dialog
          modal={false}
          trigger={<Button text="Open details" />}
          placement="right"
          restoreFocus
        >
          <Card>Anchored details</Card>
        </Dialog>
      ),
      code: '<Dialog\n  modal={false}\n  trigger={<Button text="Open details" />}\n  placement="right"\n  restoreFocus\n>\n  <Card>Anchored details</Card>\n</Dialog>',
    },
  ],
  Drawer: [
    {
      id: 'right-drawer',
      title: 'Right-side drawer',
      description:
        'The same drawer model can place auxiliary content on the opposite side without changing the content tree.',
      preview: (
        <Drawer
          side="right"
          mode="non-modal"
          defaultSize={8}
          defaultOpen
          drawer={<Column padding={1}>Inspector</Column>}
          viewProps={{ width: 'fill', height: 10 }}
        >
          <Column padding={1}>Canvas</Column>
        </Drawer>
      ),
      code: '<Drawer\n  side="right"\n  mode="non-modal"\n  defaultSize={8}\n  defaultOpen\n  drawer={<Column padding={1}>Inspector</Column>}\n  viewProps={{ width: \'fill\', height: 10 }}\n>\n  <Column padding={1}>Canvas</Column>\n</Drawer>',
    },
    {
      id: 'closed-drawer',
      title: 'Closed drawer',
      description: 'A drawer can start closed while the main content keeps the same layout host.',
      preview: (
        <Drawer
          side="left"
          mode="non-modal"
          defaultOpen={false}
          drawer={<Column padding={1}>Navigation</Column>}
          viewProps={{ width: 'fill', height: 8 }}
        >
          <Column padding={1}>Main content</Column>
        </Drawer>
      ),
      code: '<Drawer\n  side="left"\n  mode="non-modal"\n  defaultOpen={false}\n  drawer={<Column padding={1}>Navigation</Column>}\n  viewProps={{ width: \'fill\', height: 8 }}\n>\n  <Column padding={1}>Main content</Column>\n</Drawer>',
    },
  ],
  Menu: [
    {
      id: 'menu-item-states',
      title: 'Menu item states',
      description:
        'Menu items can communicate secondary information, unavailable commands, and destructive actions.',
      preview: (
        <Menu trigger={<Button text="File actions" />} defaultOpen>
          <MenuItem text="Duplicate" secondaryText="⌘D" />
          <MenuItem text="Move" disabled />
          <MenuItem text="Delete" danger />
        </Menu>
      ),
      code: '<Menu trigger={<Button text="File actions" />} defaultOpen>\n  <MenuItem text="Duplicate" secondaryText="⌘D" />\n  <MenuItem text="Move" disabled />\n  <MenuItem text="Delete" danger />\n</Menu>',
    },
    {
      id: 'menu-with-icons',
      title: 'Menu with icons',
      description:
        'Icons can reinforce command identity while text remains the primary accessible label.',
      preview: (
        <Menu trigger={<Button text="Commands" />}>
          <MenuItem text="Search" icon={IconSearch} />
          <MenuItem text="Favorite" icon={IconStar} />
        </Menu>
      ),
      code: '<Menu trigger={<Button text="Commands" />}>\n  <MenuItem text="Search" icon={IconSearch} />\n  <MenuItem text="Favorite" icon={IconStar} />\n</Menu>',
    },
  ],
  Tabs: [
    {
      id: 'vertical-tabs',
      title: 'Vertical tabs',
      description:
        'Vertical orientation works for settings and inspector layouts where labels need more horizontal space.',
      preview: (
        <Tabs defaultValue="general" orientation="vertical">
          <TabList>
            <Tab value="general">General</Tab>
            <Tab value="privacy">Privacy</Tab>
          </TabList>
          <TabPanel value="general">General settings</TabPanel>
          <TabPanel value="privacy">Privacy settings</TabPanel>
        </Tabs>
      ),
      code: '<Tabs defaultValue="general" orientation="vertical">\n  <TabList>\n    <Tab value="general">General</Tab>\n    <Tab value="privacy">Privacy</Tab>\n  </TabList>\n  <TabPanel value="general">General settings</TabPanel>\n  <TabPanel value="privacy">Privacy settings</TabPanel>\n</Tabs>',
    },
    {
      id: 'manual-activation',
      title: 'Manual activation',
      description:
        'Manual activation separates keyboard focus from selection when switching panels is expensive.',
      preview: (
        <Tabs defaultValue="preview" activation="manual">
          <TabList>
            <Tab value="preview">Preview</Tab>
            <Tab value="source">Source</Tab>
          </TabList>
          <TabPanel value="preview">Preview panel</TabPanel>
          <TabPanel value="source">Source panel</TabPanel>
        </Tabs>
      ),
      code: '<Tabs defaultValue="preview" activation="manual">\n  <TabList>\n    <Tab value="preview">Preview</Tab>\n    <Tab value="source">Source</Tab>\n  </TabList>\n  <TabPanel value="preview">Preview panel</TabPanel>\n  <TabPanel value="source">Source panel</TabPanel>\n</Tabs>',
    },
  ],
  Snack: [
    {
      id: 'snack-action',
      title: 'Snack action',
      description:
        'A Snack can expose one immediate action alongside the status message without becoming a dialog.',
      preview: <SnackExample />,
      codeMode: 'body',
      code: 'const hostRef = useRef(null)\n\nreturn (\n  <Column ref={hostRef} minHeight={8}>\n    <SnackProvider container={hostRef}>\n      <Snack\n        text="Item archived"\n        action="Undo"\n        onAction={() => {}}\n        persistent\n        placement="bottom-center"\n        defaultOpen\n      />\n    </SnackProvider>\n  </Column>\n)',
    },
    {
      id: 'snack-variant',
      title: 'Status variant',
      description:
        'Semantic variants let transient messages communicate success, warning, or failure consistently.',
      preview: <SnackExample />,
      codeMode: 'body',
      code: 'const hostRef = useRef(null)\n\nreturn (\n  <Column ref={hostRef} minHeight={8}>\n    <SnackProvider container={hostRef}>\n      <Snack\n        text="Could not save changes"\n        variant="danger"\n        persistent\n        placement="bottom-center"\n        defaultOpen\n      />\n    </SnackProvider>\n  </Column>\n)',
    },
  ],
  List: [
    {
      id: 'single-selection',
      title: 'Single selection',
      description: 'Single selection makes a list suitable for navigation or one-of-many pickers.',
      preview: (
        <List orientation="vertical" selection="single" defaultSelected="inbox">
          <ListItem id="inbox">Inbox</ListItem>
          <ListItem id="drafts">Drafts</ListItem>
          <ListItem id="archive">Archive</ListItem>
        </List>
      ),
      code: '<List orientation="vertical" selection="single" defaultSelected="inbox">\n  <ListItem id="inbox">Inbox</ListItem>\n  <ListItem id="drafts">Drafts</ListItem>\n  <ListItem id="archive">Archive</ListItem>\n</List>',
    },
    {
      id: 'data-driven-list',
      title: 'Data-driven list',
      description:
        'items renders the same List model from data when the application already owns a collection.',
      preview: (
        <List
          selection="multiple"
          defaultSelected={['alpha']}
          items={[
            { id: 'alpha', text: 'Alpha', secondaryText: 'Ready' },
            { id: 'beta', text: 'Beta', secondaryText: 'Queued' },
            { id: 'gamma', text: 'Gamma', disabled: true },
          ]}
        />
      ),
      code: "<List\n  selection=\"multiple\"\n  defaultSelected={['alpha']}\n  items={[\n    { id: 'alpha', text: 'Alpha', secondaryText: 'Ready' },\n    { id: 'beta', text: 'Beta', secondaryText: 'Queued' },\n    { id: 'gamma', text: 'Gamma', disabled: true },\n  ]}\n/>",
    },
  ],
  ThemeProvider: [
    {
      id: 'scoped-color-mode',
      title: 'Scoped color mode',
      description:
        'A nested provider can force a color mode for one subtree without changing the surrounding application.',
      preview: (
        <Row gap={1}>
          <ThemeProvider mode="light">
            <Card viewProps={{ padding: 1.5 }}>Light scope</Card>
          </ThemeProvider>
          <ThemeProvider mode="dark">
            <Card viewProps={{ padding: 1.5 }}>Dark scope</Card>
          </ThemeProvider>
        </Row>
      ),
      code: '<Row gap={1}>\n  <ThemeProvider mode="light">\n    <Card viewProps={{ padding: 1.5 }}>Light scope</Card>\n  </ThemeProvider>\n  <ThemeProvider mode="dark">\n    <Card viewProps={{ padding: 1.5 }}>Dark scope</Card>\n  </ThemeProvider>\n</Row>',
    },
    {
      id: 'reduced-motion-scope',
      title: 'Reduced motion scope',
      description:
        'Reduced-motion preference can be scoped for previews, accessibility testing, or motion-sensitive regions.',
      preview: (
        <ThemeProvider reducedMotion="reduce">
          <Card viewProps={{ enter: { animation: 'fade-in' } }}>Reduced-motion subtree</Card>
        </ThemeProvider>
      ),
      code: '<ThemeProvider reducedMotion="reduce">\n  <Card enter={{ animation: \'fade-in\' }}>\n    Reduced-motion subtree\n  </Card>\n</ThemeProvider>',
    },
  ],
}
