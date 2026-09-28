import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import {
  MenuLevelContext,
  type MenuLevelContextValue,
} from './menu-state'
import {
  focusMenuItem,
  moveMenuFocus,
} from './menu-navigation'

export function MenuLevelProvider({
  children,
  levelId,
  panelRef,
  parentItemRef,
  closeLevel,
  active = true,
}: {
  children?: ReactNode
  levelId: string
  panelRef:
    RefObject<HTMLDivElement | null>
  parentItemRef?:
    RefObject<HTMLDivElement | null>
  closeLevel(): void
  active?: boolean
}) {
  const [
    openSubmenuId,
    setOpenSubmenuId,
  ] = useState<string | null>(null)

  /*
   * A level stays mounted during exit motion. Clearing its child
   * submenu when that exit starts prevents a stale child from
   * reappearing if the parent close is interrupted and reopened.
   */
  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (
      !active &&
      openSubmenuId !== null
    ) {
      setOpenSubmenuId(null)
    }
  }, [
    active,
    openSubmenuId,
  ])
  /* oxlint-enable react/set-state-in-effect */

  const moveFocus =
    useCallback(
      (
        current:
          HTMLDivElement | null,
        move:
          | 'previous'
          | 'next'
          | 'first'
          | 'last',
      ) => {
        moveMenuFocus(
          panelRef.current,
          levelId,
          current,
          move,
        )
      },
      [
        levelId,
        panelRef,
      ],
    )

  const focusFirst =
    useCallback(() => {
      focusMenuItem(
        panelRef.current,
        levelId,
        'first',
      )
    }, [
      levelId,
      panelRef,
    ])

  const focusLast =
    useCallback(() => {
      focusMenuItem(
        panelRef.current,
        levelId,
        'last',
      )
    }, [
      levelId,
      panelRef,
    ])

  const value =
    useMemo<MenuLevelContextValue>(
      () => ({
        levelId,
        panelRef,
        parentItemRef,
        openSubmenuId,
        setOpenSubmenuId,
        moveFocus,
        focusFirst,
        focusLast,
        closeLevel,
      }),
      [
        closeLevel,
        focusFirst,
        focusLast,
        levelId,
        moveFocus,
        openSubmenuId,
        panelRef,
        parentItemRef,
      ],
    )

  return (
    <MenuLevelContext.Provider
      value={value}
    >
      {children}
    </MenuLevelContext.Provider>
  )
}
