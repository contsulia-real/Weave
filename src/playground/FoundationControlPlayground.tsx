import { IconMinus, IconPlus, IconSearch, IconSettings, IconUser } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
  Column,
  Combobox,
  ComboboxOption,
  Dialog,
  Divider,
  Drawer,
  DrawerHandle,
  Menu,
  MenuItem,
  Popover,
  Row,
  Select,
  SelectOption,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from '../index'
import { PlaygroundSection } from './PlaygroundSection'

const popoverPlacements = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
] as const

function PopoverPlayground() {
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <Column gap={1.25} align="start">
      <Column gap={0.75} align="start">
        <Text typo="label-medium" color="secondary">
          Eight placements · click to toggle
        </Text>

        <Row gap={0.75} wrap>
          {popoverPlacements.map((placement) => (
            <Popover
              key={placement}
              placement={placement}
              content={
                <Column gap={0.5} width={13}>
                  <Text typo="label-medium">{placement}</Text>
                  <Text typo="body-small" color="secondary">
                    Interactive content stays clickable. Escape or outside pointer input closes the
                    popover.
                  </Text>
                  <Button text="Popover action" size="small" variant="secondary" />
                </Column>
              }
            >
              <Button text={placement} variant="secondary" />
            </Popover>
          ))}
        </Row>
      </Column>

      <Column gap={0.75} align="start">
        <Text typo="label-medium" color="secondary">
          Controlled
        </Text>

        <Row gap={0.75} align="center" wrap>
          <Popover
            open={controlledOpen}
            onOpenChange={setControlledOpen}
            placement="bottom-left"
            content={
              <Column gap={0.5} width={14}>
                <Text typo="label-medium">Controlled popover</Text>
                <Text typo="body-small" color="secondary">
                  open / onOpenChange are owned by the playground state.
                </Text>
                <Button
                  text="Close from content"
                  size="small"
                  variant="secondary"
                  viewProps={{
                    onClick: () => setControlledOpen(false),
                  }}
                />
              </Column>
            }
          >
            <Button
              text={controlledOpen ? 'Controlled · open' : 'Controlled · closed'}
              variant="primary"
            />
          </Popover>

          <Text typo="body-small" color="secondary">
            state: {controlledOpen ? 'open' : 'closed'}
          </Text>
        </Row>
      </Column>
    </Column>
  )
}

function AccordionPlayground() {
  return (
    <Column gap={1.5}>
      <Column gap={0.5}>
        <Text typo="label-medium" color="secondary">
          Single · fully collapsible by default
        </Text>
        <Accordion
          defaultValue="account"
          viewProps={{ width: 30, data: { testid: 'accordion-default' } }}
        >
          <AccordionItem value="account">
            <AccordionTrigger>Account</AccordionTrigger>
            <AccordionPanel>
              <Text typo="body-small" color="secondary">
                Account details can be collapsed without opening another item.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionTrigger>Security</AccordionTrigger>
            <AccordionPanel>
              <Text typo="body-small" color="secondary">
                Security settings panel.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="disabled" disabled>
            <AccordionTrigger>Disabled item</AccordionTrigger>
            <AccordionPanel>
              <Text typo="body-small">Disabled panel.</Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Column>

      <Column gap={0.5}>
        <Text typo="label-medium" color="secondary">
          Multiple · custom expand / collapse icons
        </Text>
        <Accordion
          multiple
          defaultValue={['one']}
          viewProps={{ width: 30, data: { testid: 'accordion-multiple' } }}
        >
          <AccordionItem value="one">
            <AccordionTrigger expandIcon={IconPlus} collapseIcon={IconMinus}>
              First section
            </AccordionTrigger>
            <AccordionPanel>
              <Text typo="body-small" color="secondary">
                Multiple mode allows independent open items.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger expandIcon={IconPlus} collapseIcon={IconMinus}>
              Second section
            </AccordionTrigger>
            <AccordionPanel>
              <Text typo="body-small" color="secondary">
                Each section can be closed independently.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Column>

      <Column gap={0.5}>
        <Text typo="label-medium" color="secondary">
          Single · initially collapsed
        </Text>
        <Accordion
          defaultValue={null}
          viewProps={{ width: 30, data: { testid: 'accordion-collapsible' } }}
        >
          <AccordionItem value="optional">
            <AccordionTrigger>Optional details</AccordionTrigger>
            <AccordionPanel>
              <Text typo="body-small" color="secondary">
                This item can return to the fully collapsed state.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Column>
    </Column>
  )
}

function TabsPlayground() {
  const [value, setValue] = useState('general')

  return (
    <Column gap={1.5}>
      <Column gap={0.75}>
        <Text typo="label-medium" color="secondary">
          Underline · automatic activation
        </Text>
        <Tabs value={value} onValueChange={setValue} indicatorThickness={3}>
          <TabList>
            <Tab value="general">General</Tab>
            <Tab value="appearance">Appearance</Tab>
            <Tab value="advanced" disabled>
              Advanced
            </Tab>
          </TabList>
          <TabPanel value="general">
            <Text typo="body-small">General settings panel.</Text>
          </TabPanel>
          <TabPanel value="appearance">
            <Text typo="body-small">Appearance settings panel.</Text>
          </TabPanel>
          <TabPanel value="advanced">
            <Text typo="body-small">Advanced settings panel.</Text>
          </TabPanel>
        </Tabs>
      </Column>

      <Column gap={0.75}>
        <Text typo="label-medium" color="secondary">
          Pill · manual activation
        </Text>
        <Tabs variant="pill" activation="manual" defaultValue="overview">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="activity">Activity</Tab>
            <Tab value="billing">Billing</Tab>
          </TabList>
          <TabPanel value="overview">
            <Text typo="body-small">Overview panel.</Text>
          </TabPanel>
          <TabPanel value="activity">
            <Text typo="body-small">Activity panel.</Text>
          </TabPanel>
          <TabPanel value="billing">
            <Text typo="body-small">Billing panel.</Text>
          </TabPanel>
        </Tabs>
      </Column>

      <Column gap={0.75}>
        <Text typo="label-medium" color="secondary">
          Vertical
        </Text>
        <Tabs orientation="vertical" defaultValue="profile">
          <TabList>
            <Tab value="profile">Profile</Tab>
            <Tab value="security">Security</Tab>
            <Tab value="notifications">Notifications</Tab>
          </TabList>
          <TabPanel value="profile">
            <Text typo="body-small">Profile panel.</Text>
          </TabPanel>
          <TabPanel value="security">
            <Text typo="body-small">Security panel.</Text>
          </TabPanel>
          <TabPanel value="notifications">
            <Text typo="body-small">Notifications panel.</Text>
          </TabPanel>
        </Tabs>
      </Column>
    </Column>
  )
}

function DialogPlayground() {
  const [modalOpen, setModalOpen] = useState(false)
  const modalFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <Column gap={1} align="start">
      <Row gap={0.75} wrap>
        <Dialog
          placement="bottom-left"
          trigger={<Button text="Open non-modal Dialog" variant="secondary" />}
        >
          <Column gap={0.75}>
            <Text typo="title-medium">Non-modal Dialog</Text>
            <Text typo="body-small" color="secondary">
              This branch is a Popover wrapper: anchored to its trigger with the same placement,
              collision and dismiss behavior.
            </Text>
          </Column>
        </Dialog>

        <Button
          text="Open modal Dialog"
          viewProps={{
            onClick: () => setModalOpen(true),
          }}
        />
      </Row>

      <Dialog
        modal
        closeOnBackdrop
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialFocus={modalFocusRef}
      >
        <Column gap={0.75}>
          <Text typo="title-medium">Modal Dialog</Text>
          <Text typo="body-small" color="secondary">
            This uses showModal(): native top layer, backdrop, inert background and focus
            containment.
          </Text>
          <Row gap={0.5} justify="end">
            <Button
              text="Cancel"
              size="small"
              variant="secondary"
              viewProps={{
                ref: modalFocusRef,
                onClick: () => setModalOpen(false),
              }}
            />
            <Button
              text="Confirm"
              size="small"
              viewProps={{
                onClick: () => setModalOpen(false),
              }}
            />
          </Row>
        </Column>
      </Dialog>
    </Column>
  )
}

function DrawerPlayground() {
  const [open, setOpen] = useState(false)

  return (
    <Column gap={0.75} align="start" width="fill">
      <Text typo="body-small" color="secondary">
        auto · md breakpoint · wide viewport = non-modal SplitBox · narrow viewport = modal
      </Text>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        minSize={10}
        collapseThreshold={2}
        expandThreshold={4}
        drawer={
          <Column gap={0.75} height="fill">
            <DrawerHandle />
            <Text typo="title-medium">Responsive Drawer</Text>
            <Text typo="body-small" color="secondary">
              Wide: drag the SplitBox splitter into the collapse / expand thresholds. Narrow: drag
              this handle toward the right edge to close.
            </Text>
            <Button
              text="Close Drawer"
              size="small"
              variant="secondary"
              viewProps={{ onClick: () => setOpen(false) }}
            />
          </Column>
        }
        viewProps={{
          width: 'fill',
          maxWidth: 34,
          height: 14,
          border: 0.0625,
          borderColor: 'outline',
          borderStyle: 'dashed',
        }}
      >
        <Column gap={0.75} padding={1} align="start">
          <Text typo="title-medium">Main view</Text>
          <Text typo="body-small" color="secondary">
            Drawer content keeps the same React state when auto mode crosses the md breakpoint.
          </Text>
          <Button
            text={open ? 'Drawer is open' : 'Open Drawer'}
            size="small"
            viewProps={{ onClick: () => setOpen(true) }}
          />
        </Column>
      </Drawer>
    </Column>
  )
}

function SelectPlayground() {
  const [value, setValue] = useState('design')

  return (
    <Column gap={0.75} align="start">
      <Select
        overlapTrigger
        value={value}
        onValueChange={setValue}
        placeholder="Choose workspace"
        viewProps={{ width: 20 }}
      >
        <SelectOption
          value="design"
          text="Design"
          secondaryText="UI and visual work"
          icon={IconSettings}
        />
        <SelectOption
          value="profile"
          text="Profile"
          secondaryText="Identity and account"
          icon={IconUser}
        />
        <SelectOption
          value="search"
          text="Search"
          secondaryText="Find indexed content"
          icon={IconSearch}
        />
        <SelectOption value="disabled" text="Unavailable" disabled />
      </Select>

      <Text typo="body-small" color="secondary">
        value: {value} · type letters while focused to jump
      </Text>

      <Select disabled placeholder="Disabled select" viewProps={{ width: 20 }}>
        <SelectOption value="one" text="One" />
      </Select>
    </Column>
  )
}

function ComboboxPlayground() {
  const [value, setValue] = useState<string | null>('design')

  return (
    <Column gap={0.75} align="start">
      <Combobox
        overlapTrigger
        value={value}
        onValueChange={setValue}
        placeholder="Search workspace"
        viewProps={{ width: 20 }}
      >
        <ComboboxOption
          value="design"
          text="Design"
          secondaryText="UI and visual work"
          icon={IconSettings}
        />
        <ComboboxOption
          value="profile"
          text="Profile"
          secondaryText="Identity and account"
          icon={IconUser}
        />
        <ComboboxOption
          value="search"
          text="Search"
          secondaryText="Find indexed content"
          icon={IconSearch}
        />
        <ComboboxOption value="disabled" text="Unavailable" disabled />
      </Combobox>

      <Text typo="body-small" color="secondary">
        selected value: {value ?? 'null'} · typing only filters; Enter commits
      </Text>

      <Combobox
        placeholder="Filter by value prefix"
        emptyContent="No matching command"
        viewProps={{ width: 20 }}
        filter={(option, input) => option.value.startsWith(input.toLowerCase())}
      >
        <ComboboxOption value="alpha" text="Alpha" />
        <ComboboxOption value="beta" text="Beta" />
      </Combobox>
    </Column>
  )
}

function DividerPlayground() {
  return (
    <Column gap={1} width={18}>
      <Text typo="label-medium">Horizontal</Text>
      <Divider />
      <Divider gap={0.5} />
      <Divider gap={0.5} size={2} />

      <Text typo="label-medium">Vertical</Text>
      <Row height={4} align="stretch">
        <Text>A</Text>
        <Divider direction="vertical" gap={0.5} size={2} />
        <Text>B</Text>
      </Row>
    </Column>
  )
}

function MenuPlayground() {
  const [lastAction, setLastAction] = useState('None')

  return (
    <Column gap={0.75} align="start">
      <Menu overlapTrigger trigger={<Button text="Open menu" variant="secondary" />}>
        <MenuItem
          text="Profile"
          secondaryText="Account details"
          icon={IconUser}
          onSelect={() => setLastAction('Profile')}
        />

        <MenuItem text="Settings" icon={IconSettings} onSelect={() => setLastAction('Settings')} />

        <MenuItem text="Unavailable" disabled />

        <Divider gap={0.25} />

        <MenuItem
          text="Share"
          submenu={
            <>
              <MenuItem text="Copy link" onSelect={() => setLastAction('Copy link')} />

              <MenuItem
                text="Export"
                submenu={
                  <>
                    <MenuItem text="PDF" onSelect={() => setLastAction('Export PDF')} />
                    <MenuItem text="PNG" onSelect={() => setLastAction('Export PNG')} />
                  </>
                }
              />
            </>
          }
        />

        <Divider gap={0.25} />

        <MenuItem text="Delete" danger onSelect={() => setLastAction('Delete')} />
      </Menu>

      <Text typo="body-small" color="secondary">
        last action: {lastAction}
      </Text>
    </Column>
  )
}

export function FoundationControlPlayground() {
  return (
    <>
      <PlaygroundSection
        title="Popover"
        description="交互式锚定浮层：click toggle、outside / Escape dismiss、focus restore、8 向 placement，以及 viewport flip / shift collision。"
      >
        <PopoverPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Accordion"
        description="透明内容结构组件：single 默认可全部收起；支持显式 non-collapsible、multiple、item disabled，以及可替换的展开 / 收起图标。"
      >
        <AccordionPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Tabs"
        description="Compound tabs：默认 underline，可选 pill；支持 automatic / manual activation、horizontal / vertical、disabled、roving focus 与完整 tab / tabpanel ARIA 关联。"
      >
        <TabsPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Dialog"
        description="非模态 Dialog 直接封装 Popover，跟随 trigger 定位；modal 才使用原生 <dialog>.showModal()，由浏览器提供 top layer、backdrop、背景 inert 与 focus containment。"
      >
        <DialogPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Drawer"
        description="响应式 Drawer：默认 auto 在 md 以下使用原生 modal Dialog，在 md 以上进入 SplitBox non-modal 布局；支持 splitter 自动吸附、显式 resizable=false，以及 modal DrawerHandle drag / swipe-to-close。"
      >
        <DrawerPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Select"
        description="select-only combobox：focus 保持在 trigger；ArrowUp / ArrowDown / Home / End 改变 active option，Enter / Space 提交，支持 typeahead、disabled option 与 anchored overlay collision。"
      >
        <SelectPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Combobox"
        description="editable combobox：inputValue 与 value 分离；输入自动过滤，Arrow 键浏览候选，Enter 提交；clear 与 chevron 具有显式 action gap / inset，并支持 custom filter、empty state 与 anchored overlay collision。"
      >
        <ComboboxPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Divider"
        description="通用分割线：horizontal 的 gap 作用于上下，vertical 的 gap 作用于左右；gap=0 时不额外撑开主轴布局。"
      >
        <DividerPlayground />
      </PlaygroundSection>

      <PlaygroundSection
        title="Menu"
        description="命令菜单：ArrowUp / ArrowDown / Home / End 导航，Enter / Space 激活，ArrowRight / ArrowLeft 进入或退出子菜单；支持 disabled、danger、separator 与任意层级递归 submenu。"
      >
        <MenuPlayground />
      </PlaygroundSection>
    </>
  )
}
