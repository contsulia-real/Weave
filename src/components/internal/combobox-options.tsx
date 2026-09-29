import type { ReactElement, ReactNode } from 'react'
import type {
  ComboboxFilter,
  ComboboxFilterOption,
  ComboboxOptionDescriptor,
  ComboboxOptionProps,
} from '../../core/combobox-types'
import { ComboboxOption } from '../ComboboxOption'
import {
  assertUniqueOptionValues,
  collectOptionElements,
  optionDescriptor,
  selectedOptionDescriptor,
} from './option-collection'

interface ComboboxOptionEntry {
  descriptor: ComboboxOptionDescriptor
  node: ReactElement<ComboboxOptionProps>
}

export function comboboxOptionEntries(children: ReactNode): readonly ComboboxOptionEntry[] {
  const output = collectOptionElements(children, ComboboxOption).map((node) => ({
    descriptor: optionDescriptor(node.props),
    node,
  }))

  assertUniqueOptionValues(
    output.map((entry) => entry.descriptor),
    'Combobox',
  )

  return output
}

export function comboboxOptionDescriptors(
  entries: readonly ComboboxOptionEntry[],
): readonly ComboboxOptionDescriptor[] {
  return entries.map((entry) => entry.descriptor)
}

export const selectedComboboxDescriptor = selectedOptionDescriptor

function defaultComboboxFilter(option: ComboboxFilterOption, inputValue: string): boolean {
  const query = inputValue.trim().toLocaleLowerCase()

  if (query.length === 0) {
    return true
  }

  return option.textValue.trim().toLocaleLowerCase().includes(query)
}

export function filteredComboboxEntries(
  entries: readonly ComboboxOptionEntry[],
  inputValue: string,
  filter: ComboboxFilter | undefined,
): readonly ComboboxOptionEntry[] {
  const applyFilter = filter ?? defaultComboboxFilter

  return entries.filter((entry) =>
    applyFilter(
      {
        value: entry.descriptor.value,
        textValue: entry.descriptor.textValue,
        disabled: entry.descriptor.disabled,
      },
      inputValue,
    ),
  )
}
