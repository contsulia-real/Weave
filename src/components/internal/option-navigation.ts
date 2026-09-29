import { type NavigationMove, resolveNavigationIndex } from './navigation-index'

interface NavigableOption {
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
  move: NavigationMove,
): string | null {
  const enabled = enabledOptions(options)

  const index = current === null ? -1 : enabled.findIndex((option) => option.value === current)
  const nextIndex = resolveNavigationIndex(enabled.length, index, move)

  return nextIndex === null ? null : (enabled[nextIndex]?.value ?? null)
}

interface OptionListboxKeyEvent {
  key: string
  preventDefault(): void
}

export function handleOpenOptionListboxKey<TOption extends NavigableOption>(
  event: OptionListboxKeyEvent,
  options: readonly TOption[],
  current: string | null,
  setActiveValue: (value: string) => void,
  selectValue: (value: string) => void,
  close: () => void,
  selectOnSpace: boolean,
): boolean {
  const move: NavigationMove | undefined =
    event.key === 'ArrowDown'
      ? 'next'
      : event.key === 'ArrowUp'
        ? 'previous'
        : event.key === 'Home'
          ? 'first'
          : event.key === 'End'
            ? 'last'
            : undefined

  if (move !== undefined) {
    event.preventDefault()
    const next = moveOptionActiveValue(options, current, move)

    if (next !== null) {
      setActiveValue(next)
    }

    return true
  }

  if (event.key === 'Enter' || (selectOnSpace && event.key === ' ')) {
    if (current !== null || selectOnSpace) {
      event.preventDefault()
    }

    if (current !== null) {
      selectValue(current)
    }

    return true
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return true
  }

  return false
}

export function optionDomId(listboxId: string, value: string): string {
  return listboxId + '-option-' + encodeURIComponent(value)
}
