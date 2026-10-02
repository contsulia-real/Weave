import { Fragment } from 'react'
import { Text } from '../index'

export interface DocumentationSearchHighlightProps {
  text: string
  query: string
}

function matchRanges(text: string, query: string): readonly [number, number][] {
  const needle = query.trim().toLocaleLowerCase()
  if (needle.length === 0) return []

  const haystack = text.toLocaleLowerCase()
  const ranges: [number, number][] = []
  let offset = 0

  while (offset < haystack.length) {
    const index = haystack.indexOf(needle, offset)
    if (index < 0) break

    ranges.push([index, index + needle.length])
    offset = index + needle.length
  }

  return ranges
}

export function DocumentationSearchHighlight({ text, query }: DocumentationSearchHighlightProps) {
  const ranges = matchRanges(text, query)

  if (ranges.length === 0) {
    return (
      <Text singleLine viewProps={{ grow: 1, minWidth: 0 }}>
        {text}
      </Text>
    )
  }

  const content = []
  let cursor = 0

  for (const [start, end] of ranges) {
    if (start > cursor) {
      content.push(<Fragment key={`plain-${cursor}`}>{text.slice(cursor, start)}</Fragment>)
    }

    content.push(
      <Text key={`match-${start}`} color="onPrimary" viewProps={{ background: 'primary' }}>
        {text.slice(start, end)}
      </Text>,
    )
    cursor = end
  }

  if (cursor < text.length) {
    content.push(<Fragment key={`plain-${cursor}`}>{text.slice(cursor)}</Fragment>)
  }

  return (
    <Text singleLine viewProps={{ grow: 1, minWidth: 0 }}>
      {content}
    </Text>
  )
}
