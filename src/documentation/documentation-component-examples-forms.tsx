import {
  Checkbox,
  Combobox,
  ComboboxOption,
  Input,
  MarkSlider,
  Progress,
  Radio,
  RangeSlider,
  Select,
  SelectOption,
  Skeleton,
  Slider,
  Switch,
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
          <Input placeholder="Type something" type="text" clearable />,
          `<Input placeholder="Type something" type="text" clearable />`,
        ),
      ],
    },
    Select: {
      description:
        'A single-value listbox select with keyboard navigation, placement, and native form value.',
      examples: [
        basicExample(
          <Select placeholder="Choose an option">
            <SelectOption value="one" text="One" />
            <SelectOption value="two" text="Two" />
          </Select>,
          `<Select placeholder="Choose an option">
  <SelectOption value="one" text="One" />
  <SelectOption value="two" text="Two" />
</Select>`,
        ),
      ],
    },
    Combobox: {
      description:
        'A searchable single-value listbox that combines text input and option selection.',
      examples: [
        basicExample(
          <Combobox placeholder="Search options" clearable>
            <ComboboxOption value="alpha" text="Alpha" />
            <ComboboxOption value="beta" text="Beta" />
          </Combobox>,
          `<Combobox placeholder="Search options" clearable>
  <ComboboxOption value="alpha" text="Alpha" />
  <ComboboxOption value="beta" text="Beta" />
</Combobox>`,
        ),
      ],
    },
    Slider: {
      description:
        'A single-value range control with native input semantics and a shared visual value axis.',
      examples: [
        basicExample(
          <Slider defaultValue={35} min={0} max={100} step={5} size="medium" />,
          `<Slider defaultValue={35} min={0} max={100} step={5} size="medium" />`,
        ),
      ],
    },
    MarkSlider: {
      description:
        'A Slider variant with explicit value marks and optional mark-only value restriction.',
      examples: [
        basicExample(
          <MarkSlider
            marks={[
              { flag: 20, label: '20' },
              { flag: 50, label: '50' },
              { flag: 80, label: '80' },
            ]}
            defaultValue={50}
            restricted
            min={0}
            max={100}
            size="medium"
          />,
          `<MarkSlider
  marks={[
    { flag: 20, label: '20' },
    { flag: 50, label: '50' },
    { flag: 80, label: '80' },
  ]}
  defaultValue={50}
  restricted
  min={0}
  max={100}
  size="medium"
/>`,
        ),
      ],
    },
    RangeSlider: {
      description:
        'A two-thumb range selector that shares Slider geometry, motion, and native input behavior.',
      examples: [
        basicExample(
          <RangeSlider defaultValue={[25, 75]} min={0} max={100} step={5} size="medium" />,
          `<RangeSlider defaultValue={[25, 75]} min={0} max={100} step={5} size="medium" />`,
        ),
      ],
    },
    Switch: {
      description:
        'A binary toggle control with native form participation, label, size, and disabled state.',
      examples: [
        basicExample(
          <Switch label="Enable feature" defaultChecked size="medium" />,
          `<Switch label="Enable feature" defaultChecked size="medium" />`,
        ),
      ],
    },
    Radio: {
      description:
        'A radio choice control with native grouping, themed state layers, and three sizes.',
      examples: [
        basicExample(
          <Radio
            label="Radio option"
            defaultChecked
            size="medium"
            group="documentation-example"
            value="radio"
          />,
          `<Radio
  label="Radio option"
  defaultChecked
  size="medium"
  group="example"
  value="radio"
/>`,
        ),
      ],
    },
    Checkbox: {
      description:
        'A checkbox control with checked, indeterminate, disabled, label, and size states.',
      examples: [
        basicExample(
          <Checkbox label="Checkbox option" defaultChecked size="medium" />,
          `<Checkbox label="Checkbox option" defaultChecked size="medium" />`,
        ),
      ],
    },
    Progress: {
      description:
        'A spin or linear progress indicator supporting determinate and indeterminate states.',
      examples: [
        basicExample(
          <Progress mode="linear" progress={0.65} tracked size="medium" />,
          `<Progress mode="linear" progress={0.65} tracked size="medium" />`,
        ),
      ],
    },
    Skeleton: {
      description: 'A themed loading placeholder with rectangular, circular, and text shapes.',
      examples: [
        basicExample(
          <Skeleton shape="rect" viewProps={{ width: 12, height: 4 }} />,
          `<Skeleton shape="rect" viewProps={{ width: 12, height: 4 }} />`,
        ),
      ],
    },
  }
