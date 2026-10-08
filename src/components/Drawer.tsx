import { type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ModalDialogViewProps } from '../core/dialog-types'
import type { DrawerMode, DrawerProps, DrawerSide } from '../core/drawer-types'
import type { SplitBoxCollapsed, SplitBoxDirection } from '../core/splitbox-types'
import { length } from '../core/values'
import type { Length, ViewProps } from '../core/view-types'
import { useWeaveDocument, useWeaveWindow } from '../renderers/dom/document-context'
import { ensureDrawerStylesheet } from '../renderers/dom/drawer-stylesheet'
import { resolveDrawerTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { useDocumentMediaQuery } from '../theme/use-media-query'
import { Dialog } from './Dialog'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { assignRef } from './internal/assign-ref'
import { cssLengthPixels } from './internal/css-length-pixels'
import { useControllableBoolean } from './internal/use-controllable-boolean'
import { SplitBox } from './SplitBox'
import { SplitBoxPane } from './SplitBoxPane'
import { View } from './View'

const DEFAULT_SIZE: Length = 20
const DEFAULT_MIN_SIZE: Length = 12
const DEFAULT_COLLAPSE_THRESHOLD: Length = 2
const DEFAULT_EXPAND_THRESHOLD: Length = 4
const DEFAULT_CLOSE_THRESHOLD: Length = 4

interface DrawerDragState {
  pointerId: number
  start: number
  offset: number
}

function motionDurationMilliseconds(value: string | number | undefined): number {
  if (typeof value === 'number') return Math.max(0, value)
  if (typeof value !== 'string') return 0

  const trimmed = value.trim()
  const parsed = Number.parseFloat(trimmed)
  if (!Number.isFinite(parsed)) return 0
  if (trimmed.endsWith('ms')) return Math.max(0, parsed)
  if (trimmed.endsWith('s')) return Math.max(0, parsed * 1000)
  return Math.max(0, parsed)
}

function drawerPosition(side: DrawerSide): Exclude<SplitBoxCollapsed, false> {
  return side === 'left' || side === 'top' ? 'start' : 'end'
}

function drawerDirection(side: DrawerSide): SplitBoxDirection {
  return side === 'left' || side === 'right' ? 'horizontal' : 'vertical'
}

function pointerAxis(side: DrawerSide, event: PointerEvent<HTMLElement>): number {
  return side === 'left' || side === 'right' ? event.clientX : event.clientY
}

function closeDistance(side: DrawerSide, start: number, current: number): number {
  switch (side) {
    case 'left':
    case 'top':
      return Math.max(0, start - current)
    case 'right':
    case 'bottom':
      return Math.max(0, current - start)
  }
}

function axisSize(direction: SplitBoxDirection, rect: DOMRect): number {
  return direction === 'horizontal' ? rect.width : rect.height
}

function measureLength(root: HTMLElement, value: Length, direction: SplitBoxDirection): number {
  const resolved = length(value)
  if (resolved === undefined) return 0

  const measured = cssLengthPixels(
    root,
    resolved,
    direction === 'horizontal' ? 'width' : 'height',
    axisSize(direction, root.getBoundingClientRect()),
  )
  return Number.isFinite(measured) ? measured : 0
}

function useWideBreakpoint(minWidth: number | undefined): boolean {
  const query = minWidth === undefined ? null : `(min-width: ${minWidth}rem)`
  return useDocumentMediaQuery(query)
}

function modalGeometry(
  side: DrawerSide,
  size: Length,
  maxWidth: Length | undefined,
): Partial<ModalDialogViewProps> {
  const common = {
    position: 'fixed' as const,
    margin: 0,
    maxHeight: '100vh',
  }

  switch (side) {
    case 'left':
      return {
        ...common,
        top: 0,
        bottom: 0,
        left: 0,
        right: 'auto',
        width: size,
        maxWidth: maxWidth ?? '100vw',
        height: 'fill',
      }
    case 'right':
      return {
        ...common,
        top: 0,
        bottom: 0,
        right: 0,
        left: 'auto',
        width: size,
        maxWidth: maxWidth ?? '100vw',
        height: 'fill',
      }
    case 'top':
      return {
        ...common,
        top: 0,
        left: 0,
        right: 0,
        bottom: 'auto',
        width: 'fill',
        maxWidth: '100vw',
        height: size,
      }
    case 'bottom':
      return {
        ...common,
        bottom: 0,
        left: 0,
        right: 0,
        top: 'auto',
        width: 'fill',
        maxWidth: '100vw',
        height: size,
      }
  }
}

function paneAvailableSize(root: HTMLDivElement, direction: SplitBoxDirection): number | null {
  const start = root.querySelector<HTMLElement>(
    ':scope > [data-weave-splitbox-pane-position="start"]',
  )
  const end = root.querySelector<HTMLElement>(':scope > [data-weave-splitbox-pane-position="end"]')

  if (start === null || end === null) return null
  return (
    axisSize(direction, start.getBoundingClientRect()) +
    axisSize(direction, end.getBoundingClientRect())
  )
}

export function Drawer(props: DrawerProps): import('react').JSX.Element {
  const {
    children,
    drawer,
    side = 'right',
    mode = 'auto',
    breakpoint = 'md',
    open,
    defaultOpen = false,
    onOpenChange,
    onSizeChange,
    minSize = DEFAULT_MIN_SIZE,
    collapseThreshold = DEFAULT_COLLAPSE_THRESHOLD,
    expandThreshold = DEFAULT_EXPAND_THRESHOLD,
    closeThreshold = DEFAULT_CLOSE_THRESHOLD,
    resizable = true,
    closeOnEscape = true,
    closeOnBackdrop = true,
    initialFocus,
    restoreFocus = true,
    viewProps = {},
    drawerViewProps = {},
  } = props

  const { theme, reducedMotion } = useTheme()
  const ownerDocument = useWeaveDocument()
  const ownerWindow = useWeaveWindow()
  const breakpointWidth = mode === 'auto' ? theme.breakpoints[breakpoint] : undefined
  const mdWidth = theme.breakpoints.md
  const fadeDurationMs = motionDurationMilliseconds(theme.tokens.motion?.duration?.fast)

  if (mode === 'auto' && !Number.isFinite(breakpointWidth)) {
    throw new Error(`Drawer breakpoint "${breakpoint}" does not exist in the current theme`)
  }

  const wide = useWideBreakpoint(breakpointWidth)
  const mdWide = useWideBreakpoint(mdWidth)
  const effectiveMode: Exclude<DrawerMode, 'auto'> =
    mode === 'auto' ? (wide ? 'non-modal' : 'modal') : mode
  const modalSwipeEnabled = effectiveMode === 'modal' && !mdWide

  const { value: resolvedOpen, request: requestOpen } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )

  const [previousEffectiveMode, setPreviousEffectiveMode] = useState(effectiveMode)
  const enteringClosedNonModal =
    previousEffectiveMode !== effectiveMode && effectiveMode === 'non-modal' && !resolvedOpen

  const [nonModalPresent, setNonModalPresent] = useState(resolvedOpen)
  const [nonModalVisibility, setNonModalVisibility] = useState<
    'closed' | 'opening' | 'open' | 'closing'
  >(resolvedOpen ? 'open' : 'closed')

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    const modeChanged = previousEffectiveMode !== effectiveMode
    if (modeChanged) {
      setPreviousEffectiveMode(effectiveMode)
    }

    if (effectiveMode !== 'non-modal') return

    if (modeChanged && !resolvedOpen) {
      setNonModalVisibility('closed')
      setNonModalPresent(false)
      return
    }

    if (resolvedOpen) {
      setNonModalPresent(true)
      if (reducedMotion) {
        setNonModalVisibility('open')
        return
      }

      setNonModalVisibility('opening')
      const view = ownerWindow
      const frame = view?.requestAnimationFrame(() => setNonModalVisibility('open'))
      if (frame === undefined || view === null) {
        setNonModalVisibility('open')
        return
      }
      return () => view.cancelAnimationFrame(frame)
    }

    if (!nonModalPresent) {
      setNonModalVisibility('closed')
      return
    }

    if (reducedMotion) {
      setNonModalVisibility('closed')
      setNonModalPresent(false)
      return
    }

    setNonModalVisibility('closing')
    if (ownerWindow === null) {
      setNonModalVisibility('closed')
      setNonModalPresent(false)
      return
    }

    const timeout = ownerWindow.setTimeout(() => {
      setNonModalVisibility('closed')
      setNonModalPresent(false)
    }, fadeDurationMs)
    return () => ownerWindow.clearTimeout(timeout)
  }, [
    effectiveMode,
    fadeDurationMs,
    nonModalPresent,
    previousEffectiveMode,
    reducedMotion,
    resolvedOpen,
    ownerWindow,
  ])
  /* oxlint-enable react/set-state-in-effect */

  const sizeControlled = props.size !== undefined
  const [uncontrolledSize, setUncontrolledSize] = useState<Length>(
    sizeControlled ? props.size : (props.defaultSize ?? DEFAULT_SIZE),
  )
  const resolvedSize = sizeControlled ? props.size : uncontrolledSize

  const requestSize = useCallback(
    (next: string) => {
      if (!sizeControlled) {
        setUncontrolledSize(next)
      }
      onSizeChange?.(next)
    },
    [onSizeChange, sizeControlled],
  )

  const direction = drawerDirection(side)
  const position = drawerPosition(side)
  const drawerMaxWidth = theme.components.Drawer?.base?.maxWidth ?? '360px'
  const drawerStarts = position === 'start'
  const drawerSizeCSS = length(resolvedSize) ?? length(DEFAULT_SIZE) ?? '20rem'
  const splitSize = drawerStarts
    ? drawerSizeCSS
    : `calc(100% - var(--weave-splitbox-thickness) - ${drawerSizeCSS})`

  const splitRootRef = useRef<HTMLDivElement | null>(null)
  const modalDialogRef = useRef<HTMLDialogElement | null>(null)
  const nonModalMountRef = useRef<HTMLDivElement | null>(null)
  const modalMountRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<DrawerDragState | null>(null)
  const [dragging, setDragging] = useState(false)
  const contentHost = useMemo(() => {
    if (ownerDocument === null) return null
    const host = ownerDocument.createElement('div')
    host.className = 'weave-drawer-content-host'
    host.dataset.weaveDrawerContentHost = ''
    return host
  }, [ownerDocument])

  const themeClassName = useRuntimeStyleClass('drawer-theme', resolveDrawerTheme(theme))
  useStaticStylesheet(ensureDrawerStylesheet)

  const { ref: rootUserRef, ...restRootViewProps } = viewProps
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      splitRootRef.current = node
      assignRef(rootUserRef, node)
    },
    [rootUserRef],
  )

  const {
    className: drawerClassName,
    data: drawerData,
    style: drawerStyle,
    onPointerDown: drawerOnPointerDown,
    onPointerMove: drawerOnPointerMove,
    onPointerUp: drawerOnPointerUp,
    onPointerCancel: drawerOnPointerCancel,
    ...restDrawerViewProps
  } = drawerViewProps

  const modalRef = useCallback((node: HTMLDialogElement | null) => {
    modalDialogRef.current = node
  }, [])

  const setNonModalMountRef = useCallback(
    (node: HTMLDivElement | null) => {
      nonModalMountRef.current = node
      if (
        node !== null &&
        effectiveMode === 'non-modal' &&
        contentHost !== null &&
        contentHost.parentElement !== node
      ) {
        node.appendChild(contentHost)
      }
    },
    [contentHost, effectiveMode],
  )

  const setModalMountRef = useCallback(
    (node: HTMLDivElement | null) => {
      modalMountRef.current = node
      if (
        node !== null &&
        effectiveMode === 'modal' &&
        contentHost !== null &&
        contentHost.parentElement !== node
      ) {
        node.appendChild(contentHost)
      }
    },
    [contentHost, effectiveMode],
  )

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (modalSwipeEnabled) return

    dragRef.current = null
    modalDialogRef.current?.style.removeProperty('--weave-drawer-drag-offset')
    setDragging(false)
  }, [modalSwipeEnabled])
  /* oxlint-enable react/set-state-in-effect */

  const handleSplitSizeChange = useCallback(
    (nextStartSize: string) => {
      if (effectiveMode !== 'non-modal') return

      const startPixels = Number.parseFloat(nextStartSize)
      if (!Number.isFinite(startPixels)) return

      let drawerPixels = startPixels

      if (!drawerStarts) {
        const root = splitRootRef.current
        if (root === null) return
        const available = paneAvailableSize(root, direction)
        if (available === null) return
        drawerPixels = Math.max(0, available - startPixels)
      }

      if (drawerPixels <= 0) return
      requestSize(`${drawerPixels}px`)
    },
    [direction, drawerStarts, effectiveMode, requestSize],
  )

  const handleCollapsedChange = useCallback(
    (next: SplitBoxCollapsed) => {
      if (effectiveMode !== 'non-modal') return

      if (next === position) {
        requestOpen(false)
        return
      }

      if (next === false) {
        requestOpen(true)
      }
    },
    [effectiveMode, position, requestOpen],
  )

  const beginDrawerDrag = useCallback(
    (event: PointerEvent<HTMLDialogElement>) => {
      if (!modalSwipeEnabled || !resolvedOpen || event.button !== 0) return

      const dialog = modalDialogRef.current
      if (dialog === null) return

      const rect = dialog.getBoundingClientRect()
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return
      }

      dragRef.current = {
        pointerId: event.pointerId,
        start: pointerAxis(side, event),
        offset: 0,
      }
      dialog.style.setProperty('--weave-drawer-drag-offset', '0px')
    },
    [modalSwipeEnabled, resolvedOpen, side],
  )

  const moveDrawerDrag = useCallback(
    (event: PointerEvent<HTMLDialogElement>) => {
      const drag = dragRef.current
      if (drag === null || drag.pointerId !== event.pointerId) return

      const offset = closeDistance(side, drag.start, pointerAxis(side, event))
      drag.offset = offset

      if (offset <= 0) return

      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.setPointerCapture?.(event.pointerId)
      }
      event.preventDefault()
      setDragging(true)
      modalDialogRef.current?.style.setProperty('--weave-drawer-drag-offset', `${offset}px`)
    },
    [side],
  )

  const finishDrawerDrag = useCallback(
    (event: PointerEvent<HTMLDialogElement>, cancelled: boolean) => {
      const drag = dragRef.current
      if (drag === null || drag.pointerId !== event.pointerId) return

      const dialog = modalDialogRef.current
      const threshold =
        dialog === null
          ? Number.POSITIVE_INFINITY
          : measureLength(dialog, closeThreshold, direction)

      dragRef.current = null
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture?.(event.pointerId)
      }
      setDragging(false)

      if (!cancelled && drag.offset >= threshold) {
        requestOpen(false)
      }

      dialog?.style.removeProperty('--weave-drawer-drag-offset')
    },
    [closeThreshold, direction, requestOpen],
  )

  const rootViewProps: ViewProps<HTMLDivElement> = {
    width: 'fill',
    height: 'fill',
    ...restRootViewProps,
    ref: setRootRef,
  }

  const surfaceClassName = ['weave-drawer-surface', themeClassName, drawerClassName]
    .filter(Boolean)
    .join(' ')

  const surfaceData = {
    ...drawerData,
    'weave-drawer-surface': '',
    'weave-drawer-side': side,
  }

  const nonModalSurfaceViewProps: ViewProps<HTMLDivElement> = {
    width: 'fill',
    height: 'fill',
    overflow: 'auto',
    ...restDrawerViewProps,
    onPointerDown: drawerOnPointerDown,
    onPointerMove: drawerOnPointerMove,
    onPointerUp: drawerOnPointerUp,
    onPointerCancel: drawerOnPointerCancel,
    pointerEvents: resolvedOpen ? undefined : 'none',
    className: [surfaceClassName, 'weave-drawer-surface--non-modal'].filter(Boolean).join(' '),
    style: drawerStyle,
    data: {
      ...surfaceData,
      'weave-drawer-mode': 'non-modal',
      'weave-drawer-visibility': nonModalVisibility,
    },
  }

  const modalViewProps = {
    ...restDrawerViewProps,
    ...modalGeometry(side, resolvedSize, drawerMaxWidth),
    onPointerDown: (event: PointerEvent<HTMLDialogElement>) => {
      drawerOnPointerDown?.(event as unknown as PointerEvent<HTMLDivElement>)
      if (!event.defaultPrevented) beginDrawerDrag(event)
    },
    onPointerMove: (event: PointerEvent<HTMLDialogElement>) => {
      drawerOnPointerMove?.(event as unknown as PointerEvent<HTMLDivElement>)
      if (!event.defaultPrevented) moveDrawerDrag(event)
    },
    onPointerUp: (event: PointerEvent<HTMLDialogElement>) => {
      drawerOnPointerUp?.(event as unknown as PointerEvent<HTMLDivElement>)
      finishDrawerDrag(event, false)
    },
    onPointerCancel: (event: PointerEvent<HTMLDialogElement>) => {
      drawerOnPointerCancel?.(event as unknown as PointerEvent<HTMLDivElement>)
      finishDrawerDrag(event, true)
    },
    ref: modalRef,
    className: [surfaceClassName, 'weave-drawer-surface--modal', 'weave-scroll-host']
      .filter(Boolean)
      .join(' '),
    style: drawerStyle,
    data: {
      ...surfaceData,
      'weave-drawer-mode': 'modal',
      'weave-drawer-dragging': dragging ? 'true' : 'false',
      'weave-drawer-swipe-enabled': modalSwipeEnabled ? 'true' : 'false',
      'weave-scroll-host': '',
    },
  } as unknown as ModalDialogViewProps

  const collapsed: SplitBoxCollapsed =
    effectiveMode === 'modal' || enteringClosedNonModal || !nonModalPresent ? position : false

  const drawerPane = (
    <SplitBoxPane viewProps={{ className: 'weave-drawer-pane' }}>
      <View {...nonModalSurfaceViewProps}>
        <div ref={setNonModalMountRef} className="weave-drawer-content-mount" />
      </View>
    </SplitBoxPane>
  )

  const mainPane = <SplitBoxPane>{children}</SplitBoxPane>

  return (
    <>
      <SplitBox
        direction={direction}
        size={splitSize}
        minStart={drawerStarts ? minSize : 0}
        minEnd={drawerStarts ? 0 : minSize}
        maxStart={direction === 'horizontal' && drawerStarts ? drawerMaxWidth : undefined}
        maxEnd={direction === 'horizontal' && !drawerStarts ? drawerMaxWidth : undefined}
        collapsible={effectiveMode === 'non-modal' ? position : false}
        collapsed={collapsed}
        onCollapsedChange={handleCollapsedChange}
        collapseThreshold={collapseThreshold}
        expandThreshold={expandThreshold}
        disabled={effectiveMode === 'modal' || !resizable}
        thickness={0}
        onChange={handleSplitSizeChange}
        viewProps={rootViewProps}
      >
        {drawerStarts ? drawerPane : mainPane}
        {drawerStarts ? mainPane : drawerPane}
      </SplitBox>

      {effectiveMode === 'modal' ? (
        <>
          <Dialog
            modal
            open={resolvedOpen}
            onOpenChange={requestOpen}
            closeOnEscape={closeOnEscape}
            closeOnBackdrop={closeOnBackdrop}
            initialFocus={initialFocus}
            restoreFocus={restoreFocus}
            viewProps={modalViewProps}
          >
            <div ref={setModalMountRef} className="weave-drawer-content-mount" />
          </Dialog>
          <AutoScrollbar
            targetRef={modalDialogRef}
            config={drawerViewProps.scrollbar}
            overflowIntent={{}}
          />
        </>
      ) : null}

      {contentHost === null ? null : createPortal(drawer, contentHost)}
    </>
  )
}
