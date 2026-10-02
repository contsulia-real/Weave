import { type RefObject, useEffect, useMemo, useState } from 'react'
import { Card, Link, MarkSlider } from '../index'

interface DocumentationReadingMark {
  id: string
  label: string
  flag: number
}

export interface DocumentationReadingStatusProps {
  pageRef: RefObject<HTMLDivElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

function sameMarks(
  left: readonly DocumentationReadingMark[],
  right: readonly DocumentationReadingMark[],
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (mark, index) =>
        mark.id === right[index]?.id &&
        mark.label === right[index]?.label &&
        mark.flag === right[index]?.flag,
    )
  )
}

export function DocumentationReadingStatus({
  pageRef,
  scrollContainerRef,
}: DocumentationReadingStatusProps) {
  const [marks, setMarks] = useState<readonly DocumentationReadingMark[]>([])
  const [value, setValue] = useState(0)

  useEffect(() => {
    const page = pageRef.current
    const scrollContainer = scrollContainerRef.current
    if (page === null || scrollContainer === null) return

    const sectionElements = () =>
      Array.from(page.querySelectorAll<HTMLElement>('[data-weave-doc-section]'))

    const sync = () => {
      const pageRect = page.getBoundingClientRect()
      const nextMarks = sectionElements()
        .map((element) => ({
          id: element.id,
          label: element.dataset.weaveDocSectionLabel ?? element.textContent?.trim() ?? '',
          flag: Math.max(0, Math.round(element.getBoundingClientRect().top - pageRect.top)),
        }))
        .filter((mark) => mark.id.length > 0 && mark.label.length > 0)
        .sort((a, b) => a.flag - b.flag)

      setMarks((current) => (sameMarks(current, nextMarks) ? current : nextMarks))

      if (nextMarks.length === 0) {
        setValue(0)
        return
      }

      const min = nextMarks[0]?.flag ?? 0
      const max = nextMarks[nextMarks.length - 1]?.flag ?? min
      const scrollRect = scrollContainer.getBoundingClientRect()
      const pageOffset = Math.max(0, Math.round(scrollRect.top - pageRect.top))
      setValue(Math.min(max, Math.max(min, pageOffset)))
    }

    sync()

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(sync)
    resizeObserver?.observe(page)
    for (const element of sectionElements()) {
      resizeObserver?.observe(element)
    }

    scrollContainer.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)

    return () => {
      resizeObserver?.disconnect()
      scrollContainer.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [pageRef, scrollContainerRef])

  const sliderMarks = useMemo(
    () =>
      marks.map((mark) => ({
        flag: mark.flag,
        label: <Link href={`#${mark.id}`} text={mark.label} hideIcon />,
      })),
    [marks],
  )

  if (marks.length === 0) return null

  const min = marks[0]?.flag ?? 0
  const max = marks[marks.length - 1]?.flag ?? min

  return (
    <Card
      viewProps={{
        position: 'sticky',
        top: 2,
        alignSelf: 'start',
        shrink: 0,
        padding: 1.5,
      }}
    >
      <MarkSlider
        marks={sliderMarks}
        value={value}
        onChange={(next) => {
          scrollContainerRef.current?.scrollTo({ top: next })
        }}
        min={min}
        max={max}
        step={1}
        direction="vertical"
        inverse
      />
    </Card>
  )
}
