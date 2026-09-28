import type { ReactNode, Ref } from 'react'
import type {
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type ChoiceControlKind =
  | 'radio'
  | 'checkbox'

export type ChoiceControlSize =
  | 'small'
  | 'medium'
  | 'large'

export type ChoiceControlValue = string | number

type ChoiceControlViewProps = Omit<
  ViewCoreProps<HTMLInputElement>,
  | 'children'
  | 'checked'
  | 'disabled'
  | 'name'
  | 'onChange'
  | 'type'
  | 'value'
> &
  ViewDynamicBreakpointProps & {
    ref?: Ref<HTMLInputElement>
  }

interface ChoiceControlProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: ReactNode
  group?: string
  value?: ChoiceControlValue
  size?: ChoiceControlSize
  viewProps?: ChoiceControlViewProps
}

export type RadioProps = ChoiceControlProps
export type CheckboxProps = ChoiceControlProps
export type RadioViewProps = ChoiceControlViewProps
export type CheckboxViewProps = ChoiceControlViewProps
