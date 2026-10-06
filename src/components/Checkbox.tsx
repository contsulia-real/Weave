import type { CheckboxProps } from '../core/choice-types'
import { ChoiceControl } from './internal/ChoiceControl'

export function Checkbox(props: CheckboxProps): import('react').JSX.Element {
  return <ChoiceControl {...props} kind="checkbox" />
}
