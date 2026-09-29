import type { CSSProperties, ReactNode, RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ListOrientation } from '../../core/list-types'
import { Divider } from '../Divider'
import { Flex } from '../Flex'
import { View } from '../View'
import {
  createVirtualLayout,
  readVirtualViewport,
  sameVirtualViewport,
  type VirtualMeasurement,
  type VirtualViewport,
  visibleVirtualIndices,
} from './virtual-list-layout'

export interface VirtualListEntry {
  id: string
  node: ReactNode
}

interface VirtualListWindowProps {
  entries: readonly VirtualListEntry[]
  orientation: ListOrientation
  rootRef: RefObject<HTMLDivElement | null>
  focusId: string | null
  showDividers: boolean
}

function VirtualItem({
  entry,
  index,
  offset,
  orientation,
  onMeasure,
  showDivider,
}: {
  entry: VirtualListEntry
  index: number
  offset: number
  orientation: ListOrientation
  onMeasure(id: string, measurement: VirtualMeasurement): void
  showDivider: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (element === null) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const main =
        orientation === 'vertical'
          ? element.offsetHeight || rect.height
          : element.offsetWidth || rect.width
      const cross =
        orientation === 'vertical'
          ? element.offsetWidth || rect.width
          : element.offsetHeight || rect.height

      if (main <= 0) return

      onMeasure(entry.id, {
        main,
        cross: Math.max(0, cross),
      })
    }

    const view = element.ownerDocument.defaultView
    let frame: number | undefined

    if (view !== null && typeof view.requestAnimationFrame === 'function') {
      frame = view.requestAnimationFrame(measure)
    } else {
      queueMicrotask(measure)
    }

    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)

    observer?.observe(element)

    return () => {
      if (frame !== undefined && view !== null && typeof view.cancelAnimationFrame === 'function') {
        view.cancelAnimationFrame(frame)
      }

      observer?.disconnect()
    }
  }, [entry.id, onMeasure, orientation])

  const style: CSSProperties =
    orientation === 'vertical'
      ? {
          position: 'absolute',
          top: offset,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }
      : {
          position: 'absolute',
          left: offset,
          top: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
        }

  return (
    <Flex
      ref={ref}
      role="presentation"
      direction={orientation === 'vertical' ? 'column' : 'row'}
      align="stretch"
      data={{
        'weave-list-virtual-item': '',
        'weave-list-virtual-id': entry.id,
        'weave-list-virtual-index': index,
      }}
      style={style}
    >
      {showDivider ? (
        <Divider direction={orientation === 'vertical' ? 'horizontal' : 'vertical'} gap={0} />
      ) : null}

      {entry.node}
    </Flex>
  )
}

export function VirtualListWindow({
  entries,
  orientation,
  rootRef,
  focusId,
  showDividers,
}: VirtualListWindowProps) {
  const [measurements, setMeasurements] = useState<ReadonlyMap<string, VirtualMeasurement>>(
    () => new Map(),
  )
  const [viewport, setViewport] = useState<VirtualViewport>({
    offset: 0,
    size: 0,
    gap: 0,
  })

  useEffect(() => {
    const root = rootRef.current
    if (root === null) return

    const view = root.ownerDocument.defaultView
    let frame: number | undefined

    const read = () => {
      const next = readVirtualViewport(root, orientation)

      setViewport((current) => (sameVirtualViewport(current, next) ? current : next))
    }

    const scheduleRead = () => {
      if (view === null || typeof view.requestAnimationFrame !== 'function') {
        queueMicrotask(read)
        return
      }

      if (frame !== undefined) return

      frame = view.requestAnimationFrame(() => {
        frame = undefined
        read()
      })
    }

    scheduleRead()

    root.addEventListener('scroll', scheduleRead, {
      passive: true,
    })

    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(scheduleRead)

    observer?.observe(root)

    return () => {
      root.removeEventListener('scroll', scheduleRead)

      if (frame !== undefined && view !== null && typeof view.cancelAnimationFrame === 'function') {
        view.cancelAnimationFrame(frame)
      }

      observer?.disconnect()
    }
  }, [orientation, rootRef])

  const onMeasure = useCallback((id: string, next: VirtualMeasurement) => {
    setMeasurements((current) => {
      const previous = current.get(id)

      if (
        previous !== undefined &&
        Math.abs(previous.main - next.main) < 0.5 &&
        Math.abs(previous.cross - next.cross) < 0.5
      ) {
        return current
      }

      const updated = new Map(current)
      updated.set(id, next)

      return updated
    })
  }, [])

  const layout = useMemo(
    () => createVirtualLayout(entries, measurements, orientation, viewport.gap),
    [entries, measurements, orientation, viewport.gap],
  )

  const visibleIndices = useMemo(
    () => visibleVirtualIndices(entries, focusId, layout, viewport),
    [entries, focusId, layout, viewport],
  )

  const spacerStyle: CSSProperties =
    orientation === 'vertical'
      ? {
          height: layout.total,
          width: '100%',
          pointerEvents: 'none',
        }
      : {
          width: layout.total,
          height: Math.max(1, layout.maxCross),
          pointerEvents: 'none',
        }

  return (
    <>
      <View
        aria-hidden="true"
        data={{
          'weave-list-virtual-spacer': '',
        }}
        style={spacerStyle}
      />

      {visibleIndices.map((index) => {
        const entry = entries[index]

        if (entry === undefined) {
          return null
        }

        return (
          <VirtualItem
            key={entry.id}
            entry={entry}
            index={index}
            offset={layout.offsets[index] ?? 0}
            orientation={orientation}
            onMeasure={onMeasure}
            showDivider={showDividers && index > 0}
          />
        )
      })}
    </>
  )
}
