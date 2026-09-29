import type {
  SelectOptionDescriptor,
  SelectValue,
} from '../../core/select-types'

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
