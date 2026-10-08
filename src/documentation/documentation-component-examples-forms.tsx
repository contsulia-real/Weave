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
        basicExample('Input/basic-usage'),
        {
          id: 'controlled-input',
          title: 'Controlled input',
          description:
            'Use value and onChange when the parent owns the current text while native input attributes remain available.',
          demo: 'Input/controlled-input',
        },
        {
          id: 'multiline-input',
          title: 'Multiline input',
          description:
            'Use multiline input for notes and other free-form content while keeping native text-area behavior.',
          demo: 'Input/multiline-input',
        },
        {
          id: 'form-states',
          title: 'Form states',
          description:
            'Required, read-only, and disabled fields keep their native semantics while sharing the same field styling.',
          demo: 'Input/form-states',
        },
      ],
    },
    Date: {
      description:
        'A native date picker with Weave Input styling, ISO date values, and optional date limits.',
      examples: [
        basicExample('Date/basic-usage'),
        {
          id: 'controlled-date',
          title: 'Controlled date',
          description: 'Use value and onChange to own the selected YYYY-MM-DD date.',
          demo: 'Date/controlled-date',
        },
      ],
    },
    Select: {
      description:
        'A single-value listbox select with keyboard navigation, placement, and native form value.',
      examples: [
        basicExample('Select/basic-usage'),
        {
          id: 'rich-options',
          title: 'Rich options',
          description:
            'Options can include icons, secondary text, and disabled choices without changing listbox semantics.',
          demo: 'Select/rich-options',
        },
        {
          id: 'preselected-value',
          title: 'Preselected value',
          description:
            'Use defaultValue when a form has a sensible initial choice but should remain user-editable.',
          demo: 'Select/preselected-value',
        },
        {
          id: 'controlled-select',
          title: 'Controlled select',
          description:
            'Control value and open independently when the parent owns both selection and popup state.',
          demo: 'Select/controlled-select',
        },
        {
          id: 'overlay-placement',
          title: 'Overlay placement',
          description:
            'placement, offset, overlapTrigger, and viewportPadding configure the shared anchored listbox geometry.',
          demo: 'Select/overlay-placement',
        },
      ],
    },
    Combobox: {
      description:
        'A searchable single-value listbox that combines text input and option selection.',
      examples: [
        basicExample('Combobox/basic-usage'),
        {
          id: 'empty-search-state',
          title: 'Empty search state',
          description:
            'emptyContent gives a searchable picker an explicit no-results state instead of leaving an empty listbox.',
          demo: 'Combobox/empty-search-state',
        },
        {
          id: 'searchable-rich-options',
          title: 'Searchable rich options',
          description:
            'Searchable options can retain icons and supporting text while the input filters by their text value.',
          demo: 'Combobox/searchable-rich-options',
        },
        {
          id: 'controlled-values',
          title: 'Controlled values',
          description:
            'Control committed value and inputValue separately when the parent owns both selection and search text.',
          demo: 'Combobox/controlled-values',
        },
        {
          id: 'custom-filter',
          title: 'Custom filter',
          description:
            'Provide filter when matching should use application-specific logic instead of the default textValue substring match.',
          demo: 'Combobox/custom-filter',
        },
      ],
    },
    Slider: {
      description:
        'A single-value range control with native input semantics and a shared visual value axis.',
      examples: [
        basicExample('Slider/basic-usage'),
        {
          id: 'vertical-control',
          title: 'Vertical control',
          description:
            'Vertical orientation is useful when the control belongs beside a tall canvas or reading surface.',
          demo: 'Slider/vertical-control',
        },
        {
          id: 'inverse-scale',
          title: 'Inverse scale',
          description:
            'Use inverse when the visual direction of increasing values should run opposite the default axis.',
          demo: 'Slider/inverse-scale',
        },
        {
          id: 'controlled-continuous',
          title: 'Controlled continuous slider',
          description:
            'Without step, Slider remains continuous; value and onChange let the parent own the current numeric value.',
          demo: 'Slider/controlled-continuous',
        },
      ],
    },
    MarkSlider: {
      description:
        'A Slider variant with explicit value marks and optional mark-only value restriction.',
      examples: [
        basicExample('MarkSlider/basic-usage'),
        {
          id: 'continuous-with-landmarks',
          title: 'Continuous with landmarks',
          description:
            'Marks can label meaningful landmarks while the thumb remains free to select values between them.',
          demo: 'MarkSlider/continuous-with-landmarks',
        },
        {
          id: 'vertical-marks',
          title: 'Vertical marks',
          description: 'Marks follow the same value axis when the slider is used vertically.',
          demo: 'MarkSlider/vertical-marks',
        },
        {
          id: 'controlled-restricted-inverse',
          title: 'Controlled restricted inverse scale',
          description:
            'Restricted mode snaps controlled values to marks, while inverse reverses the value axis without changing the mark model.',
          demo: 'MarkSlider/controlled-restricted-inverse',
        },
      ],
    },
    RangeSlider: {
      description:
        'A two-thumb range selector that shares Slider geometry, motion, and native input behavior.',
      examples: [
        basicExample('RangeSlider/basic-usage'),
        {
          id: 'vertical-interval',
          title: 'Vertical interval',
          description:
            'The two-thumb interval can use a vertical axis without changing range semantics.',
          demo: 'RangeSlider/vertical-interval',
        },
        {
          id: 'inverse-range',
          title: 'Inverse range',
          description:
            'Inverse preserves the selected interval while reversing the visual value direction.',
          demo: 'RangeSlider/inverse-range',
        },
        {
          id: 'controlled-range',
          title: 'Controlled range',
          description:
            'Use value and onChange when the parent owns both endpoints; startName and endName keep the two native ranges in FormData.',
          demo: 'RangeSlider/controlled-range',
        },
      ],
    },
    Switch: {
      description:
        'A binary toggle control with native form participation, label, size, and disabled state.',
      examples: [
        basicExample('Switch/basic-usage'),
        {
          id: 'disabled-preference',
          title: 'Disabled preference',
          description:
            'Disable a switch when the setting is visible but cannot currently be changed.',
          demo: 'Switch/disabled-preference',
        },
        {
          id: 'compact-settings',
          title: 'Compact settings',
          description:
            'Small switches work well for dense preference lists without changing the interaction model.',
          demo: 'Switch/compact-settings',
        },
        {
          id: 'controlled-switch',
          title: 'Controlled switch',
          description:
            'Use checked and onChange when the parent owns the state; name and value keep the checked switch in native form data.',
          demo: 'Switch/controlled-switch',
        },
      ],
    },
    Radio: {
      description:
        'A radio choice control with native grouping, themed state layers, and three sizes.',
      examples: [
        basicExample('Radio/basic-usage'),
        {
          id: 'unavailable-choice',
          title: 'Unavailable choice',
          description:
            'A disabled radio keeps an unavailable option visible without allowing it to enter the group value.',
          demo: 'Radio/unavailable-choice',
        },
        {
          id: 'compact-choice-group',
          title: 'Controlled sizes',
          description:
            'A controlled radio group can render small, medium, and large controls while native grouping still owns mutual exclusion.',
          demo: 'Radio/compact-choice-group',
        },
      ],
    },
    Checkbox: {
      description:
        'A checkbox control with checked, indeterminate, disabled, label, and size states.',
      examples: [
        basicExample('Checkbox/basic-usage'),
        {
          id: 'indeterminate-parent',
          title: 'Indeterminate parent',
          description:
            'Use indeterminate for a parent choice when only part of its child set is selected.',
          demo: 'Checkbox/indeterminate-parent',
        },
        {
          id: 'locked-selection',
          title: 'Locked selection',
          description:
            'Disabled checked items can communicate selections that are required by policy.',
          demo: 'Checkbox/locked-selection',
        },
      ],
    },
    Progress: {
      description:
        'A spin or linear progress indicator supporting determinate and indeterminate states.',
      examples: [
        basicExample('Progress/basic-usage'),
        {
          id: 'indeterminate-loading',
          title: 'Indeterminate loading',
          description:
            'Use indeterminate progress when work is active but its remaining duration is unknown.',
          demo: 'Progress/indeterminate-loading',
        },
        {
          id: 'compact-spinner',
          title: 'Compact spinner',
          description:
            'Spin mode fits next to status text when progress belongs to a small local action.',
          demo: 'Progress/compact-spinner',
        },
        {
          id: 'vertical-inverse',
          title: 'Vertical inverse progress',
          description:
            'Linear progress can use a vertical axis and inverse direction while retaining the same determinate semantics.',
          demo: 'Progress/vertical-inverse',
        },
      ],
    },
    Skeleton: {
      description: 'A themed loading placeholder with rectangular, circular, and text shapes.',
      examples: [
        basicExample('Skeleton/basic-usage'),
        {
          id: 'profile-placeholder',
          title: 'Profile placeholder',
          description:
            'Combine circular and text skeletons to reserve a profile row without shifting content later.',
          demo: 'Skeleton/profile-placeholder',
        },
        {
          id: 'feed-placeholder',
          title: 'Feed placeholder',
          description:
            'Repeat text skeletons to preserve the rhythm of content that has not arrived yet.',
          demo: 'Skeleton/feed-placeholder',
        },
      ],
    },
  }
