import { Children, useEffect, useRef, useState } from 'react'
import type { CarouselProps } from '../core/carousel-types'
import { useTheme } from '../theme/theme-context'
import { Button } from './Button'
import { chevronLeftIcon, chevronRightIcon } from './internal/control-icons'
import { Row } from './Row'
import { View } from './View'

export function Carousel({
  children,
  gap,
  label = 'Carousel',
  previousLabel = 'Previous items',
  nextLabel = 'Next items',
  viewProps = {},
}: CarouselProps): import('react').JSX.Element {
  const { reducedMotion } = useTheme()
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: true })

  useEffect(() => {
    const viewport = viewportRef.current
    if (viewport === null) return

    const updateEdges = () => {
      const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
      const position = Math.abs(viewport.scrollLeft)
      setEdges({ start: position <= 1, end: position >= max - 1 })
    }

    updateEdges()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(updateEdges)
    observer.observe(viewport)
    if (contentRef.current !== null) observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [children, gap])

  const scroll = (direction: -1 | 1) => {
    const viewport = viewportRef.current
    if (viewport === null) return
    const sign = getComputedStyle(viewport).direction === 'rtl' ? -1 : 1
    viewport.scrollBy({
      left: viewport.clientWidth * direction * sign,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <Row
      {...viewProps}
      role="region"
      label={viewProps.label ?? label}
      align="center"
      width={viewProps.width ?? 'fill'}
      data={{ ...viewProps.data, 'weave-carousel': '' }}
    >
      <Button
        icon={chevronLeftIcon}
        variant="ghost"
        size="small"
        disabled={edges.start}
        viewProps={{ label: previousLabel, onClick: () => scroll(-1) }}
      />
      <View
        ref={viewportRef}
        width="fill"
        minWidth={0}
        overflowX="auto"
        tabIndex={0}
        onScroll={() => {
          const viewport = viewportRef.current
          if (viewport === null) return
          const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
          const position = Math.abs(viewport.scrollLeft)
          setEdges({ start: position <= 1, end: position >= max - 1 })
        }}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <Row ref={contentRef} gap={gap}>
          {Children.toArray(children).map((child, index) => (
            <View key={index} style={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
              {child}
            </View>
          ))}
        </Row>
      </View>
      <Button
        icon={chevronRightIcon}
        variant="ghost"
        size="small"
        disabled={edges.end}
        viewProps={{ label: nextLabel, onClick: () => scroll(1) }}
      />
    </Row>
  )
}
