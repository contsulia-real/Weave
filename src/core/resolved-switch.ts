import type {
  SwitchProps,
  SwitchSize,
} from './switch-types'

export interface ResolvedSwitch {
  size: SwitchSize
  checked: boolean
  disabled: boolean
}

export function resolveSwitch(input: {
  size?: SwitchProps['size']
  checked: boolean
  disabled?: boolean
}): ResolvedSwitch {
  return {
    size: input.size ?? 'medium',
    checked: input.checked,
    disabled: input.disabled === true,
  }
}
