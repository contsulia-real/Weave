import type { MenuItemViewProps, TabPanelViewProps, ThemeDefinition } from '../../src'

// @ts-expect-error MenuItem owns disabled as a top-level semantic state
const invalidMenuDisabled: MenuItemViewProps = { disabled: true }

// @ts-expect-error MenuItem owns submenu aria-controls
const invalidMenuControls: MenuItemViewProps = { controls: 'submenu' }

// @ts-expect-error MenuItem owns submenu aria-expanded
const invalidMenuExpanded: MenuItemViewProps = { expanded: true }

// @ts-expect-error TabPanel owns its tab aria-labelledby relationship
const invalidPanelLabelledBy: TabPanelViewProps = { labelledBy: 'other-tab' }

const invalidButtonTypo = {
  components: {
    Button: {
      sizes: {
        medium: {
          // @ts-expect-error Button typography must reference the Text type scale
          typo: 'not-a-typo',
        },
      },
    },
  },
} satisfies ThemeDefinition

void [
  invalidMenuDisabled,
  invalidMenuControls,
  invalidMenuExpanded,
  invalidPanelLabelledBy,
  invalidButtonTypo,
]
