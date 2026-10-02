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
  SnackProvider,
  ToolTip,
} from '../index'
import type { DocumentationComponentDefinition } from './documentation-component-playground-data'
import {
  booleanControl,
  booleanValue,
  drawerModeOptions,
  drawerSideOptions,
  listOrientationOptions,
  listSelectionOptions,
  numberControl,
  numberValue,
  optionValue,
  placementOptions,
  selectControl,
  snackPlacementOptions,
  snackVariantOptions,
  tabsActivationOptions,
  tabsOrientationOptions,
  tabsVariantOptions,
  textControl,
  textValue,
  tooltipPlacementOptions,
} from './documentation-component-playground-data'
import {
  SampleAccordion,
  SampleTable,
  SampleTabs,
  SnackPreview,
  SnackProviderTrigger,
} from './documentation-component-playground-previews'

export const compositeComponentDefinitions: Record<string, DocumentationComponentDefinition> = {
  Form: {
    description:
      'A semantic form root that preserves native submit/reset behavior while using Weave layout.',
    controls: [textControl('children')],
    defaults: { children: 'Form content' },
    render: (values) => <Form>{textValue(values, 'children')}</Form>,
  },
  Table: {
    description:
      'A structured table surface with density, borders, sticky header, and optional cell selection.',
    controls: [
      booleanControl('dense'),
      booleanControl('verticalBorders'),
      booleanControl('stickyHeader'),
      booleanControl('selectable'),
    ],
    defaults: { dense: false, verticalBorders: false, stickyHeader: false, selectable: false },
    render: (values) => (
      <SampleTable
        dense={booleanValue(values, 'dense')}
        verticalBorders={booleanValue(values, 'verticalBorders')}
        stickyHeader={booleanValue(values, 'stickyHeader')}
        selectable={booleanValue(values, 'selectable')}
      />
    ),
  },
  Accordion: {
    description:
      'A single- or multi-open disclosure group with shared item, trigger, and panel semantics.',
    controls: [
      booleanControl('multiple'),
      booleanControl('collapsible'),
      booleanControl('disabled'),
      booleanControl('noDividers'),
    ],
    defaults: { multiple: false, collapsible: true, disabled: false, noDividers: false },
    render: (values) => (
      <SampleAccordion
        multiple={booleanValue(values, 'multiple')}
        collapsible={booleanValue(values, 'collapsible')}
        disabled={booleanValue(values, 'disabled')}
        noDividers={booleanValue(values, 'noDividers')}
      />
    ),
  },
  ToolTip: {
    description: 'A delayed, positioned tooltip attached to a single trigger element.',
    controls: [
      textControl('content'),
      selectControl('placement', tooltipPlacementOptions),
      numberControl('delay'),
      numberControl('offset'),
    ],
    defaults: { content: 'Helpful tooltip', placement: 'top', delay: 0, offset: 0.5 },
    render: (values) => (
      <ToolTip
        content={textValue(values, 'content')}
        placement={optionValue(values, 'placement', tooltipPlacementOptions)}
        delay={numberValue(values, 'delay')}
        offset={numberValue(values, 'offset')}
        defaultOpen
      >
        <Button text="Tooltip target" />
      </ToolTip>
    ),
  },
  Popover: {
    description:
      'A positioned non-modal surface anchored to a trigger with focus and placement controls.',
    controls: [
      textControl('content'),
      selectControl('placement', placementOptions),
      numberControl('offset'),
      booleanControl('autoFocus'),
      booleanControl('restoreFocus'),
    ],
    defaults: {
      content: 'Popover content',
      placement: 'bottom',
      offset: 0.5,
      autoFocus: false,
      restoreFocus: true,
    },
    render: (values) => (
      <Popover
        content={<Card>{textValue(values, 'content')}</Card>}
        placement={optionValue(values, 'placement', placementOptions)}
        offset={numberValue(values, 'offset')}
        autoFocus={booleanValue(values, 'autoFocus')}
        restoreFocus={booleanValue(values, 'restoreFocus')}
        defaultOpen
      >
        <Button text="Popover target" />
      </Popover>
    ),
  },
  Dialog: {
    description:
      'A dialog surface that supports non-modal anchored and native modal top-layer modes.',
    controls: [
      selectControl('placement', placementOptions),
      numberControl('offset'),
      booleanControl('autoFocus'),
      booleanControl('restoreFocus'),
    ],
    defaults: { placement: 'bottom', offset: 0.5, autoFocus: false, restoreFocus: true },
    render: (values) => (
      <Dialog
        modal={false}
        trigger={<Button text="Dialog trigger" />}
        placement={optionValue(values, 'placement', placementOptions)}
        offset={numberValue(values, 'offset')}
        autoFocus={booleanValue(values, 'autoFocus')}
        restoreFocus={booleanValue(values, 'restoreFocus')}
        defaultOpen
      >
        <Card>Dialog content</Card>
      </Dialog>
    ),
  },
  Drawer: {
    description:
      'A side surface that reuses modal Dialog on narrow layouts and SplitBox for non-modal layouts.',
    controls: [
      selectControl('side', drawerSideOptions),
      selectControl('mode', drawerModeOptions),
      numberControl('defaultSize'),
      booleanControl('resizable'),
    ],
    defaults: { side: 'left', mode: 'non-modal', defaultSize: 8, resizable: true },
    render: (values) => (
      <Drawer
        side={optionValue(values, 'side', drawerSideOptions)}
        mode={optionValue(values, 'mode', drawerModeOptions)}
        defaultSize={numberValue(values, 'defaultSize')}
        resizable={booleanValue(values, 'resizable')}
        defaultOpen
        drawer={<Column padding={1}>Drawer surface</Column>}
        viewProps={{ width: 'fill', height: 12 }}
      >
        <Column padding={1}>Drawer content</Column>
      </Drawer>
    ),
  },
  Menu: {
    description:
      'A trigger-anchored command menu with keyboard focus, placement, and selection dismissal.',
    controls: [
      selectControl('placement', placementOptions),
      numberControl('offset'),
      booleanControl('overlapTrigger'),
      booleanControl('closeOnSelect'),
    ],
    defaults: { placement: 'bottom-left', offset: 0.5, overlapTrigger: false, closeOnSelect: true },
    render: (values) => (
      <Menu
        trigger={<Button text="Menu trigger" />}
        placement={optionValue(values, 'placement', placementOptions)}
        offset={numberValue(values, 'offset')}
        overlapTrigger={booleanValue(values, 'overlapTrigger')}
        closeOnSelect={booleanValue(values, 'closeOnSelect')}
        defaultOpen
      >
        <MenuItem text="First action" />
        <MenuItem text="Second action" />
      </Menu>
    ),
  },
  Tabs: {
    description:
      'Coordinates TabList, Tab, and TabPanel with orientation, activation, and indicator variants.',
    controls: [
      selectControl('orientation', tabsOrientationOptions),
      selectControl('activation', tabsActivationOptions),
      selectControl('variant', tabsVariantOptions),
      numberControl('indicatorThickness'),
    ],
    defaults: {
      orientation: 'horizontal',
      activation: 'automatic',
      variant: 'underline',
      indicatorThickness: 2,
    },
    render: (values) => (
      <SampleTabs
        orientation={optionValue(values, 'orientation', tabsOrientationOptions)}
        activation={optionValue(values, 'activation', tabsActivationOptions)}
        variant={optionValue(values, 'variant', tabsVariantOptions)}
        indicatorThickness={numberValue(values, 'indicatorThickness')}
      />
    ),
  },
  Snack: {
    description:
      'A transient status or alert message with lifetime, progress, placement, and semantic variants.',
    controls: [
      textControl('text'),
      selectControl('variant', snackVariantOptions),
      numberControl('duration'),
      booleanControl('persistent'),
      booleanControl('progress'),
      selectControl('placement', snackPlacementOptions),
    ],
    defaults: {
      text: 'Saved successfully',
      variant: 'success',
      duration: 4000,
      persistent: true,
      progress: false,
      placement: 'bottom-center',
    },
    render: (values) => <SnackPreview values={values} />,
  },
  SnackProvider: {
    description:
      'Provides the queued Snack controller and an optional local portal container to descendants.',
    controls: [textControl('children')],
    defaults: { children: 'Show provider snack' },
    render: (values) => (
      <SnackProvider>
        <SnackProviderTrigger label={textValue(values, 'children')} />
      </SnackProvider>
    ),
  },
  List: {
    description:
      'A vertical or horizontal item collection with optional selection and virtualization semantics.',
    controls: [
      selectControl('orientation', listOrientationOptions),
      numberControl('gap'),
      booleanControl('noDividers'),
      booleanControl('singleLine'),
      booleanControl('disabled'),
      selectControl('selection', listSelectionOptions),
    ],
    defaults: {
      orientation: 'vertical',
      gap: 0,
      noDividers: false,
      singleLine: false,
      disabled: false,
      selection: 'none',
    },
    render: (values) => {
      const content = (
        <>
          <ListItem id="one">First item</ListItem>
          <ListItem id="two">Second item</ListItem>
          <ListItem id="three">Third item</ListItem>
        </>
      )
      const shared = {
        orientation: optionValue(values, 'orientation', listOrientationOptions),
        gap: numberValue(values, 'gap'),
        noDividers: booleanValue(values, 'noDividers'),
        singleLine: booleanValue(values, 'singleLine'),
        disabled: booleanValue(values, 'disabled'),
      }
      const selection = optionValue(values, 'selection', listSelectionOptions)

      if (selection === 'single') {
        return (
          <List {...shared} selection="single" defaultSelected="one">
            {content}
          </List>
        )
      }
      if (selection === 'multiple') {
        return (
          <List {...shared} selection="multiple" defaultSelected={['one']}>
            {content}
          </List>
        )
      }
      return (
        <List {...shared} selection="none">
          {content}
        </List>
      )
    },
  },
}
