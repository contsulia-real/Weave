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
import type { DocumentationComponentDefinition } from './documentation-component-playground-data'
import {
  axisOptions,
  booleanControl,
  booleanValue,
  inputTypeOptions,
  numberControl,
  numberValue,
  optionValue,
  progressModeOptions,
  selectControl,
  sizeOptions,
  skeletonShapeOptions,
  textControl,
  textValue,
} from './documentation-component-playground-data'

export const formsComponentDefinitions: Record<string, DocumentationComponentDefinition> = {
  Input: {
    description:
      'A single-line or multiline form input with native semantics and Weave field styling.',
    controls: [
      textControl('placeholder'),
      selectControl('type', inputTypeOptions),
      booleanControl('disabled'),
      booleanControl('readOnly'),
      booleanControl('required'),
      booleanControl('clearable'),
    ],
    defaults: {
      placeholder: 'Type something',
      type: 'text',
      disabled: false,
      readOnly: false,
      required: false,
      clearable: true,
    },
    render: (values) => (
      <Input
        placeholder={textValue(values, 'placeholder')}
        type={optionValue(values, 'type', inputTypeOptions)}
        disabled={booleanValue(values, 'disabled')}
        readOnly={booleanValue(values, 'readOnly')}
        required={booleanValue(values, 'required')}
        clearable={booleanValue(values, 'clearable')}
      />
    ),
  },
  Select: {
    description:
      'A single-value listbox select with keyboard navigation, placement, and native form value.',
    controls: [
      textControl('placeholder'),
      booleanControl('disabled'),
      booleanControl('overlapTrigger'),
    ],
    defaults: { placeholder: 'Choose an option', disabled: false, overlapTrigger: false },
    render: (values) => (
      <Select
        placeholder={textValue(values, 'placeholder')}
        disabled={booleanValue(values, 'disabled')}
        overlapTrigger={booleanValue(values, 'overlapTrigger')}
      >
        <SelectOption value="one" text="One" />
        <SelectOption value="two" text="Two" />
      </Select>
    ),
  },
  Combobox: {
    description: 'A searchable single-value listbox that combines text input and option selection.',
    controls: [
      textControl('placeholder'),
      booleanControl('disabled'),
      booleanControl('clearable'),
      booleanControl('overlapTrigger'),
    ],
    defaults: {
      placeholder: 'Search options',
      disabled: false,
      clearable: true,
      overlapTrigger: false,
    },
    render: (values) => (
      <Combobox
        placeholder={textValue(values, 'placeholder')}
        disabled={booleanValue(values, 'disabled')}
        clearable={booleanValue(values, 'clearable')}
        overlapTrigger={booleanValue(values, 'overlapTrigger')}
      >
        <ComboboxOption value="alpha" text="Alpha" />
        <ComboboxOption value="beta" text="Beta" />
      </Combobox>
    ),
  },
  Slider: {
    description:
      'A single-value range control with native input semantics and a shared visual value axis.',
    controls: [
      numberControl('defaultValue'),
      numberControl('min'),
      numberControl('max'),
      numberControl('step'),
      selectControl('size', sizeOptions),
      selectControl('direction', axisOptions),
      booleanControl('inverse'),
      booleanControl('disabled'),
    ],
    defaults: {
      defaultValue: 35,
      min: 0,
      max: 100,
      step: 5,
      size: 'medium',
      direction: 'horizontal',
      inverse: false,
      disabled: false,
    },
    render: (values) => (
      <Slider
        defaultValue={numberValue(values, 'defaultValue')}
        min={numberValue(values, 'min')}
        max={numberValue(values, 'max')}
        step={numberValue(values, 'step')}
        size={optionValue(values, 'size', sizeOptions)}
        direction={optionValue(values, 'direction', axisOptions)}
        inverse={booleanValue(values, 'inverse')}
        disabled={booleanValue(values, 'disabled')}
      />
    ),
  },
  MarkSlider: {
    description:
      'A Slider variant with explicit value marks and optional mark-only value restriction.',
    controls: [
      booleanControl('restricted'),
      numberControl('min'),
      numberControl('max'),
      selectControl('size', sizeOptions),
      selectControl('direction', axisOptions),
      booleanControl('inverse'),
      booleanControl('disabled'),
    ],
    defaults: {
      restricted: true,
      min: 0,
      max: 100,
      size: 'medium',
      direction: 'horizontal',
      inverse: false,
      disabled: false,
    },
    render: (values) => (
      <MarkSlider
        marks={[
          { flag: 20, label: '20' },
          { flag: 50, label: '50' },
          { flag: 80, label: '80' },
        ]}
        defaultValue={50}
        restricted={booleanValue(values, 'restricted')}
        min={numberValue(values, 'min')}
        max={numberValue(values, 'max')}
        size={optionValue(values, 'size', sizeOptions)}
        direction={optionValue(values, 'direction', axisOptions)}
        inverse={booleanValue(values, 'inverse')}
        disabled={booleanValue(values, 'disabled')}
      />
    ),
  },
  RangeSlider: {
    description:
      'A two-thumb range selector that shares Slider geometry, motion, and native input behavior.',
    controls: [
      numberControl('min'),
      numberControl('max'),
      numberControl('step'),
      selectControl('size', sizeOptions),
      selectControl('direction', axisOptions),
      booleanControl('inverse'),
      booleanControl('disabled'),
    ],
    defaults: {
      min: 0,
      max: 100,
      step: 5,
      size: 'medium',
      direction: 'horizontal',
      inverse: false,
      disabled: false,
    },
    render: (values) => (
      <RangeSlider
        defaultValue={[25, 75]}
        min={numberValue(values, 'min')}
        max={numberValue(values, 'max')}
        step={numberValue(values, 'step')}
        size={optionValue(values, 'size', sizeOptions)}
        direction={optionValue(values, 'direction', axisOptions)}
        inverse={booleanValue(values, 'inverse')}
        disabled={booleanValue(values, 'disabled')}
      />
    ),
  },
  Switch: {
    description:
      'A binary toggle control with native form participation, label, size, and disabled state.',
    controls: [
      textControl('label'),
      booleanControl('defaultChecked'),
      booleanControl('disabled'),
      selectControl('size', sizeOptions),
    ],
    defaults: { label: 'Enable feature', defaultChecked: true, disabled: false, size: 'medium' },
    render: (values) => (
      <Switch
        label={textValue(values, 'label')}
        defaultChecked={booleanValue(values, 'defaultChecked')}
        disabled={booleanValue(values, 'disabled')}
        size={optionValue(values, 'size', sizeOptions)}
      />
    ),
  },
  Radio: {
    description:
      'A radio choice control with native grouping, themed state layers, and three sizes.',
    controls: [
      textControl('label'),
      booleanControl('defaultChecked'),
      booleanControl('disabled'),
      selectControl('size', sizeOptions),
    ],
    defaults: { label: 'Radio option', defaultChecked: true, disabled: false, size: 'medium' },
    render: (values) => (
      <Radio
        label={textValue(values, 'label')}
        defaultChecked={booleanValue(values, 'defaultChecked')}
        disabled={booleanValue(values, 'disabled')}
        size={optionValue(values, 'size', sizeOptions)}
        group="documentation-playground"
        value="radio"
      />
    ),
  },
  Checkbox: {
    description:
      'A checkbox control with checked, indeterminate, disabled, label, and size states.',
    controls: [
      textControl('label'),
      booleanControl('defaultChecked'),
      booleanControl('indeterminate'),
      booleanControl('disabled'),
      selectControl('size', sizeOptions),
    ],
    defaults: {
      label: 'Checkbox option',
      defaultChecked: true,
      indeterminate: false,
      disabled: false,
      size: 'medium',
    },
    render: (values) => (
      <Checkbox
        label={textValue(values, 'label')}
        defaultChecked={booleanValue(values, 'defaultChecked')}
        indeterminate={booleanValue(values, 'indeterminate')}
        disabled={booleanValue(values, 'disabled')}
        size={optionValue(values, 'size', sizeOptions)}
      />
    ),
  },
  Progress: {
    description:
      'A spin or linear progress indicator supporting determinate and indeterminate states.',
    controls: [
      selectControl('mode', progressModeOptions),
      numberControl('progress'),
      booleanControl('indeterminate'),
      booleanControl('tracked'),
      selectControl('size', sizeOptions),
      selectControl('direction', axisOptions),
      booleanControl('inverse'),
    ],
    defaults: {
      mode: 'linear',
      progress: 0.65,
      indeterminate: false,
      tracked: true,
      size: 'medium',
      direction: 'horizontal',
      inverse: false,
    },
    render: (values) => {
      const shared = {
        mode: optionValue(values, 'mode', progressModeOptions),
        tracked: booleanValue(values, 'tracked'),
        size: optionValue(values, 'size', sizeOptions),
        direction: optionValue(values, 'direction', axisOptions),
        inverse: booleanValue(values, 'inverse'),
      }

      return booleanValue(values, 'indeterminate') ? (
        <Progress {...shared} indeterminate />
      ) : (
        <Progress {...shared} progress={numberValue(values, 'progress')} />
      )
    },
  },
  Skeleton: {
    description: 'A themed loading placeholder with rectangular, circular, and text shapes.',
    controls: [selectControl('shape', skeletonShapeOptions)],
    defaults: { shape: 'rect' },
    render: (values) => (
      <Skeleton
        shape={optionValue(values, 'shape', skeletonShapeOptions)}
        viewProps={{ width: 12, height: 4 }}
      />
    ),
  },
}
