import type { SnackPlacement, SnackRequest } from '../../core/snack-types'

const MAX_VISIBLE_SNACKS_PER_PLACEMENT = 3

export interface SnackQueueItem {
  id: string
  request: SnackRequest
  open: boolean
  visible: boolean
}

function snackItemPlacement(item: SnackQueueItem): SnackPlacement {
  return item.request.placement ?? 'bottom-center'
}

function rebalanceSnackPlacement(
  items: readonly SnackQueueItem[],
  placement: SnackPlacement,
): SnackQueueItem[] {
  const next = items.map((item) => ({
    ...item,
  }))

  const visible = next.filter((item) => item.visible && snackItemPlacement(item) === placement)

  if (visible.some((item) => !item.open)) {
    return next
  }

  let visibleCount = visible.length

  for (const item of next) {
    if (visibleCount >= MAX_VISIBLE_SNACKS_PER_PLACEMENT) {
      break
    }

    if (!item.visible && item.open && snackItemPlacement(item) === placement) {
      item.visible = true
      visibleCount += 1
    }
  }

  const hasPending = next.some(
    (item) => !item.visible && item.open && snackItemPlacement(item) === placement,
  )

  if (hasPending && visibleCount >= MAX_VISIBLE_SNACKS_PER_PLACEMENT) {
    const oldest = next.find(
      (item) => item.visible && item.open && snackItemPlacement(item) === placement,
    )

    if (oldest !== undefined) {
      oldest.open = false
    }
  }

  return next
}

export function enqueueSnack(
  current: readonly SnackQueueItem[],
  id: string,
  request: SnackRequest,
): SnackQueueItem[] {
  const placement = request.placement ?? 'bottom-center'
  const visible = current.filter((item) => item.visible && snackItemPlacement(item) === placement)
  const closing = visible.some((item) => !item.open)
  const canShow = visible.length < MAX_VISIBLE_SNACKS_PER_PLACEMENT && !closing

  return [
    ...current,
    {
      id,
      request,
      open: true,
      visible: canShow,
    },
  ]
}

export function startSnackOverflowDismissals(current: SnackQueueItem[]): SnackQueueItem[] {
  const placements = new Set(current.map(snackItemPlacement))
  let next: SnackQueueItem[] | undefined

  for (const placement of placements) {
    const source = next ?? current
    const visible = source.filter((item) => item.visible && snackItemPlacement(item) === placement)

    if (visible.some((item) => !item.open)) {
      continue
    }

    const hasPending = source.some(
      (item) => !item.visible && item.open && snackItemPlacement(item) === placement,
    )

    if (!hasPending || visible.length < MAX_VISIBLE_SNACKS_PER_PLACEMENT) {
      continue
    }

    const oldest = visible.find((item) => item.open)

    if (oldest === undefined) {
      continue
    }

    next = source.map((item) =>
      item.id === oldest.id
        ? {
            ...item,
            open: false,
          }
        : item,
    )
  }

  return next ?? current
}

export function dismissSnack(current: readonly SnackQueueItem[], id: string): SnackQueueItem[] {
  const target = current.find((item) => item.id === id)

  if (target === undefined) {
    return [...current]
  }

  const placement = snackItemPlacement(target)

  if (!target.visible) {
    return rebalanceSnackPlacement(
      current.filter((item) => item.id !== id),
      placement,
    )
  }

  return current.map((item) =>
    item.id === id
      ? {
          ...item,
          open: false,
        }
      : item,
  )
}

export function dismissAllSnacks(current: readonly SnackQueueItem[]): SnackQueueItem[] {
  return current
    .filter((item) => item.visible)
    .map((item) => ({
      ...item,
      open: false,
    }))
}

export function completeSnackDismiss(
  current: readonly SnackQueueItem[],
  id: string,
  placement: SnackPlacement,
): SnackQueueItem[] {
  return rebalanceSnackPlacement(
    current.filter((item) => item.id !== id),
    placement,
  )
}
