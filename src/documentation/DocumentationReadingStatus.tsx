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
      const contentRect = content.getBoundingClientRect()
      const contentLength = Math.max(0, Math.round(content.scrollHeight))
      const elements = sectionElements()

      const nextMarks = elements
        .map((element, index) => {
          const nextElement = elements[index + 1]
          const sectionEnd =
            nextElement === undefined
              ? contentLength
              : Math.max(0, Math.round(nextElement.getBoundingClientRect().top - contentRect.top))

          return {
            id: element.id,
            label: element.dataset.weaveDocSectionLabel ?? element.textContent?.trim() ?? '',
            flag: sectionEnd,
          }
        })
        .filter((mark) => mark.id.length > 0 && mark.label.length > 0)
        .sort((a, b) => a.flag - b.flag)

      setMarks((current) => (sameMarks(current, nextMarks) ? current : nextMarks))

      if (nextMarks.length === 0) {
        setValue(0)
        return
      }

      const max = nextMarks[nextMarks.length - 1]?.flag ?? 0
      const maxScroll = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
      const scrollTop = Math.min(maxScroll, Math.max(0, scrollContainer.scrollTop))
      setValue(maxScroll === 0 ? max : (scrollTop / maxScroll) * max)
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

  const max = marks[marks.length - 1]?.flag ?? 0

  return (
    <Flex top={2} alignSelf="start" shrink={0} padding={1.5} minWidth="280px" position="sticky">
      <MarkSlider
        marks={sliderMarks}
        value={value}
        onChange={(next) => {
          const scrollContainer = scrollContainerRef.current
          if (scrollContainer === null || max <= 0) return

          const maxScroll = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
          scrollContainer.scrollTo({ top: (next / max) * maxScroll })
        }}
        min={0}
        max={max}
        step={1}
        direction="vertical"
        inverse
      />
    </Flex>
  )
}
