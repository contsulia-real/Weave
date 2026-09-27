import type {
  InputProps,
  InputType,
} from './input-types'

export interface ResolvedInput {
  multiline: boolean
  type: InputType
  placeholder?: string
  readOnly: boolean
  required: boolean
  disabled: boolean
  name?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  rows?: number
}

export function resolveInput(
  props: InputProps,
): ResolvedInput {
  return {
    multiline: props.multiline === true,
    type:
      props.multiline === true
        ? 'text'
        : props.type ?? 'text',
    placeholder: props.placeholder,
    readOnly: props.readOnly === true,
    required: props.required === true,
    disabled:
      props.viewProps?.disabled === true,
    name: props.name,
    autoComplete: props.autoComplete,
    minLength: props.minLength,
    maxLength: props.maxLength,
    pattern:
      props.multiline === true
        ? undefined
        : props.pattern,
    rows:
      props.multiline === true
        ? props.rows
        : undefined,
  }
}
