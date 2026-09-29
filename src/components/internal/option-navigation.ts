export interface NavigableOption {
  value: string
  disabled: boolean
}

function enabledOptions<TOption extends NavigableOption>(
  options: readonly TOption[],
): readonly TOption[] {
  return options.filter((option) => !option.disabled)
}

export function initialOptionActiveValue<TOption extends NavigableOption>(
  options: readonly TOption[],
  selectedValue: string | null,
): string | null {
  const enabled = enabledOptions(options)

  if (selectedValue !== null && enabled.some((option) => option.value === selectedValue)) {
    return selectedValue
  }

  return enabled[0]?.value ?? null
}

export function moveOptionActiveValue<TOption extends NavigableOption>(
  options: readonly TOption[],
  current: string | null,
  move: 'previous' | 'next' | 'first' | 'last',
): string | null {
  const enabled = enabledOptions(options)

  if (enabled.length === 0) {
    return null
  }

  if (move === 'first') {
    return enabled[0]!.value
  }

  if (move === 'last') {
    return enabled.at(-1)!.value
  }

  const index = current === null ? -1 : enabled.findIndex((option) => option.value === current)
  const delta = move === 'next' ? 1 : -1
  const nextIndex =
    index < 0
      ? move === 'next'
        ? 0
        : enabled.length - 1
      : (index + delta + enabled.length) % enabled.length

  return enabled[nextIndex]?.value ?? null
}

export function optionDomId(listboxId: string, value: string): string {
  return listboxId + '-option-' + encodeURIComponent(value)
}
