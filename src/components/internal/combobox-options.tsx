import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import type {
  ComboboxFilter,
  ComboboxFilterOption,
  ComboboxOptionDescriptor,
  ComboboxOptionProps,
  ComboboxValue,
} from '../../core/combobox-types'
import { ComboboxOption } from '../ComboboxOption'

export interface ComboboxOptionEntry {
  descriptor:
    ComboboxOptionDescriptor
  node:
    ReactElement<ComboboxOptionProps>
}

function optionTextValue(
  props: ComboboxOptionProps,
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
    ComboboxOptionEntry[],
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
        child.type !==
        ComboboxOption
      ) {
        return
      }

      const props =
        child.props as ComboboxOptionProps
      const descriptor:
        ComboboxOptionDescriptor = {
          value: props.value,
          text: props.text,
          textValue:
            optionTextValue(props),
          secondaryText:
            props.secondaryText,
          icon: props.icon,
          disabled:
            props.disabled === true,
        }

      output.push({
        descriptor,
        node:
          child as ReactElement<ComboboxOptionProps>,
      })
    },
  )
}

export function comboboxOptionEntries(
  children: ReactNode,
): readonly ComboboxOptionEntry[] {
  const output:
    ComboboxOptionEntry[] = []

  collectOptions(
    children,
    output,
  )

  const seen =
    new Set<ComboboxValue>()

  for (const entry of output) {
    const value =
      entry.descriptor.value

    if (seen.has(value)) {
      throw new Error(
        'Combobox option value "' +
          value +
          '" is duplicated',
      )
    }

    seen.add(value)
  }

  return output
}

export function comboboxOptionDescriptors(
  entries:
    readonly ComboboxOptionEntry[],
): readonly ComboboxOptionDescriptor[] {
  return entries.map(
    (entry) =>
      entry.descriptor,
  )
}

export function selectedComboboxDescriptor(
  options:
    readonly ComboboxOptionDescriptor[],
  value:
    ComboboxValue | null,
):
  | ComboboxOptionDescriptor
  | undefined {
  if (value === null) {
    return undefined
  }

  return options.find(
    (option) =>
      option.value === value,
  )
}

export function defaultComboboxFilter(
  option:
    ComboboxFilterOption,
  inputValue: string,
): boolean {
  const query =
    inputValue
      .trim()
      .toLocaleLowerCase()

  if (query.length === 0) {
    return true
  }

  return option.textValue
    .trim()
    .toLocaleLowerCase()
    .includes(query)
}

export function filteredComboboxEntries(
  entries:
    readonly ComboboxOptionEntry[],
  inputValue: string,
  filter:
    ComboboxFilter | undefined,
): readonly ComboboxOptionEntry[] {
  const applyFilter =
    filter ??
    defaultComboboxFilter

  return entries.filter(
    (entry) =>
      applyFilter(
        {
          value:
            entry.descriptor.value,
          textValue:
            entry.descriptor.textValue,
          disabled:
            entry.descriptor.disabled,
        },
        inputValue,
      ),
  )
}
