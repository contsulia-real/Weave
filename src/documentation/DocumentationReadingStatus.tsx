import { type RefObject, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation()
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
  }, [contentRef, i18n.resolvedLanguage])

  if (items.length === 0) return null

  return (
    <Column
      width="fill"
      maxWidth={832}
      alignSelf="start"
      padding={16}
      position="relative"
      order={-1}
      gap={12}
      containerLg={{
        top: 32,
        shrink: 0,
        padding: 24,
        width: 'content',
        position: 'sticky',
        order: 0,
      }}
    >
      <Text bold typo="body-large">
        {t('docs.contents')}
      </Text>
      <Column gap={12} width={192}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            text={<Text typo="label-medium">{item.label}</Text>}
            hideIcon
            viewProps={{ width: 'content' }}
          />
        ))}
      </Column>
    </Column>
  )
}
