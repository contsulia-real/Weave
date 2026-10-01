import {
  type PointerEvent,
  useCallback,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import type { ModalDialogViewProps } from '../core/dialog-types'
import type { DrawerMode, DrawerProps, DrawerSide } from '../core/drawer-types'
import type { SplitBoxCollapsed, SplitBoxDirection } from '../core/splitbox-types'
import { length } from '../core/values'
import type { Length, ViewProps } from '../core/view-types'
import { ensureDrawerStylesheet } from '../renderers/dom/drawer-stylesheet'
import { resolveDrawerTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { Dialog } from './Dialog'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { assignRef } from './internal/assign-ref'
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

  const probe = document.createElement('div')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.boxSizing = 'border-box'
  probe.style.margin = '0'
  probe.style.padding = '0'
  probe.style.border = '0'

  if (direction === 'horizontal') {
    probe.style.width = resolved
    probe.style.height = '0'
  } else {
    probe.style.width = '0'
    probe.style.height = resolved
  }

  root.appendChild(probe)
  const measured = axisSize(direction, probe.getBoundingClientRect())
  probe.remove()

  return Number.isFinite(measured) ? measured : 0
}

function useWideBreakpoint(minWidth: number | undefined): boolean {
  const query = minWidth === undefined ? null : `(min-width: ${minWidth}rem)`

  return useSyncExternalStore(
    (notify) => {
      if (
        query === null ||
        typeof window === 'undefined' ||
        typeof window.matchMedia !== 'function'
      ) {
        return () => undefined
      }

      const media = window.matchMedia(query)
      media.addEventListener('change', notify)
      return () => media.removeEventListener('change', notify)
    },
    () => {
      if (
        query === null ||
        typeof window === 'undefined' ||
        typeof window.matchMedia !== 'function'
      ) {
        return false
      }
      return window.matchMedia(query).matches
    },
    () => false,
  )
}

function modalGeometry(side: DrawerSide, size: Length): Partial<ModalDialogViewProps> {
  const common = {
    position: 'fixed' as const,
    margin: 0,
    maxWidth: '100vw',
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

export function Drawer(props: DrawerProps) {
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

  const { theme } = useTheme()
  const breakpointWidth = mode === 'auto' ? theme.breakpoints[breakpoint] : undefined

  if (mode === 'auto' && !Number.isFinite(breakpointWidth)) {
    throw new Error(`Drawer breakpoint "${breakpoint}" does not exist in the current theme`)
  }

  const wide = useWideBreakpoint(breakpointWidth)
  const effectiveMode: Exclude<DrawerMode, 'auto'> =
    mode === 'auto' ? (wide ? 'non-modal' : 'modal') : mode

  const { value: resolvedOpen, request: requestOpen } = useControllableBoolean(
    open,
    defaultOpen,
    onOpenChange,
  )

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
  const [contentHost] = useState<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') return null
    const host = document.createElement('div')
    host.className = 'weave-drawer-content-host'
    host.dataset.weaveDrawerContentHost = ''
    return host
  })

  const themeClassName = useRuntimeStyleClass('drawer-theme', resolveDrawerTheme(theme))
  useInsertionEffect(ensureDrawerStylesheet, [])

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

  useLayoutEffect(() => {
    if (effectiveMode === 'modal' && resolvedOpen) {
      initialFocus?.current?.focus()
    }
  }, [effectiveMode, initialFocus, resolvedOpen])

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (effectiveMode === 'modal') return

    dragRef.current = null
    setDragging(false)
  }, [effectiveMode])
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
      if (effectiveMode !== 'modal' || !resolvedOpen || event.button !== 0) return

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
    [effectiveMode, resolvedOpen, side],
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
    className: [surfaceClassName, 'weave-drawer-surface--non-modal'].filter(Boolean).join(' '),
    style: drawerStyle,
    data: {
      ...surfaceData,
      'weave-drawer-mode': 'non-modal',
    },
  }

  const modalViewProps = {
    ...restDrawerViewProps,
    ...modalGeometry(side, resolvedSize),
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
      'weave-scroll-host': '',
    },
  } as unknown as ModalDialogViewProps

  const collapsed: SplitBoxCollapsed = effectiveMode === 'modal' || !resolvedOpen ? position : false

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
