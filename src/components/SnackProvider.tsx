import { type ReactNode, useCallback, useId, useMemo, useRef, useState } from 'react'
import type { SnackContainer, SnackController, SnackRequest } from '../core/snack-types'
import { SnackContext } from './internal/snack-context'
import { SnackHostContext } from './internal/snack-host-context'
import {
  completeSnackDismiss,
  dismissAllSnacks,
  dismissSnack,
  enqueueSnack,
  type SnackQueueItem,
} from './internal/snack-queue'
import { Snack } from './Snack'

export interface SnackProviderProps {
  children?: ReactNode
  container?: SnackContainer
}

export function SnackProvider({ children, container }: SnackProviderProps) {
  const [items, setItems] = useState<SnackQueueItem[]>([])
  const nextId = useRef(0)
  const scopeId = useId()

  const hostContext = useMemo(
    () => ({
      target: container,
      scopeId,
    }),
    [container, scopeId],
  )

  const show = useCallback((request: SnackRequest): string => {
    nextId.current += 1

    const id = `weave-snack-${nextId.current}`

    setItems((current) => enqueueSnack(current, id, request))

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setItems((current) => dismissSnack(current, id))
  }, [])

  const dismissAll = useCallback(() => {
    setItems((current) => dismissAllSnacks(current))
  }, [])

  const controller = useMemo<SnackController>(
    () => ({
      show,
      dismiss,
      dismissAll,
    }),
    [dismiss, dismissAll, show],
  )

  return (
    <SnackContext.Provider value={controller}>
      <SnackHostContext.Provider value={hostContext}>
        {children}

        {items
          .filter((item) => item.visible)
          .map(({ id, request, open }) => {
            const placement = request.placement ?? 'bottom-center'

            return (
              <Snack
                key={id}
                {...request}
                open={open}
                onOpenChange={(nextOpen) => {
                  if (!nextOpen) {
                    dismiss(id)
                  }
                }}
                onDismissed={() => {
                  setItems((current) => completeSnackDismiss(current, id, placement))
                }}
              />
            )
          })}
      </SnackHostContext.Provider>
    </SnackContext.Provider>
  )
}
