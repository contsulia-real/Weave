import type { CheckboxProps } from '../core/choice-types'
import { ChoiceControl } from './internal/ChoiceControl'

export function Checkbox(
  props: CheckboxProps,
) {
  return (
    <ChoiceControl
      {...props}
      kind="checkbox"
    />
  )
}
