import type { RadioProps } from '../core/choice-types'
import { ChoiceControl } from './internal/ChoiceControl'

export function Radio(props: RadioProps) {
  return (
    <ChoiceControl
      {...props}
      kind="radio"
    />
  )
}
