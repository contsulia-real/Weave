import type {
  SelectOptionDescriptor,
  SelectValue,
} from '../../core/select-types'

function enabledOptions(
  options:
    readonly SelectOptionDescriptor[],
): readonly SelectOptionDescriptor[] {
  return options.filter(
    (option) =>
      !option.disabled,
  )
}

export function initialSelectActiveValue(
  options:
    readonly SelectOptionDescriptor[],
  selectedValue:
    SelectValue | null,
): SelectValue | null {
  const enabled =
    enabledOptions(options)

  if (
    selectedValue !== null &&
    enabled.some(
      (option) =>
        option.value ===
        selectedValue,
    )
  ) {
    return selectedValue
  }

  return enabled[0]?.value ?? null
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
  const enabled =
    enabledOptions(options)

  if (enabled.length === 0) {
    return null
  }

  if (move === 'first') {
    return enabled[0]!.value
  }

  if (move === 'last') {
    return enabled.at(-1)!.value
  }

  const index =
    current === null
      ? -1
      : enabled.findIndex(
          (option) =>
            option.value ===
            current,
        )
  const delta =
    move === 'next'
      ? 1
      : -1
  const nextIndex =
    index < 0
      ? (
          move === 'next'
            ? 0
            : enabled.length - 1
        )
      : (
          index +
          delta +
          enabled.length
        ) %
        enabled.length

  return (
    enabled[nextIndex]?.value ??
    null
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
    enabledOptions(options)

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
  return (
    listboxId +
    '-option-' +
    encodeURIComponent(value)
  )
}
