import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useMemo,
  useRef,
} from 'react'
import type { MenuProps } from '../core/menu-types'
import { ensureMenuStylesheet } from '../renderers/dom/menu-stylesheet'
import { resolveMenuTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { MenuSurface } from './internal/MenuSurface'
import { focusMenuItem } from './internal/menu-navigation'
import { MenuRootContext } from './internal/menu-state'
import { durationMilliseconds } from './internal/motion-duration'
import { ThemedPortal } from './internal/ThemedPortal'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { useExitPresence, useExitTransitionEnd } from './internal/use-exit-presence'
import { type MenuInitialFocus, useMenuTrigger } from './internal/use-menu-trigger'
import { usePopoverPosition } from './internal/use-popover-position'

export function Menu({
  trigger,
  children,
  placement = 'bottom-left',
  offset = 0.375,
  submenuOffset = 0.25,
  viewportPadding = 0.5,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  viewProps = {},
}: MenuProps) {
  const { value: resolvedOpen, request: requestOpenState } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )
  const pendingFocusRef = useRef<MenuInitialFocus>('first')
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const rootId = 'weave-menu-root-' + reactId
  const menuId = viewProps.id ?? 'weave-menu-' + reactId
  const levelId = 'weave-menu-level-' + reactId

  const { theme, reducedMotion } = useTheme()
  const exitDuration = durationMilliseconds(theme.tokens.motion?.duration?.fast, 120)
  const { present, visualState, finishExit } = useExitPresence(
    resolvedOpen,
    reducedMotion,
    exitDuration,
  )
  const themeClassName = useRuntimeStyleClass('menu-theme', resolveMenuTheme(theme))

  useInsertionEffect(ensureMenuStylesheet, [])

  const requestOpen = useCallback(
    (next: boolean, focus: MenuInitialFocus = 'first') => {
      pendingFocusRef.current = focus

      const changed = requestOpenState(next)

      if (!changed && next) {
        queueMicrotask(() => {
          focusMenuItem(panelRef.current, levelId, focus)
        })
      }
    },
    [levelId, requestOpenState],
  )

  const closeAll = useCallback(() => {
    requestOpen(false)
  }, [requestOpen])

  useMenuTrigger(
    wrapperRef,
    targetRef,
    rootId,
    menuId,
    resolvedOpen,
    requestOpen,
    closeAll,
    trigger,
  )

  useEffect(() => {
    if (!resolvedOpen) return

    queueMicrotask(() => {
      focusMenuItem(panelRef.current, levelId, pendingFocusRef.current)
    })
  }, [levelId, resolvedOpen])

  const {
    positioned,
    placement: resolvedPlacement,
    placementStyle,
  } = usePopoverPosition(targetRef, panelRef, present, placement, offset, viewportPadding)

  const rootContext = useMemo(
    () => ({
      rootId,
      closeAll,
      closeOnSelect,
      submenuOffset,
      viewportPadding,
    }),
    [closeAll, closeOnSelect, rootId, submenuOffset, viewportPadding],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    viewProps.onKeyDown?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeAll()
    }
  }

  const handleTransitionEnd = useExitTransitionEnd(
    resolvedOpen,
    visualState,
    finishExit,
    viewProps.onTransitionEnd,
  )

  const portal = present ? (
    <ThemedPortal>
      <MenuRootContext.Provider value={rootContext}>
        <MenuSurface
          panelRef={panelRef}
          viewProps={viewProps}
          rootId={rootId}
          levelId={levelId}
          closeLevel={closeAll}
          active={resolvedOpen}
          placement={resolvedPlacement}
          positioned={positioned}
          placementStyle={placementStyle}
          visualState={visualState}
          themeClassName={themeClassName}
          reducedMotion={reducedMotion}
          id={menuId}
          onKeyDown={handleKeyDown}
          onTransitionEnd={handleTransitionEnd}
        >
          {children}
        </MenuSurface>
      </MenuRootContext.Provider>
    </ThemedPortal>
  ) : null

  return (
    <>
      <span
        ref={wrapperRef}
        data-weave-menu-anchor=""
        style={{
          display: 'contents',
        }}
      >
        {trigger}
      </span>
      {portal}
    </>
  )
}
