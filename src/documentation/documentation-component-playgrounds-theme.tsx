import { Card, ThemeProvider } from '../index'
import type { DocumentationComponentDefinition } from './documentation-component-playground-data'
import {
  optionValue,
  reducedMotionOptions,
  selectControl,
  themeModeOptions,
} from './documentation-component-playground-data'

export const themeComponentDefinitions: Record<string, DocumentationComponentDefinition> = {
  ThemeProvider: {
    description:
      'Scopes theme definition, color mode, and reduced-motion preference for descendant Weave UI.',
    controls: [
      selectControl('mode', themeModeOptions),
      selectControl('reducedMotion', reducedMotionOptions),
    ],
    defaults: { mode: 'system', reducedMotion: 'system' },
    render: (values) => (
      <ThemeProvider
        mode={optionValue(values, 'mode', themeModeOptions)}
        reducedMotion={optionValue(values, 'reducedMotion', reducedMotionOptions)}
      >
        <Card>ThemeProvider content</Card>
      </ThemeProvider>
    ),
  },
}
