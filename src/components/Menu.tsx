import {
  useCallback,
  useEffect,
  useId,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type TransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type {
  MenuProps,
} from '../core/menu-types'
import { length } from '../core/values'
import {
  resolveMenuTheme,
} from '../renderers/dom/resolve-component-theme'
import {
  ensureMenuStylesheet,
} from '../renderers/dom/menu-stylesheet'
import {
  useRuntimeStyleClass,
} from '../renderers/dom/runtime-class'
import {
  useTheme,
} from '../theme/theme-context'
import { ThemeProvider } from '../theme/ThemeProvider'
import {
  MenuRootContext,
} from './internal/menu-state'
import {
  focusMenuItem,
} from './internal/menu-navigation'
import { MenuSurface } from './internal/MenuSurface'
import {
  durationMilliseconds,
} from './internal/motion-duration'
import {
  useExitPresence,
} from './internal/use-exit-presence'
import {
  type MenuInitialFocus,
  useMenuTrigger,
} from './internal/use-menu-trigger'
import {
  usePopoverPosition,
} from './internal/use-popover-position'

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
  const controlled =
    open !== undefined
  const [
    uncontrolledOpen,
    setUncontrolledOpen,
  ] = useState(defaultOpen)
  const resolvedOpen =
    open ?? uncontrolledOpen
  const requestedOpenRef =
    useRef(resolvedOpen)
  const pendingFocusRef =
    useRef<MenuInitialFocus>(
      'first',
    )
  const wrapperRef =
    useRef<HTMLSpanElement>(null)
  const targetRef =
    useRef<HTMLElement | null>(
      null,
    )
  const panelRef =
    useRef<HTMLDivElement>(null)
  const reactId = useId()
  const rootId =
    'weave-menu-root-' +
    reactId
  const menuId =
    viewProps.id ??
    (
      'weave-menu-' +
      reactId
    )
  const levelId =
    'weave-menu-level-' +
    reactId

  const {
    theme,
    mode,
    reducedMotion,
  } = useTheme()
  const exitDuration =
    durationMilliseconds(
      theme.tokens.motion
        ?.duration?.fast,
      120,
    )
  const {
    present,
    visualState,
    finishExit,
  } = useExitPresence(
    resolvedOpen,
    reducedMotion,
    exitDuration,
  )
  const themeClassName =
    useRuntimeStyleClass(
      'menu-theme',
      resolveMenuTheme(theme),
    )

  useInsertionEffect(
    ensureMenuStylesheet,
    [],
  )

  useEffect(() => {
    requestedOpenRef.current =
      resolvedOpen
  }, [resolvedOpen])

  const requestOpen =
    useCallback(
      (
        next: boolean,
        focus:
          MenuInitialFocus =
          'first',
      ) => {
        pendingFocusRef.current =
          focus

        if (
          requestedOpenRef.current ===
          next
        ) {
          if (next) {
            queueMicrotask(() => {
              focusMenuItem(
                panelRef.current,
                levelId,
                focus,
              )
            })
          }
          return
        }

        requestedOpenRef.current =
          next

        if (!controlled) {
          setUncontrolledOpen(next)
        }

        onOpenChange?.(next)
      },
      [
        controlled,
        levelId,
        onOpenChange,
      ],
    )

  const closeAll =
    useCallback(() => {
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
      focusMenuItem(
        panelRef.current,
        levelId,
        pendingFocusRef.current,
      )
    })
  }, [
    levelId,
    resolvedOpen,
  ])

  const offsetValue =
    length(offset) ??
    '0rem'
  const submenuOffsetValue =
    length(submenuOffset) ??
    '0rem'
  const viewportPaddingValue =
    length(viewportPadding) ??
    '0rem'
  const {
    positioned,
    placement:
      resolvedPlacement,
    placementStyle,
  } = usePopoverPosition(
    targetRef,
    panelRef,
    present,
    placement,
    offsetValue,
    viewportPaddingValue,
  )

  const rootContext =
    useMemo(
      () => ({
        rootId,
        closeAll,
        closeOnSelect,
        submenuOffset:
          submenuOffsetValue,
        viewportPadding:
          viewportPaddingValue,
      }),
      [
        closeAll,
        closeOnSelect,
        rootId,
        submenuOffsetValue,
        viewportPaddingValue,
      ],
    )

  const handleKeyDown = (
    event:
      KeyboardEvent<HTMLDivElement>,
  ) => {
    viewProps.onKeyDown?.(
      event,
    )

    if (
      event.defaultPrevented
    ) {
      return
    }

    if (
      event.key === 'Escape'
    ) {
      event.preventDefault()
      event.stopPropagation()
      closeAll()
    }
  }

  const handleTransitionEnd = (
    event:
      TransitionEvent<HTMLDivElement>,
  ) => {
    viewProps.onTransitionEnd?.(
      event,
    )

    if (
      event.target !==
        event.currentTarget ||
      resolvedOpen ||
      visualState !== 'closing'
    ) {
      return
    }

    finishExit()
  }

  const portal =
    present &&
    typeof document !==
      'undefined'
      ? createPortal(
          <ThemeProvider
            theme={theme}
            mode={mode}
          >
            <MenuRootContext.Provider
              value={rootContext}
            >
              <MenuSurface
                panelRef={panelRef}
                viewProps={
                  viewProps
                }
                rootId={rootId}
                levelId={levelId}
                closeLevel={
                  closeAll
                }
                active={
                  resolvedOpen
                }
                placement={
                  resolvedPlacement
                }
                positioned={
                  positioned
                }
                placementStyle={
                  placementStyle
                }
                visualState={
                  visualState
                }
                themeClassName={
                  themeClassName
                }
                reducedMotion={
                  reducedMotion
                }
                id={menuId}
                onKeyDown={
                  handleKeyDown
                }
                onTransitionEnd={
                  handleTransitionEnd
                }
              >
                {children}
              </MenuSurface>
            </MenuRootContext.Provider>
          </ThemeProvider>,
          document.body,
        )
      : null

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
