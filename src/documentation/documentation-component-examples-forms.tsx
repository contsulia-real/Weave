import { IconSearch, IconStar } from '@tabler/icons-react'
import {
  Checkbox,
  Column,
  Combobox,
  ComboboxOption,
  Input,
  MarkSlider,
  Progress,
  Radio,
  RangeSlider,
  Row,
  Select,
  SelectOption,
  Skeleton,
  Slider,
  Switch,
  Text,
} from '../index'
import {
  basicExample,
  type DocumentationComponentDocumentationDefinition,
} from './documentation-component-example-data'

export const formsComponentExamples: Record<string, DocumentationComponentDocumentationDefinition> =
  {
    Input: {
      description:
        'A single-line or multiline form input with native semantics and Weave field styling.',
      examples: [
        basicExample(
          <Input placeholder="Search notes" type="text" clearable leadingIcon={IconSearch} />,
          `<Input
  placeholder="Search notes"
  type="text"
  clearable
  leadingIcon={IconSearch}
/>`,
        ),
        {
          id: 'multiline-input',
          title: 'Multiline input',
          description:
            'Use multiline input for notes and other free-form content while keeping native text-area behavior.',
          preview: <Input multiline rows={4} placeholder="Write a short note…" />,
          code: `<Input
  multiline
  rows={4}
  placeholder="Write a short note…"
/>`,
        },
        {
          id: 'form-states',
          title: 'Form states',
          description:
            'Required, read-only, and disabled fields keep their native semantics while sharing the same field styling.',
          preview: (
            <Column gap={1} width={20}>
              <Input placeholder="Required value" required />
              <Input value="Read-only value" readOnly />
              <Input value="Unavailable value" disabled />
            </Column>
          ),
          code: `<Column gap={1} width={20}>
  <Input placeholder="Required value" required />
  <Input value="Read-only value" readOnly />
  <Input value="Unavailable value" disabled />
</Column>`,
        },
      ],
    },
    Select: {
      description:
        'A single-value listbox select with keyboard navigation, placement, and native form value.',
      examples: [
        basicExample(
          <Select placeholder="Choose a workspace">
            <SelectOption value="design" text="Design" />
            <SelectOption value="engineering" text="Engineering" />
            <SelectOption value="research" text="Research" />
          </Select>,
          `<Select placeholder="Choose a workspace">
  <SelectOption value="design" text="Design" />
  <SelectOption value="engineering" text="Engineering" />
  <SelectOption value="research" text="Research" />
</Select>`,
        ),
        {
          id: 'rich-options',
          title: 'Rich options',
          description:
            'Options can include icons, secondary text, and disabled choices without changing listbox semantics.',
          preview: (
            <Select placeholder="Choose a destination" defaultOpen>
              <SelectOption
                value="favorites"
                text="Favorites"
                secondaryText="Pinned items"
                icon={IconStar}
              />
              <SelectOption
                value="search"
                text="Search"
                secondaryText="Browse everything"
                icon={IconSearch}
              />
              <SelectOption value="archive" text="Archive" secondaryText="Unavailable" disabled />
            </Select>
          ),
          code: `<Select placeholder="Choose a destination" defaultOpen>
  <SelectOption
    value="favorites"
    text="Favorites"
    secondaryText="Pinned items"
    icon={IconStar}
  />
  <SelectOption
    value="search"
    text="Search"
    secondaryText="Browse everything"
    icon={IconSearch}
  />
  <SelectOption
    value="archive"
    text="Archive"
    secondaryText="Unavailable"
    disabled
  />
</Select>`,
        },
        {
          id: 'preselected-value',
          title: 'Preselected value',
          description:
            'Use defaultValue when a form has a sensible initial choice but should remain user-editable.',
          preview: (
            <Select defaultValue="medium" name="density">
              <SelectOption value="compact" text="Compact" />
              <SelectOption value="medium" text="Comfortable" />
              <SelectOption value="roomy" text="Roomy" />
            </Select>
          ),
          code: `<Select defaultValue="medium" name="density">
  <SelectOption value="compact" text="Compact" />
  <SelectOption value="medium" text="Comfortable" />
  <SelectOption value="roomy" text="Roomy" />
</Select>`,
        },
      ],
    },
    Combobox: {
      description:
        'A searchable single-value listbox that combines text input and option selection.',
      examples: [
        basicExample(
          <Combobox placeholder="Search projects" clearable>
            <ComboboxOption value="atlas" text="Atlas" />
            <ComboboxOption value="borealis" text="Borealis" />
            <ComboboxOption value="cascade" text="Cascade" />
          </Combobox>,
          `<Combobox placeholder="Search projects" clearable>
  <ComboboxOption value="atlas" text="Atlas" />
  <ComboboxOption value="borealis" text="Borealis" />
  <ComboboxOption value="cascade" text="Cascade" />
</Combobox>`,
        ),
        {
          id: 'empty-search-state',
          title: 'Empty search state',
          description:
            'emptyContent gives a searchable picker an explicit no-results state instead of leaving an empty listbox.',
          preview: (
            <Combobox
              placeholder="Search projects"
              defaultInputValue="Nothing matches"
              emptyContent={<Text>No matching projects</Text>}
              defaultOpen
            >
              <ComboboxOption value="atlas" text="Atlas" />
              <ComboboxOption value="borealis" text="Borealis" />
            </Combobox>
          ),
          code: `<Combobox
  placeholder="Search projects"
  defaultInputValue="Nothing matches"
  emptyContent={<Text>No matching projects</Text>}
  defaultOpen
>
  <ComboboxOption value="atlas" text="Atlas" />
  <ComboboxOption value="borealis" text="Borealis" />
</Combobox>`,
        },
        {
          id: 'searchable-rich-options',
          title: 'Searchable rich options',
          description:
            'Searchable options can retain icons and supporting text while the input filters by their text value.',
          preview: (
            <Combobox placeholder="Find a command" clearable defaultOpen>
              <ComboboxOption
                value="search"
                text="Search"
                secondaryText="Find content"
                icon={IconSearch}
              />
              <ComboboxOption
                value="favorite"
                text="Favorite"
                secondaryText="Save for later"
                icon={IconStar}
              />
            </Combobox>
          ),
          code: `<Combobox placeholder="Find a command" clearable defaultOpen>
  <ComboboxOption
    value="search"
    text="Search"
    secondaryText="Find content"
    icon={IconSearch}
  />
  <ComboboxOption
    value="favorite"
    text="Favorite"
    secondaryText="Save for later"
    icon={IconStar}
  />
</Combobox>`,
        },
      ],
    },
    Slider: {
      description:
        'A single-value range control with native input semantics and a shared visual value axis.',
      examples: [
        basicExample(
          <Slider defaultValue={35} min={0} max={100} step={5} size="medium" />,
          `<Slider defaultValue={35} min={0} max={100} step={5} />`,
        ),
        {
          id: 'vertical-control',
          title: 'Vertical control',
          description:
            'Vertical orientation is useful when the control belongs beside a tall canvas or reading surface.',
          preview: (
            <Slider
              defaultValue={60}
              min={0}
              max={100}
              step={10}
              direction="vertical"
              viewProps={{ height: 12 }}
            />
          ),
          code: `<Slider
  defaultValue={60}
  min={0}
  max={100}
  step={10}
  direction="vertical"
  viewProps={{ height: 12 }}
/>`,
        },
        {
          id: 'inverse-scale',
          title: 'Inverse scale',
          description:
            'Use inverse when the visual direction of increasing values should run opposite the default axis.',
          preview: (
            <Slider defaultValue={70} min={0} max={100} step={10} inverse label="Intensity" />
          ),
          code: `<Slider
  defaultValue={70}
  min={0}
  max={100}
  step={10}
  inverse
  label="Intensity"
/>`,
        },
      ],
    },
    MarkSlider: {
      description:
        'A Slider variant with explicit value marks and optional mark-only value restriction.',
      examples: [
        basicExample(
          <MarkSlider
            marks={[
              { flag: 20, label: 'Low' },
              { flag: 50, label: 'Medium' },
              { flag: 80, label: 'High' },
            ]}
            defaultValue={50}
            restricted
            min={0}
            max={100}
          />,
          `<MarkSlider
  marks={[
    { flag: 20, label: 'Low' },
    { flag: 50, label: 'Medium' },
    { flag: 80, label: 'High' },
  ]}
  defaultValue={50}
  restricted
  min={0}
  max={100}
/>`,
        ),
        {
          id: 'continuous-with-landmarks',
          title: 'Continuous with landmarks',
          description:
            'Marks can label meaningful landmarks while the thumb remains free to select values between them.',
          preview: (
            <MarkSlider
              marks={[
                { flag: 0, label: '0' },
                { flag: 50, label: '50' },
                { flag: 100, label: '100' },
              ]}
              defaultValue={35}
              min={0}
              max={100}
              step={5}
            />
          ),
          code: `<MarkSlider
  marks={[
    { flag: 0, label: '0' },
    { flag: 50, label: '50' },
    { flag: 100, label: '100' },
  ]}
  defaultValue={35}
  min={0}
  max={100}
  step={5}
/>`,
        },
        {
          id: 'vertical-marks',
          title: 'Vertical marks',
          description: 'Marks follow the same value axis when the slider is used vertically.',
          preview: (
            <MarkSlider
              marks={[
                { flag: 25, label: '25' },
                { flag: 50, label: '50' },
                { flag: 75, label: '75' },
              ]}
              defaultValue={50}
              min={0}
              max={100}
              direction="vertical"
              viewProps={{ height: 12 }}
            />
          ),
          code: `<MarkSlider
  marks={[
    { flag: 25, label: '25' },
    { flag: 50, label: '50' },
    { flag: 75, label: '75' },
  ]}
  defaultValue={50}
  min={0}
  max={100}
  direction="vertical"
  viewProps={{ height: 12 }}
/>`,
        },
      ],
    },
    RangeSlider: {
      description:
        'A two-thumb range selector that shares Slider geometry, motion, and native input behavior.',
      examples: [
        basicExample(
          <RangeSlider
            defaultValue={[25, 75]}
            min={0}
            max={100}
            step={5}
            startLabel="Minimum"
            endLabel="Maximum"
          />,
          `<RangeSlider
  defaultValue={[25, 75]}
  min={0}
  max={100}
  step={5}
  startLabel="Minimum"
  endLabel="Maximum"
/>`,
        ),
        {
          id: 'vertical-interval',
          title: 'Vertical interval',
          description:
            'The two-thumb interval can use a vertical axis without changing range semantics.',
          preview: (
            <RangeSlider
              defaultValue={[20, 80]}
              min={0}
              max={100}
              step={10}
              direction="vertical"
              viewProps={{ height: 12 }}
            />
          ),
          code: `<RangeSlider
  defaultValue={[20, 80]}
  min={0}
  max={100}
  step={10}
  direction="vertical"
  viewProps={{ height: 12 }}
/>`,
        },
        {
          id: 'inverse-range',
          title: 'Inverse range',
          description:
            'Inverse preserves the selected interval while reversing the visual value direction.',
          preview: <RangeSlider defaultValue={[30, 65]} min={0} max={100} inverse />,
          code: `<RangeSlider
  defaultValue={[30, 65]}
  min={0}
  max={100}
  inverse
/>`,
        },
      ],
    },
    Switch: {
      description:
        'A binary toggle control with native form participation, label, size, and disabled state.',
      examples: [
        basicExample(
          <Column gap={1}>
            <Switch label="Notifications" defaultChecked />
            <Switch label="Background sync" />
          </Column>,
          `<Column gap={1}>
  <Switch label="Notifications" defaultChecked />
  <Switch label="Background sync" />
</Column>`,
        ),
        {
          id: 'disabled-preference',
          title: 'Disabled preference',
          description:
            'Disable a switch when the setting is visible but cannot currently be changed.',
          preview: <Switch label="Managed by organization" checked disabled />,
          code: `<Switch
  label="Managed by organization"
  checked
  disabled
/>`,
        },
        {
          id: 'compact-settings',
          title: 'Compact settings',
          description:
            'Small switches work well for dense preference lists without changing the interaction model.',
          preview: (
            <Column gap={0.75}>
              <Switch label="Wi-Fi" defaultChecked size="small" />
              <Switch label="Bluetooth" size="small" />
              <Switch label="AirDrop" defaultChecked size="small" />
            </Column>
          ),
          code: `<Column gap={0.75}>
  <Switch label="Wi-Fi" defaultChecked size="small" />
  <Switch label="Bluetooth" size="small" />
  <Switch label="AirDrop" defaultChecked size="small" />
</Column>`,
        },
      ],
    },
    Radio: {
      description:
        'A radio choice control with native grouping, themed state layers, and three sizes.',
      examples: [
        basicExample(
          <Column gap={0.75}>
            <Radio label="Daily" group="digest" value="daily" defaultChecked />
            <Radio label="Weekly" group="digest" value="weekly" />
            <Radio label="Never" group="digest" value="never" />
          </Column>,
          `<Column gap={0.75}>
  <Radio label="Daily" group="digest" value="daily" defaultChecked />
  <Radio label="Weekly" group="digest" value="weekly" />
  <Radio label="Never" group="digest" value="never" />
</Column>`,
        ),
        {
          id: 'unavailable-choice',
          title: 'Unavailable choice',
          description:
            'A disabled radio keeps an unavailable option visible without allowing it to enter the group value.',
          preview: (
            <Column gap={0.75}>
              <Radio label="Standard" group="plan" value="standard" defaultChecked />
              <Radio label="Enterprise — contact sales" group="plan" value="enterprise" disabled />
            </Column>
          ),
          code: `<Column gap={0.75}>
  <Radio label="Standard" group="plan" value="standard" defaultChecked />
  <Radio
    label="Enterprise — contact sales"
    group="plan"
    value="enterprise"
    disabled
  />
</Column>`,
        },
        {
          id: 'compact-choice-group',
          title: 'Compact choice group',
          description:
            'Small radios fit dense option groups while keeping the same native grouping behavior.',
          preview: (
            <Row gap={1.5}>
              <Radio label="A" group="grade" value="a" size="small" defaultChecked />
              <Radio label="B" group="grade" value="b" size="small" />
              <Radio label="C" group="grade" value="c" size="small" />
            </Row>
          ),
          code: `<Row gap={1.5}>
  <Radio label="A" group="grade" value="a" size="small" defaultChecked />
  <Radio label="B" group="grade" value="b" size="small" />
  <Radio label="C" group="grade" value="c" size="small" />
</Row>`,
        },
      ],
    },
    Checkbox: {
      description:
        'A checkbox control with checked, indeterminate, disabled, label, and size states.',
      examples: [
        basicExample(
          <Column gap={0.75}>
            <Checkbox label="Include images" defaultChecked />
            <Checkbox label="Include comments" />
            <Checkbox label="Include attachments" defaultChecked />
          </Column>,
          `<Column gap={0.75}>
  <Checkbox label="Include images" defaultChecked />
  <Checkbox label="Include comments" />
  <Checkbox label="Include attachments" defaultChecked />
</Column>`,
        ),
        {
          id: 'indeterminate-parent',
          title: 'Indeterminate parent',
          description:
            'Use indeterminate for a parent choice when only part of its child set is selected.',
          preview: (
            <Column gap={0.75}>
              <Checkbox label="All permissions" indeterminate />
              <Column gap={0.5} paddingLeft={2}>
                <Checkbox label="Read" defaultChecked size="small" />
                <Checkbox label="Write" size="small" />
              </Column>
            </Column>
          ),
          code: `<Column gap={0.75}>
  <Checkbox label="All permissions" indeterminate />
  <Column gap={0.5} paddingLeft={2}>
    <Checkbox label="Read" defaultChecked size="small" />
    <Checkbox label="Write" size="small" />
  </Column>
</Column>`,
        },
        {
          id: 'locked-selection',
          title: 'Locked selection',
          description:
            'Disabled checked items can communicate selections that are required by policy.',
          preview: <Checkbox label="Required security checks" checked disabled />,
          code: `<Checkbox
  label="Required security checks"
  checked
  disabled
/>`,
        },
      ],
    },
    Progress: {
      description:
        'A spin or linear progress indicator supporting determinate and indeterminate states.',
      examples: [
        basicExample(
          <Column gap={0.75} width={20}>
            <Text typo="body-small">Uploading 65%</Text>
            <Progress mode="linear" progress={0.65} tracked />
          </Column>,
          `<Column gap={0.75} width={20}>
  <Text typo="body-small">Uploading 65%</Text>
  <Progress mode="linear" progress={0.65} tracked />
</Column>`,
        ),
        {
          id: 'indeterminate-loading',
          title: 'Indeterminate loading',
          description:
            'Use indeterminate progress when work is active but its remaining duration is unknown.',
          preview: <Progress mode="linear" indeterminate tracked viewProps={{ width: 20 }} />,
          code: `<Progress
  mode="linear"
  indeterminate
  tracked
  viewProps={{ width: 20 }}
/>`,
        },
        {
          id: 'compact-spinner',
          title: 'Compact spinner',
          description:
            'Spin mode fits next to status text when progress belongs to a small local action.',
          preview: (
            <Row gap={0.75} align="center">
              <Progress mode="spin" indeterminate size="small" />
              <Text>Saving changes</Text>
            </Row>
          ),
          code: `<Row gap={0.75} align="center">
  <Progress mode="spin" indeterminate size="small" />
  <Text>Saving changes</Text>
</Row>`,
        },
      ],
    },
    Skeleton: {
      description: 'A themed loading placeholder with rectangular, circular, and text shapes.',
      examples: [
        basicExample(
          <Column gap={1} width={20}>
            <Skeleton shape="rect" viewProps={{ width: 'fill', height: 7 }} />
            <Skeleton shape="text" viewProps={{ width: 12, height: 1 }} />
            <Skeleton shape="text" viewProps={{ width: 18, height: 1 }} />
          </Column>,
          `<Column gap={1} width={20}>
  <Skeleton shape="rect" viewProps={{ width: 'fill', height: 7 }} />
  <Skeleton shape="text" viewProps={{ width: 12, height: 1 }} />
  <Skeleton shape="text" viewProps={{ width: 18, height: 1 }} />
</Column>`,
        ),
        {
          id: 'profile-placeholder',
          title: 'Profile placeholder',
          description:
            'Combine circular and text skeletons to reserve a profile row without shifting content later.',
          preview: (
            <Row gap={1} align="center">
              <Skeleton shape="circle" viewProps={{ width: 3, height: 3 }} />
              <Column gap={0.5}>
                <Skeleton shape="text" viewProps={{ width: 8, height: 1 }} />
                <Skeleton shape="text" viewProps={{ width: 12, height: 1 }} />
              </Column>
            </Row>
          ),
          code: `<Row gap={1} align="center">
  <Skeleton shape="circle" viewProps={{ width: 3, height: 3 }} />
  <Column gap={0.5}>
    <Skeleton shape="text" viewProps={{ width: 8, height: 1 }} />
    <Skeleton shape="text" viewProps={{ width: 12, height: 1 }} />
  </Column>
</Row>`,
        },
        {
          id: 'feed-placeholder',
          title: 'Feed placeholder',
          description:
            'Repeat text skeletons to preserve the rhythm of content that has not arrived yet.',
          preview: (
            <Column gap={0.75} width={20}>
              <Skeleton shape="text" viewProps={{ width: 'fill', height: 1 }} />
              <Skeleton shape="text" viewProps={{ width: 17, height: 1 }} />
              <Skeleton shape="text" viewProps={{ width: 14, height: 1 }} />
            </Column>
          ),
          code: `<Column gap={0.75} width={20}>
  <Skeleton shape="text" viewProps={{ width: 'fill', height: 1 }} />
  <Skeleton shape="text" viewProps={{ width: 17, height: 1 }} />
  <Skeleton shape="text" viewProps={{ width: 14, height: 1 }} />
</Column>`,
        },
      ],
    },
  }
