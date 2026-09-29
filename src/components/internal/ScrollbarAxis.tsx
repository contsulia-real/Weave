import type { PointerEvent, RefObject } from 'react'
import type { ScrollbarSize } from '../../core/view-types'
import { ScrollbarView } from './ScrollbarView'
import type { ScrollbarOrientation } from './scrollbar-types'

interface ScrollbarAxisProps {
  orientation: ScrollbarOrientation
  size: ScrollbarSize
  themeTokenClassName?: string
  scrollbarThemeClassName?: string
  hitRegionRef: RefObject<HTMLDivElement | null>
  thumbRef: RefObject<HTMLDivElement | null>
  onHitRegionPointerDown: (
    orientation: ScrollbarOrientation,
    event: PointerEvent<HTMLDivElement>,
  ) => void
  onPointerMove: (orientation: ScrollbarOrientation, event: PointerEvent<HTMLDivElement>) => void
  onPointerEnd: (event: PointerEvent<HTMLDivElement>) => void
  onThumbPointerDown: (
    orientation: ScrollbarOrientation,
    event: PointerEvent<HTMLDivElement>,
  ) => void
}

export function ScrollbarAxis({
  orientation,
  size,
  themeTokenClassName,
  scrollbarThemeClassName,
  hitRegionRef,
  thumbRef,
  onHitRegionPointerDown,
  onPointerMove,
  onPointerEnd,
  onThumbPointerDown,
}: ScrollbarAxisProps) {
  return (
    <ScrollbarView
      ref={hitRegionRef}
      aria-hidden
      className={[
        'weave-scrollbar',
        `weave-scrollbar--${size}`,
        themeTokenClassName,
        scrollbarThemeClassName,
        `weave-scrollbar--${orientation}`,
      ]
        .filter(Boolean)
        .join(' ')}
      onPointerDown={(event) => onHitRegionPointerDown(orientation, event)}
      onPointerMove={(event) => onPointerMove(orientation, event)}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      data={{
        'weave-scrollbar': '',
        'weave-scrollbar-orientation': orientation,
        'weave-scrollbar-visible': 'false',
      }}
    >
      <ScrollbarView
        ref={thumbRef}
        className="weave-scrollbar__thumb"
        onPointerDown={(event) => onThumbPointerDown(orientation, event)}
        data={{
          'weave-scrollbar-thumb': '',
        }}
      />
    </ScrollbarView>
  )
}
