import { type RefObject, useEffect, useMemo, useState } from 'react'
import { Flex, Link, MarkSlider, Text } from '../index'

interface DocumentationReadingMark {
  id: string
  label: string
  flag: number
}

export interface DocumentationReadingStatusProps {
  contentRef: RefObject<HTMLDivElement | null>
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

function percentage(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, (value / total) * 100))
}

export function DocumentationReadingStatus({
  contentRef,
  scrollContainerRef,
}: DocumentationReadingStatusProps) {
  const [marks, setMarks] = useState<readonly DocumentationReadingMark[]>([])
  const [value, setValue] = useState(0)

  useEffect(() => {
    const content = contentRef.current
    const scrollContainer = scrollContainerRef.current
    if (content === null || scrollContainer === null) return

    const sectionElements = () =>
      Array.from(content.querySelectorAll<HTMLElement>('[data-weave-doc-section]'))

    const sync = () => {
      const scrollRect = scrollContainer.getBoundingClientRect()
      const pageLength = Math.max(0, scrollContainer.scrollHeight)
      const elements = sectionElements()

      const nextMarks = elements
        .map((element) => {
          const sectionStart = Math.max(
            0,
            Math.min(
              pageLength,
              element.getBoundingClientRect().top - scrollRect.top + scrollContainer.scrollTop,
            ),
          )

          return {
            id: element.id,
            label: element.dataset.weaveDocSectionLabel ?? element.textContent?.trim() ?? '',
            flag: percentage(sectionStart, pageLength),
          }
        })
        .filter((mark) => mark.id.length > 0 && mark.label.length > 0)
        .sort((a, b) => a.flag - b.flag)

      setMarks((current) => (sameMarks(current, nextMarks) ? current : nextMarks))

      const maxScroll = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
      const scrollTop = Math.min(maxScroll, Math.max(0, scrollContainer.scrollTop))
      setValue(maxScroll === 0 ? 100 : percentage(scrollTop, maxScroll))
    }

    sync()

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(sync)
    resizeObserver?.observe(content)
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
  }, [contentRef, scrollContainerRef])

  const sliderMarks = useMemo(
    () =>
      marks.map((mark) => ({
        flag: mark.flag,
        label: (
          <Link
            href={`#${mark.id}`}
            text={<Text typo="label-medium">{mark.label}</Text>}
            hideIcon
            hideUnderline
          />
        ),
      })),
    [marks],
  )

  if (marks.length === 0) return null

  return (
    <Flex top={2} alignSelf="start" shrink={0} padding={1.5} minWidth="280px" position="sticky">
      <MarkSlider
        marks={sliderMarks}
        value={value}
        onChange={(next) => {
          const scrollContainer = scrollContainerRef.current
          if (scrollContainer === null) return

          const maxScroll = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
          scrollContainer.scrollTo({ top: (next / 100) * maxScroll })
        }}
        min={0}
        max={100}
        direction="vertical"
        inverse
      />
    </Flex>
  )
}
