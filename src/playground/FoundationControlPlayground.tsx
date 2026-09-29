import { IconSearch, IconSettings, IconUser } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import {
  Button,
  Column,
  Combobox,
  ComboboxOption,
  Dialog,
  Divider,
  Menu,
  MenuItem,
  Popover,
  Row,
  Select,
  SelectOption,
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

function DialogPlayground() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const modalFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <Column gap={1} align="start">
      <Row gap={0.75} wrap>
        <Button
          text="Open non-modal Dialog"
          variant="secondary"
          viewProps={{
            onClick: () => setDialogOpen(true),
          }}
        />
        <Button
          text="Open modal Dialog"
          viewProps={{
            onClick: () => setModalOpen(true),
          }}
        />
      </Row>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Column gap={0.75}>
          <Text typo="title-medium">Non-modal Dialog</Text>
          <Text typo="body-small" color="secondary">
            This uses the native dialog.show() path. Background controls remain interactive.
          </Text>
          <Button
            text="Close"
            size="small"
            variant="secondary"
            viewProps={{
              onClick: () => setDialogOpen(false),
            }}
          />
        </Column>
      </Dialog>

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

function SelectPlayground() {
  const [value, setValue] = useState('design')

  return (
    <Column gap={0.75} align="start">
      <Select
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
      <Menu trigger={<Button text="Open menu" variant="secondary" />}>
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
        title="Dialog"
        description="同一个原生 <dialog>：默认走 show() 非模态；modal 走 showModal()，由浏览器提供 top layer、backdrop、背景 inert 与 focus containment。"
      >
        <DialogPlayground />
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
