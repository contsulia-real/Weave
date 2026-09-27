import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  CSSProperties,
  ReactNode,
  RefObject,
} from 'react'
import type {
  ListOrientation,
} from '../../core/list-types'

export interface VirtualListEntry {
  id: string
  node: ReactNode
}

interface VirtualMeasurement {
  main: number
  cross: number
}

interface VirtualViewport {
  offset: number
  size: number
  gap: number
}

interface VirtualListWindowProps {
  entries:
    readonly VirtualListEntry[]
  orientation:
    ListOrientation
  rootRef:
    RefObject<HTMLDivElement | null>
  activeId:
    string | null
}

const INITIAL_WINDOW = 12
const VERTICAL_ESTIMATE = 48
const HORIZONTAL_ESTIMATE = 160

function numericGap(
  root: HTMLDivElement,
  orientation:
    ListOrientation,
): number {
  const view =
    root.ownerDocument.defaultView

  if (view === null) {
    return 0
  }

  const style =
    view.getComputedStyle(root)
  const value =
    orientation === 'vertical'
      ? style.rowGap
      : style.columnGap
  const parsed =
    Number.parseFloat(value)

  return Number.isFinite(parsed)
    ? parsed
    : 0
}

function viewportState(
  root: HTMLDivElement,
  orientation:
    ListOrientation,
): VirtualViewport {
  return {
    offset:
      orientation === 'vertical'
        ? root.scrollTop
        : root.scrollLeft,
    size:
      orientation === 'vertical'
        ? root.clientHeight
        : root.clientWidth,
    gap:
      numericGap(
        root,
        orientation,
      ),
  }
}

function sameViewport(
  left: VirtualViewport,
  right: VirtualViewport,
): boolean {
  return (
    left.offset === right.offset &&
    left.size === right.size &&
    left.gap === right.gap
  )
}

function VirtualItem({
  entry,
  index,
  offset,
  orientation,
  onMeasure,
}: {
  entry: VirtualListEntry
  index: number
  offset: number
  orientation:
    ListOrientation
  onMeasure(
    id: string,
    measurement:
      VirtualMeasurement,
  ): void
}) {
  const ref =
    useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element =
      ref.current

    if (element === null) {
      return
    }

    const measure = () => {
      const rect =
        element.getBoundingClientRect()
      const main =
        orientation === 'vertical'
          ? (
              element.offsetHeight ||
              rect.height
            )
          : (
              element.offsetWidth ||
              rect.width
            )
      const cross =
        orientation === 'vertical'
          ? (
              element.offsetWidth ||
              rect.width
            )
          : (
              element.offsetHeight ||
              rect.height
            )

      if (main <= 0) {
        return
      }

      onMeasure(
        entry.id,
        {
          main,
          cross:
            Math.max(
              0,
              cross,
            ),
        },
      )
    }

    const view =
      element.ownerDocument
        .defaultView
    let frame:
      | number
      | undefined

    if (
      view !== null &&
      typeof view
        .requestAnimationFrame ===
        'function'
    ) {
      frame =
        view.requestAnimationFrame(
          measure,
        )
    } else {
      queueMicrotask(measure)
    }

    const observer =
      typeof ResizeObserver ===
        'undefined'
        ? undefined
        : new ResizeObserver(
            measure,
          )

    observer?.observe(element)

    return () => {
      if (
        frame !== undefined &&
        view !== null &&
        typeof view
          .cancelAnimationFrame ===
          'function'
      ) {
        view.cancelAnimationFrame(
          frame,
        )
      }

      observer?.disconnect()
    }
  }, [
    entry.id,
    onMeasure,
    orientation,
  ])

  const style:
    CSSProperties =
    orientation === 'vertical'
      ? {
          position:
            'absolute',
          top: offset,
          left: 0,
          right: 0,
        }
      : {
          position:
            'absolute',
          left: offset,
          top: 0,
        }

  return (
    <div
      ref={ref}
      role="presentation"
      data-weave-list-virtual-item=""
      data-weave-list-virtual-id={
        entry.id
      }
      data-weave-list-virtual-index={
        index
      }
      style={style}
    >
      {entry.node}
    </div>
  )
}

export function VirtualListWindow({
  entries,
  orientation,
  rootRef,
  activeId,
}: VirtualListWindowProps) {
  const [
    measurements,
    setMeasurements,
  ] = useState<
    ReadonlyMap<
      string,
      VirtualMeasurement
    >
  >(
    () =>
      new Map(),
  )
  const [
    viewport,
    setViewport,
  ] = useState<VirtualViewport>({
    offset: 0,
    size: 0,
    gap: 0,
  })

  useEffect(() => {
    const root =
      rootRef.current

    if (root === null) {
      return
    }

    const view =
      root.ownerDocument
        .defaultView
    let frame:
      | number
      | undefined

    const read = () => {
      const next =
        viewportState(
          root,
          orientation,
        )

      setViewport(
        (current) =>
          sameViewport(
            current,
            next,
          )
            ? current
            : next,
      )
    }

    const scheduleRead = () => {
      if (
        view === null ||
        typeof view
          .requestAnimationFrame !==
          'function'
      ) {
        queueMicrotask(read)
        return
      }

      if (frame !== undefined) {
        return
      }

      frame =
        view.requestAnimationFrame(
          () => {
            frame = undefined
            read()
          },
        )
    }

    scheduleRead()

    root.addEventListener(
      'scroll',
      scheduleRead,
      {
        passive: true,
      },
    )

    const observer =
      typeof ResizeObserver ===
        'undefined'
        ? undefined
        : new ResizeObserver(
            scheduleRead,
          )

    observer?.observe(root)

    return () => {
      root.removeEventListener(
        'scroll',
        scheduleRead,
      )

      if (
        frame !== undefined &&
        view !== null &&
        typeof view
          .cancelAnimationFrame ===
          'function'
      ) {
        view.cancelAnimationFrame(
          frame,
        )
      }

      observer?.disconnect()
    }
  }, [
    orientation,
    rootRef,
  ])

  const onMeasure =
    useCallback(
      (
        id: string,
        next:
          VirtualMeasurement,
      ) => {
        setMeasurements(
          (current) => {
            const previous =
              current.get(id)

            if (
              previous !== undefined &&
              Math.abs(
                previous.main -
                  next.main,
              ) < 0.5 &&
              Math.abs(
                previous.cross -
                  next.cross,
              ) < 0.5
            ) {
              return current
            }

            const updated =
              new Map(current)

            updated.set(
              id,
              next,
            )

            return updated
          },
        )
      },
      [],
    )

  const layout =
    useMemo(
      () => {
        const estimate =
          orientation ===
            'vertical'
            ? VERTICAL_ESTIMATE
            : HORIZONTAL_ESTIMATE
        const offsets:
          number[] = []
        const sizes:
          number[] = []
        let cursor = 0
        let maxCross =
          orientation ===
            'horizontal'
            ? VERTICAL_ESTIMATE
            : 0

        for (
          let index = 0;
          index <
            entries.length;
          index += 1
        ) {
          const entry =
            entries[index]!
          const measurement =
            measurements
              .get(entry.id)
          const size =
            measurement?.main ??
            estimate

          offsets.push(cursor)
          sizes.push(size)

          maxCross =
            Math.max(
              maxCross,
              measurement?.cross ??
                0,
            )

          cursor += size

          if (
            index <
            entries.length - 1
          ) {
            cursor +=
              viewport.gap
          }
        }

        return {
          offsets,
          sizes,
          total: cursor,
          maxCross,
          estimate,
        }
      },
      [
        entries,
        orientation,
        measurements,
        viewport.gap,
      ],
    )

  const visibleIndices =
    useMemo(
      () => {
        if (
          entries.length === 0
        ) {
          return []
        }

        const activeIndex =
          activeId === null
            ? -1
            : entries.findIndex(
                (entry) =>
                  entry.id ===
                  activeId,
              )

        if (
          viewport.size <= 0
        ) {
          const initial =
            Array.from(
              {
                length:
                  Math.min(
                    INITIAL_WINDOW,
                    entries.length,
                  ),
              },
              (_, index) =>
                index,
            )

          if (
            activeIndex >= 0 &&
            !initial.includes(
              activeIndex,
            )
          ) {
            initial.push(
              activeIndex,
            )
            initial.sort(
              (a, b) =>
                a - b,
            )
          }

          return initial
        }

        const overscan =
          Math.max(
            layout.estimate * 3,
            viewport.size * 0.5,
          )
        const windowStart =
          Math.max(
            0,
            viewport.offset -
              overscan,
          )
        const windowEnd =
          viewport.offset +
          viewport.size +
          overscan
        const indices:
          number[] = []

        for (
          let index = 0;
          index <
            entries.length;
          index += 1
        ) {
          const start =
            layout.offsets[
              index
            ]!
          const end =
            start +
            layout.sizes[
              index
            ]!

          if (
            end >=
              windowStart &&
            start <=
              windowEnd
          ) {
            indices.push(index)
          }
        }

        if (
          activeIndex >= 0 &&
          !indices.includes(
            activeIndex,
          )
        ) {
          indices.push(
            activeIndex,
          )
          indices.sort(
            (a, b) =>
              a - b,
          )
        }

        return indices
      },
      [
        activeId,
        entries,
        layout,
        viewport.offset,
        viewport.size,
      ],
    )

  const spacerStyle:
    CSSProperties =
    orientation === 'vertical'
      ? {
          height:
            layout.total,
          width: '100%',
          pointerEvents:
            'none',
        }
      : {
          width:
            layout.total,
          height:
            Math.max(
              1,
              layout.maxCross,
            ),
          pointerEvents:
            'none',
        }

  return (
    <>
      <div
        aria-hidden="true"
        data-weave-list-virtual-spacer=""
        style={spacerStyle}
      />

      {visibleIndices.map(
        (index) => {
          const entry =
            entries[index]

          if (
            entry === undefined
          ) {
            return null
          }

          return (
            <VirtualItem
              key={entry.id}
              entry={entry}
              index={index}
              offset={
                layout.offsets[
                  index
                ] ?? 0
              }
              orientation={
                orientation
              }
              onMeasure={
                onMeasure
              }
            />
          )
        },
      )}
    </>
  )
}
