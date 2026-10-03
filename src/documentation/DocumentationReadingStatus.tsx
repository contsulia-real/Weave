import { type RefObject, useLayoutEffect, useState } from 'react'
import { Column, Link, Text } from '../index'

interface DocumentationDirectoryItem {
  id: string
  label: string
}

export interface DocumentationReadingStatusProps {
  contentRef: RefObject<HTMLDivElement | null>
}

function sameItems(
  left: readonly DocumentationDirectoryItem[],
  right: readonly DocumentationDirectoryItem[],
): boolean {
  return (
    left.length === right.length &&
    left.every((item, index) => item.id === right[index]?.id && item.label === right[index]?.label)
  )
}

export function DocumentationReadingStatus({ contentRef }: DocumentationReadingStatusProps) {
  const [items, setItems] = useState<readonly DocumentationDirectoryItem[]>([])

  useLayoutEffect(() => {
    const content = contentRef.current
    if (content === null) return

    const nextItems = Array.from(content.querySelectorAll<HTMLElement>('[data-weave-doc-section]'))
      .map((element) => ({
        id: element.id,
        label: element.dataset.weaveDocSectionLabel ?? element.textContent?.trim() ?? '',
      }))
      .filter((item) => item.id.length > 0 && item.label.length > 0)

    setItems((current) => (sameItems(current, nextItems) ? current : nextItems))
  }, [contentRef])

  if (items.length === 0) return null

  return (
    <Column
      top={2}
      alignSelf="start"
      shrink={0}
      padding={1.5}
      minWidth="280px"
      position="sticky"
      gap={0.75}
    >
      <Text bold typo="body-large">
        CONTENTS
      </Text>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          text={<Text typo="label-medium">{item.label}</Text>}
          hideIcon
          hideUnderline
          viewProps={{ width: 'content' }}
        />
      ))}
    </Column>
  )
}
