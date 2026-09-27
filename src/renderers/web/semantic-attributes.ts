import type {
  ViewSemanticProps,
} from '../../core/view-types'

export type WebSemanticAttributeValue =
  | string
  | number
  | boolean

export type WebSemanticAttributes = Readonly<
  Record<string, WebSemanticAttributeValue>
>

export interface WebSemanticOptions {
  resolveIdReference?: (value: string) => string
}

function reference(
  value: string | undefined,
  resolve:
    | ((value: string) => string)
    | undefined,
): string | undefined {
  if (value === undefined) return undefined
  if (resolve === undefined) return value

  return value
    .split(/\s+/)
    .filter(Boolean)
    .map(resolve)
    .join(' ')
}

export function compileWebSemanticAttributes(
  semantic: Readonly<ViewSemanticProps>,
  options: WebSemanticOptions = {},
): WebSemanticAttributes {
  const output: Record<
    string,
    WebSemanticAttributeValue
  > = {}

  if (semantic.role !== undefined) {
    output.role = semantic.role
  }
  if (semantic.label !== undefined) {
    output['aria-label'] = semantic.label
  }
  if (semantic.description !== undefined) {
    output['aria-description'] =
      semantic.description
  }
  if (semantic.level !== undefined) {
    output['aria-level'] = semantic.level
  }
  if (semantic.disabled !== undefined) {
    output['aria-disabled'] = semantic.disabled
  }
  if (semantic.required !== undefined) {
    output['aria-required'] = semantic.required
  }
  if (semantic.invalid !== undefined) {
    output['aria-invalid'] = semantic.invalid
  }
  if (semantic.busy !== undefined) {
    output['aria-busy'] = semantic.busy
  }
  if (semantic.expanded !== undefined) {
    output['aria-expanded'] = semantic.expanded
  }
  if (semantic.selected !== undefined) {
    output['aria-selected'] = semantic.selected
  }
  if (semantic.checked !== undefined) {
    output['aria-checked'] = semantic.checked
  }
  if (semantic.pressed !== undefined) {
    output['aria-pressed'] = semantic.pressed
  }
  if (semantic.readOnly !== undefined) {
    output['aria-readonly'] = semantic.readOnly
  }
  if (semantic.valueMin !== undefined) {
    output['aria-valuemin'] = semantic.valueMin
  }
  if (semantic.valueMax !== undefined) {
    output['aria-valuemax'] = semantic.valueMax
  }
  if (semantic.valueNow !== undefined) {
    output['aria-valuenow'] = semantic.valueNow
  }
  if (semantic.valueText !== undefined) {
    output['aria-valuetext'] = semantic.valueText
  }

  const labelledBy = reference(
    semantic.labelledBy,
    options.resolveIdReference,
  )
  if (labelledBy !== undefined) {
    output['aria-labelledby'] = labelledBy
  }

  const describedBy = reference(
    semantic.describedBy,
    options.resolveIdReference,
  )
  if (describedBy !== undefined) {
    output['aria-describedby'] = describedBy
  }

  const controls = reference(
    semantic.controls,
    options.resolveIdReference,
  )
  if (controls !== undefined) {
    output['aria-controls'] = controls
  }

  const owns = reference(
    semantic.owns,
    options.resolveIdReference,
  )
  if (owns !== undefined) {
    output['aria-owns'] = owns
  }

  return output
}
