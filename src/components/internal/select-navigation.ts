import type {
  SelectOptionDescriptor,
  SelectValue,
} from '../../core/select-types'
import {
  initialOptionActiveValue,
  moveOptionActiveValue,
  optionDomId,
} from './option-navigation'

export function initialSelectActiveValue(
  options:
    readonly SelectOptionDescriptor[],
  selectedValue:
    SelectValue | null,
): SelectValue | null {
  return initialOptionActiveValue(
    options,
    selectedValue,
  )
}

export function moveSelectActiveValue(
  options:
    readonly SelectOptionDescriptor[],
  current:
    SelectValue | null,
  move:
    | 'previous'
    | 'next'
    | 'first'
    | 'last',
): SelectValue | null {
  return moveOptionActiveValue(
    options,
    current,
    move,
  )
}

export function findSelectTypeaheadMatch(
  options:
    readonly SelectOptionDescriptor[],
  query: string,
  current:
    SelectValue | null,
): SelectValue | null {
  const normalized =
    query.trim().toLocaleLowerCase()

  if (normalized.length === 0) {
    return null
  }

  const enabled =
    options.filter(
      (option) =>
        !option.disabled,
    )

  if (enabled.length === 0) {
    return null
  }

  const currentIndex =
    current === null
      ? -1
      : enabled.findIndex(
          (option) =>
            option.value === current,
        )
  const ordered = [
    ...enabled.slice(
      currentIndex + 1,
    ),
    ...enabled.slice(
      0,
      currentIndex + 1,
    ),
  ]

  return (
    ordered.find(
      (option) =>
        option.textValue
          .trim()
          .toLocaleLowerCase()
          .startsWith(
            normalized,
          ),
    )?.value ??
    null
  )
}

export function selectOptionId(
  listboxId: string,
  value: SelectValue,
): string {
  return optionDomId(
    listboxId,
    value,
  )
}
