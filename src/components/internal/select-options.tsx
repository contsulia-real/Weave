import {
  Children,
  Fragment,
  isValidElement,
  type ReactNode,
} from 'react'
import type {
  SelectOptionDescriptor,
  SelectOptionProps,
  SelectValue,
} from '../../core/select-types'
import { SelectOption } from '../SelectOption'

function optionTextValue(
  props: SelectOptionProps,
): string {
  if (
    props.textValue !== undefined
  ) {
    return props.textValue
  }

  if (
    typeof props.text === 'string' ||
    typeof props.text === 'number'
  ) {
    return String(props.text)
  }

  return ''
}

function collectOptions(
  children: ReactNode,
  output:
    SelectOptionDescriptor[],
): void {
  Children.forEach(
    children,
    (child) => {
      if (!isValidElement(child)) {
        return
      }

      if (child.type === Fragment) {
        collectOptions(
          (
            child.props as {
              children?: ReactNode
            }
          ).children,
          output,
        )
        return
      }

      if (
        child.type !== SelectOption
      ) {
        return
      }

      const props =
        child.props as SelectOptionProps

      output.push({
        value: props.value,
        text: props.text,
        textValue:
          optionTextValue(props),
        secondaryText:
          props.secondaryText,
        icon: props.icon,
        disabled:
          props.disabled === true,
      })
    },
  )
}

export function selectOptionDescriptors(
  children: ReactNode,
): readonly SelectOptionDescriptor[] {
  const output:
    SelectOptionDescriptor[] = []

  collectOptions(
    children,
    output,
  )

  const seen =
    new Set<SelectValue>()

  for (const option of output) {
    if (seen.has(option.value)) {
      throw new Error(
        'Select option value "' +
          option.value +
          '" is duplicated',
      )
    }

    seen.add(option.value)
  }

  return output
}

export function selectedDescriptor(
  options:
    readonly SelectOptionDescriptor[],
  value:
    SelectValue | null,
):
  | SelectOptionDescriptor
  | undefined {
  if (value === null) {
    return undefined
  }

  return options.find(
    (option) =>
      option.value === value,
  )
}
