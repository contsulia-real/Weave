function enabledItems(panel: HTMLDivElement | null, levelId: string): HTMLDivElement[] {
  if (panel === null) {
    return []
  }

  return Array.from(panel.querySelectorAll<HTMLDivElement>('[data-weave-menu-item]')).filter(
    (item) =>
      item.dataset.weaveMenuLevel === levelId && item.getAttribute('aria-disabled') !== 'true',
  )
}

export function syncMenuTabIndex(
  panel: HTMLDivElement | null,
  levelId: string,
  active: HTMLDivElement,
): void {
  for (const item of enabledItems(panel, levelId)) {
    item.tabIndex = item === active ? 0 : -1
  }
}

export function focusMenuItem(
  panel: HTMLDivElement | null,
  levelId: string,
  edge: 'first' | 'last',
): void {
  const items = enabledItems(panel, levelId)
  const item = edge === 'first' ? items[0] : items.at(-1)

  item?.focus()
}

export function moveMenuFocus(
  panel: HTMLDivElement | null,
  levelId: string,
  current: HTMLDivElement | null,
  move: 'previous' | 'next' | 'first' | 'last',
): void {
  const items = enabledItems(panel, levelId)

  if (items.length === 0) {
    return
  }

  if (move === 'first') {
    items[0]?.focus()
    return
  }

  if (move === 'last') {
    items.at(-1)?.focus()
    return
  }

  const index = current === null ? -1 : items.indexOf(current)
  const delta = move === 'next' ? 1 : -1
  const nextIndex =
    index < 0
      ? move === 'next'
        ? 0
        : items.length - 1
      : (index + delta + items.length) % items.length

  items[nextIndex]?.focus()
}
