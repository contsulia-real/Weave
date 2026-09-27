import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  ReactNode,
} from 'react'
import type {
  SnackController,
  SnackPlacement,
  SnackRequest,
} from '../core/snack-types'
import {
  SnackContext,
} from './internal/snack-context'
import {
  captureSnackRegionLayout,
} from './internal/snack-region'
import { Snack } from './Snack'

const MAX_VISIBLE_SNACKS_PER_PLACEMENT = 3

interface SnackQueueItem {
  id: string
  request: SnackRequest
  open: boolean
  visible: boolean
}

export interface SnackProviderProps {
  children?: ReactNode
}

function itemPlacement(
  item: SnackQueueItem,
): SnackPlacement {
  return (
    item.request.placement ??
    'bottom-center'
  )
}

function rebalancePlacement(
  items: SnackQueueItem[],
  placement: SnackPlacement,
): SnackQueueItem[] {
  let next =
    items.map(
      (item) => ({
        ...item,
      }),
    )

  const visible =
    next.filter(
      (item) =>
        item.visible &&
        itemPlacement(item) ===
          placement,
    )

  if (
    visible.some(
      (item) => !item.open,
    )
  ) {
    return next
  }

  let visibleCount =
    visible.length

  for (const item of next) {
    if (
      visibleCount >=
        MAX_VISIBLE_SNACKS_PER_PLACEMENT
    ) {
      break
    }

    if (
      !item.visible &&
      item.open &&
      itemPlacement(item) ===
        placement
    ) {
      item.visible = true
      visibleCount += 1
    }
  }

  const hasPending =
    next.some(
      (item) =>
        !item.visible &&
        item.open &&
        itemPlacement(item) ===
          placement,
    )

  if (
    hasPending &&
    visibleCount >=
      MAX_VISIBLE_SNACKS_PER_PLACEMENT
  ) {
    const oldest =
      next.find(
        (item) =>
          item.visible &&
          item.open &&
          itemPlacement(item) ===
            placement,
      )

    if (oldest !== undefined) {
      oldest.open = false
    }
  }

  return next
}

function capturePlacementLayout(
  placement: SnackPlacement,
): void {
  if (
    typeof document ===
      'undefined'
  ) {
    return
  }

  const region =
    document.querySelector<HTMLDivElement>(
      `[data-weave-snack-region="${placement}"]`,
    )

  if (region !== null) {
    captureSnackRegionLayout(
      region,
    )
  }
}

export function SnackProvider({
  children,
}: SnackProviderProps) {
  const [
    items,
    setItems,
  ] = useState<SnackQueueItem[]>([])
  const nextId =
    useRef(0)

  const show =
    useCallback(
      (
        request: SnackRequest,
      ): string => {
        nextId.current += 1

        const id =
          `weave-snack-${nextId.current}`
        const placement =
          request.placement ??
          'bottom-center'

        setItems(
          (current) => {
            const visible =
              current.filter(
                (item) =>
                  item.visible &&
                  itemPlacement(item) ===
                    placement,
              )
            const closing =
              visible.some(
                (item) =>
                  !item.open,
              )
            const canShow =
              visible.length <
                MAX_VISIBLE_SNACKS_PER_PLACEMENT &&
              !closing

            let next = [
              ...current,
              {
                id,
                request,
                open: true,
                visible: canShow,
              },
            ]

            if (
              !canShow &&
              !closing &&
              visible.length >=
                MAX_VISIBLE_SNACKS_PER_PLACEMENT
            ) {
              const oldest =
                next.find(
                  (item) =>
                    item.visible &&
                    item.open &&
                    itemPlacement(
                      item,
                    ) === placement,
                )

              if (
                oldest !==
                undefined
              ) {
                const closingOldest = {
                  ...oldest,
                  open: false,
                }

                next =
                  next.map(
                    (item) =>
                      item.id ===
                      closingOldest.id
                        ? closingOldest
                        : item,
                  )
              }
            }

            return next
          },
        )

        return id
      },
      [],
    )

  const dismiss =
    useCallback(
      (id: string) => {
        setItems(
          (current) => {
            const target =
              current.find(
                (item) =>
                  item.id === id,
              )

            if (
              target === undefined
            ) {
              return current
            }

            const placement =
              itemPlacement(
                target,
              )

            if (!target.visible) {
              return rebalancePlacement(
                current.filter(
                  (item) =>
                    item.id !== id,
                ),
                placement,
              )
            }

            return current.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      open: false,
                    }
                  : item,
            )
          },
        )
      },
      [],
    )

  const dismissAll =
    useCallback(() => {
      setItems(
        (current) =>
          current
            .filter(
              (item) =>
                item.visible,
            )
            .map(
              (item) => ({
                ...item,
                open: false,
              }),
            ),
      )
    }, [])

  const controller =
    useMemo<SnackController>(
      () => ({
        show,
        dismiss,
        dismissAll,
      }),
      [
        dismiss,
        dismissAll,
        show,
      ],
    )

  return (
    <SnackContext.Provider
      value={controller}
    >
      {children}

      {items
        .filter(
          (item) =>
            item.visible,
        )
        .map(
          ({
            id,
            request,
            open,
          }) => {
            const placement =
              request.placement ??
              'bottom-center'

            return (
              <Snack
                key={id}
                {...request}
                open={open}
                onOpenChange={(
                  nextOpen,
                ) => {
                  if (!nextOpen) {
                    dismiss(id)
                  }
                }}
                onDismissed={() => {
                  capturePlacementLayout(
                    placement,
                  )

                  setItems(
                    (current) =>
                      rebalancePlacement(
                        current.filter(
                          (item) =>
                            item.id !==
                            id,
                        ),
                        placement,
                      ),
                  )
                }}
              />
            )
          },
        )}
    </SnackContext.Provider>
  )
}
