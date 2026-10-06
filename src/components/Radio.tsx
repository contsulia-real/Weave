import type { RadioProps } from '../core/choice-types'
import { ChoiceControl } from './internal/ChoiceControl'

export function Radio(props: RadioProps): import('react').JSX.Element {
  return <ChoiceControl {...props} kind="radio" />
}
