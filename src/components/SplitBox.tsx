import {
  Children,
  type CSSProperties,
  isValidElement,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  SplitBoxCollapsed,
  SplitBoxCollapsible,
  SplitBoxDirection,
  SplitBoxProps,
} from '../core/splitbox-types'
import { length } from '../core/values'
import type { Length, ViewProps } from '../core/view-types'
import { resolveSplitBoxTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSplitBoxStylesheet } from '../renderers/dom/splitbox-stylesheet'
import { useTheme } from '../theme/theme-context'
import { cssLengthPixels } from './internal/css-length-pixels'
import { SplitBoxPaneContext } from './internal/splitbox-context'
import { useViewHost } from './internal/use-view-host'
import { SplitBoxPane } from './SplitBoxPane'

type CollapsedPane = 'start' | 'end' | null

function collapsedPane(value: SplitBoxCollapsed): CollapsedPane {
  return value === false ? null : value
}

function publicCollapsed(value: CollapsedPane): SplitBoxCollapsed {
  return value ?? false
}

interface DragGeometry {
  pointerId: number
  pointerStart: number
  initialStart: number
  available: number
  lower: number
  upper: number
  collapseThreshold: number
  expandThreshold: number
  collapsed: CollapsedPane
  raw: number
}

interface MeasuredGeometry {
  start: number
  end: number
  available: number
  lower: number
  upper: number
  collapseThreshold: number
  expandThreshold: number
}

function allowsStartCollapse(collapsible: SplitBoxCollapsible): boolean {
  return collapsible === 'start' || collapsible === 'both'
}

function allowsEndCollapse(collapsible: SplitBoxCollapsible): boolean {
  return collapsible === 'end' || collapsible === 'both'
}

function axisValue(direction: SplitBoxDirection, x: number, y: number): number {
  return direction === 'horizontal' ? x : y
}

function axisSize(direction: SplitBoxDirection, rect: DOMRect): number {
  return direction === 'horizontal' ? rect.width : rect.height
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function pixelValue(value: number): string {
  return `${Math.max(0, value)}px`
}

function measureLength(
  root: HTMLDivElement,
  value: Length | undefined,
  direction: SplitBoxDirection,
  fallback: number,
  referencePixels?: number,
): number {
  if (value === undefined) return fallback

  const resolved = length(value)
  if (resolved === undefined) return fallback

  const measured = cssLengthPixels(
    root,
    resolved,
    direction === 'horizontal' ? 'width' : 'height',
    referencePixels,
  )
  return Number.isFinite(measured) ? measured : fallback
}

function assertPaneChildren(children: SplitBoxProps['children']): [ReactElement, ReactElement] {
  const items = Children.toArray(children)

  if (
    items.length !== 2 ||
    !items.every((child) => isValidElement(child) && child.type === SplitBoxPane)
  ) {
    throw new Error('SplitBox requires exactly two direct SplitBoxPane children')
  }

  return items as [ReactElement, ReactElement]
}

export function SplitBox(props: SplitBoxProps): import('react').JSX.Element {
  const {
    children,
    direction = 'horizontal',
    minStart = 0,
    maxStart = '100%',
    minEnd = 0,
    maxEnd = '100%',
    collapsible = false,
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    collapseThreshold = 0,
    expandThreshold = collapseThreshold,
    step = 0.5,
    thickness,
    disabled = false,
    onChange,
    viewProps = {},
  } = props

  const panes = assertPaneChildren(children)
  const controlled = props.size !== undefined
  const [uncontrolledSize, setUncontrolledSize] = useState<Length>(() =>
    controlled ? props.size : props.defaultSize,
  )
  const resolvedSize = controlled ? props.size : uncontrolledSize
  const [dragSize, setDragSize] = useState<number | null>(null)
  const collapsedControlled = controlledCollapsed !== undefined
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState<SplitBoxCollapsed>(defaultCollapsed)
  const resolvedCollapsed = collapsedPane(
    collapsedControlled ? controlledCollapsed : uncontrolledCollapsed,
  )
  const [dragCollapsed, setDragCollapsed] = useState<CollapsedPane | undefined>(undefined)
  const effectiveCollapsed = dragCollapsed === undefined ? resolvedCollapsed : dragCollapsed
  const [valuePercent, setValuePercent] = useState<number | null>(null)
  const dragRef = useRef<DragGeometry | null>(null)

  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass('splitbox-theme', resolveSplitBoxTheme(theme))

  const hostProps: ViewProps<HTMLDivElement> = {
    ...viewProps,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(ensureSplitBoxStylesheet, [])

  const readGeometry = useCallback((): MeasuredGeometry | null => {
    const root = elementRef.current
    if (root === null) return null

    const startPane = root.querySelector<HTMLElement>(
      ':scope > [data-weave-splitbox-pane-position="start"]',
    )
    const endPane = root.querySelector<HTMLElement>(
      ':scope > [data-weave-splitbox-pane-position="end"]',
    )

    if (startPane === null || endPane === null) return null

    const start = axisSize(direction, startPane.getBoundingClientRect())
    const end = axisSize(direction, endPane.getBoundingClientRect())
    const available = Math.max(0, start + end)

    const minStartPx = measureLength(root, minStart, direction, 0, available)
    const maxStartPx = measureLength(root, maxStart, direction, available, available)
    const minEndPx = measureLength(root, minEnd, direction, 0, available)
    const maxEndPx = measureLength(root, maxEnd, direction, available, available)
    const collapseThresholdPx = clamp(
      measureLength(root, collapseThreshold, direction, 0, available),
      0,
      available,
    )
    const expandThresholdPx = clamp(
      measureLength(root, expandThreshold, direction, collapseThresholdPx, available),
      0,
      available,
    )

    const lower = clamp(Math.max(minStartPx, available - maxEndPx), 0, available)
    const upper = clamp(Math.min(maxStartPx, available - minEndPx), lower, available)

    return {
      start,
      end,
      available,
      lower,
      upper,
      collapseThreshold: collapseThresholdPx,
      expandThreshold: expandThresholdPx,
    }
  }, [
    collapseThreshold,
    direction,
    elementRef,
    expandThreshold,
    maxEnd,
    maxStart,
    minEnd,
    minStart,
  ])

  const syncValuePercent = useCallback(() => {
    const geometry = readGeometry()
    if (geometry === null) return

    const percent =
      geometry.available <= 0 ? 0 : clamp((geometry.start / geometry.available) * 100, 0, 100)
    setValuePercent(percent)
  }, [readGeometry])

  const requestCollapsed = useCallback(
    (next: CollapsedPane) => {
      const current = dragRef.current?.collapsed ?? resolvedCollapsed
      if (current === next) return

      if (!collapsedControlled) {
        setUncontrolledCollapsed(publicCollapsed(next))
      }

      onCollapsedChange?.(publicCollapsed(next))
    },
    [collapsedControlled, onCollapsedChange, resolvedCollapsed],
  )

  useEffect(() => {
    const root = elementRef.current
    if (root === null) return

    const frame = requestAnimationFrame(syncValuePercent)
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(syncValuePercent)

    observer?.observe(root)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [effectiveCollapsed, elementRef, resolvedSize, syncValuePercent])

  const commitSize = useCallback(
    (next: number) => {
      const nextSize = pixelValue(next)

      if (!controlled) {
        setUncontrolledSize(nextSize)
      }

      onChange?.(nextSize)
    },
    [controlled, onChange],
  )

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return

    const geometry = readGeometry()
    if (geometry === null) return

    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)

    dragRef.current = {
      pointerId: event.pointerId,
      pointerStart: axisValue(direction, event.clientX, event.clientY),
      initialStart: geometry.start,
      available: geometry.available,
      lower: geometry.lower,
      upper: geometry.upper,
      collapseThreshold: geometry.collapseThreshold,
      expandThreshold: geometry.expandThreshold,
      collapsed: resolvedCollapsed,
      raw: geometry.start,
    }
    setDragCollapsed(resolvedCollapsed)
    setDragSize(geometry.start)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return

    const pointer = axisValue(direction, event.clientX, event.clientY)
    const raw = clamp(drag.initialStart + pointer - drag.pointerStart, 0, drag.available)
    drag.raw = raw

    let visible = clamp(raw, drag.lower, drag.upper)

    if (drag.collapsed === 'start') {
      if (raw < drag.expandThreshold) {
        visible = 0
      } else {
        requestCollapsed(null)
        drag.collapsed = null
        setDragCollapsed(null)
        visible = clamp(raw, drag.lower, drag.upper)
      }
    } else if (drag.collapsed === 'end') {
      if (drag.available - raw < drag.expandThreshold) {
        visible = drag.available
      } else {
        requestCollapsed(null)
        drag.collapsed = null
        setDragCollapsed(null)
        visible = clamp(raw, drag.lower, drag.upper)
      }
    } else if (allowsStartCollapse(collapsible) && raw <= drag.collapseThreshold) {
      requestCollapsed('start')
      drag.collapsed = 'start'
      setDragCollapsed('start')
      visible = 0
    } else if (allowsEndCollapse(collapsible) && drag.available - raw <= drag.collapseThreshold) {
      requestCollapsed('end')
      drag.collapsed = 'end'
      setDragCollapsed('end')
      visible = drag.available
    } else if (raw < drag.lower && allowsStartCollapse(collapsible)) {
      visible = drag.lower
    } else if (raw > drag.upper && allowsEndCollapse(collapsible)) {
      visible = drag.upper
    }

    setDragSize(visible)
    setValuePercent(drag.available <= 0 ? 0 : (visible / drag.available) * 100)
    onChange?.(pixelValue(visible))
  }

  const finishPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return

    const nextCollapsed = drag.collapsed
    const next =
      nextCollapsed === 'start'
        ? 0
        : nextCollapsed === 'end'
          ? drag.available
          : clamp(drag.raw, drag.lower, drag.upper)

    requestCollapsed(nextCollapsed)
    dragRef.current = null
    setDragSize(null)
    setDragCollapsed(undefined)
    setValuePercent(drag.available <= 0 ? 0 : (next / drag.available) * 100)
    commitSize(next)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return

    let sign = 0

    if (direction === 'horizontal') {
      if (event.key === 'ArrowLeft') sign = -1
      if (event.key === 'ArrowRight') sign = 1
    } else {
      if (event.key === 'ArrowUp') sign = -1
      if (event.key === 'ArrowDown') sign = 1
    }

    if (sign === 0) return

    const geometry = readGeometry()
    const root = elementRef.current
    if (geometry === null || root === null) return

    event.preventDefault()

    const stepPx = Math.max(0, measureLength(root, step, direction, 0, geometry.available))
    const next = clamp(geometry.start + stepPx * sign, geometry.lower, geometry.upper)

    requestCollapsed(null)
    setValuePercent(geometry.available <= 0 ? 0 : (next / geometry.available) * 100)
    commitSize(next)
  }

  const semanticDeclarations = useMemo(
    () =>
      ({
        '--weave-splitbox-size': length(resolvedSize),
        '--weave-splitbox-min-start': length(minStart),
        '--weave-splitbox-max-start': length(maxStart),
        '--weave-splitbox-min-end': length(minEnd),
        '--weave-splitbox-max-end': length(maxEnd),
        '--weave-splitbox-thickness':
          thickness === undefined ? 'var(--weave-splitbox-theme-thickness)' : length(thickness),
      }) as CSSProperties,
    [maxEnd, maxStart, minEnd, minStart, resolvedSize, thickness],
  )
  const semanticClassName = useRuntimeStyleClass('splitbox-props', semanticDeclarations)
  const dragStyle = useMemo(
    () =>
      ({
        '--weave-splitbox-drag-size': dragSize === null ? undefined : pixelValue(dragSize),
      }) as CSSProperties,
    [dragSize],
  )

  const startPaneContext = useMemo(
    () => ({
      position: 'start' as const,
      collapsed: effectiveCollapsed === 'start',
    }),
    [effectiveCollapsed],
  )
  const endPaneContext = useMemo(
    () => ({
      position: 'end' as const,
      collapsed: effectiveCollapsed === 'end',
    }),
    [effectiveCollapsed],
  )

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-splitbox=""
      data-weave-splitbox-direction={direction}
      data-weave-splitbox-dragging={dragSize === null ? 'false' : 'true'}
      data-weave-splitbox-collapsed={effectiveCollapsed ?? 'false'}
      data-weave-splitbox-disabled={disabled ? 'true' : 'false'}
      data-weave-layout={resolved.layout}
      className={['weave-splitbox', themeClassName, semanticClassName, className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...dragStyle, ...inlineStyle }}
    >
      <SplitBoxPaneContext.Provider value={startPaneContext}>
        {panes[0]}
      </SplitBoxPaneContext.Provider>

      <div
        role="separator"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valuePercent === null ? undefined : valuePercent}
        data-weave-splitbox-splitter=""
        data-weave-splitbox-splitter-active={dragSize === null ? 'false' : 'true'}
        data-weave-reduced-motion={reducedMotion}
        className="weave-splitbox-splitter"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onPointerCancel={finishPointerDrag}
        onKeyDown={handleKeyDown}
      />

      <SplitBoxPaneContext.Provider value={endPaneContext}>{panes[1]}</SplitBoxPaneContext.Provider>
    </div>
  )
}
