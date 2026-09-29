import type {
  ReactNode,
} from 'react'
import type {
  SelectOptionDescriptor,
} from '../../core/select-types'
import { SelectOption } from '../SelectOption'
import {
  assertUniqueOptionValues,
  collectOptionElements,
  optionDescriptor,
  selectedOptionDescriptor,
} from './option-collection'

export function selectOptionDescriptors(
  children: ReactNode,
): readonly SelectOptionDescriptor[] {
  const options =
    collectOptionElements(
      children,
      SelectOption,
    ).map(
      (element) =>
        optionDescriptor(
          element.props,
        ),
    )

  assertUniqueOptionValues(
    options,
    'Select',
  )

  return options
}

export const selectedDescriptor =
  selectedOptionDescriptor
