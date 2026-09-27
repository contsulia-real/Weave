import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  ReactNode,
} from 'react'
import type {
  SnackController,
  SnackRequest,
} from '../core/snack-types'
import { Snack } from './Snack'

const MAX_VISIBLE_SNACKS_PER_PLACEMENT = 3

interface SnackQueueItem {
  id: string
  request: SnackRequest
  open: boolean
}

const SnackContext =
  createContext<SnackController | null>(
    null,
  )

export interface SnackProviderProps {
  children?: ReactNode
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

        setItems(
          (current) => {
            const placement =
              request.placement ??
              'bottom-center'
            const active =
              current.filter(
                (item) =>
                  item.open &&
                  (
                    item.request
                      .placement ??
                    'bottom-center'
                  ) === placement,
              )

            const overflowId =
              active.length >=
              MAX_VISIBLE_SNACKS_PER_PLACEMENT
                ? active[0]?.id
                : undefined

            const next =
              overflowId ===
              undefined
                ? current
                : current.map(
                    (item) =>
                      item.id ===
                      overflowId
                        ? {
                            ...item,
                            open: false,
                          }
                        : item,
                  )

            return [
              ...next,
              {
                id,
                request,
                open: true,
              },
            ]
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
          (current) =>
            current.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      open: false,
                    }
                  : item,
            ),
        )
      },
      [],
    )

  const dismissAll =
    useCallback(() => {
      setItems(
        (current) =>
          current.map(
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

      {items.map(
        ({
          id,
          request,
          open,
        }) => (
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
              setItems(
                (current) =>
                  current.filter(
                    (item) =>
                      item.id !== id,
                  ),
              )
            }}
          />
        ),
      )}
    </SnackContext.Provider>
  )
}

export function useSnack(): SnackController {
  const context =
    useContext(SnackContext)

  if (context === null) {
    throw new Error(
      'useSnack() requires a SnackProvider',
    )
  }

  return context
}
