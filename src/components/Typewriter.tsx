import { useEffect, useMemo, useState } from 'react'
import type { TypewriterProps } from '../core/typewriter-types'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { ensureTypewriterStylesheet } from '../renderers/dom/typewriter-stylesheet'
import { useTheme } from '../theme/theme-context'
import { typographyStyleVariableReference } from '../theme/theme-css'
import { Text } from './Text'
import { View } from './View'

const CURSOR_PRESETS = ['bar', 'underline', 'block', 'outline'] as const

type Phase = 'typing' | 'pausing' | 'deleting' | 'done'

interface Playback {
  key: string
  index: number
  count: number
  phase: Phase
}

function startPlayback(key: string): Playback {
  return { key, index: 0, count: 0, phase: 'typing' }
}

function graphemes(text: string): string[] {
  if (typeof Intl.Segmenter !== 'function') return Array.from(text)
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  return Array.from(segmenter.segment(text), ({ segment }) => segment)
}

function advance(
  playback: Playback,
  phrases: readonly (readonly string[])[],
  loop: boolean,
): Playback {
  const length = phrases[playback.index]?.length ?? 0

  if (playback.phase === 'typing') {
    const count = Math.min(length, playback.count + 1)
    return { ...playback, count, phase: count === length ? 'pausing' : 'typing' }
  }
  if (playback.phase === 'pausing') {
    return {
      ...playback,
      phase: !loop && playback.index === phrases.length - 1 ? 'done' : 'deleting',
    }
  }
  if (playback.phase === 'deleting') {
    const count = Math.max(0, playback.count - 1)
    return count > 0
      ? { ...playback, count }
      : { ...playback, index: (playback.index + 1) % phrases.length, count: 0, phase: 'typing' }
  }
  return playback
}

function interval(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? Math.max(1, value) : fallback
}

/** Reveal, hold, erase, and cycle through plain text without changing Weave typography. */
export function Typewriter({
  texts,
  typeInterval = 100,
  deleteInterval = 60,
  pauseDuration = 1000,
  loop = true,
  showCursor = true,
  cursor = 'bar',
  viewProps,
  ...textProps
}: TypewriterProps): import('react').JSX.Element {
  const { reducedMotion } = useTheme()
  useStaticStylesheet(ensureTypewriterStylesheet)
  const textKey = JSON.stringify(texts)
  const phrases = useMemo(
    () => (JSON.parse(textKey) as string[]).filter(Boolean).map(graphemes),
    [textKey],
  )
  const [playback, setPlayback] = useState(() => startPlayback(textKey))
  const current = playback.key === textKey ? playback : startPlayback(textKey)

  useEffect(() => {
    if (reducedMotion || phrases.length === 0 || current.phase === 'done') return

    const delay =
      current.phase === 'typing'
        ? interval(typeInterval, 100)
        : current.phase === 'deleting'
          ? interval(deleteInterval, 60)
          : interval(pauseDuration, 1000)
    const timeout = setTimeout(() => {
      setPlayback((previous) =>
        advance(previous.key === textKey ? previous : startPlayback(textKey), phrases, loop),
      )
    }, delay)
    return () => clearTimeout(timeout)
  }, [current, deleteInterval, loop, pauseDuration, phrases, reducedMotion, textKey, typeInterval])

  const displayed = reducedMotion
    ? ((loop ? phrases[0] : phrases[phrases.length - 1])?.join('') ?? '')
    : (phrases[current.index]?.slice(0, current.count).join('') ?? '')
  const content = displayed || <span aria-hidden="true">{'\u200b'}</span>

  const preset = typeof cursor === 'string' && CURSOR_PRESETS.some((value) => value === cursor)
  const cursorFontSize =
    viewProps?.style?.fontSize ??
    (textProps.size !== undefined
      ? `var(--weave-typography-size-${textProps.size})`
      : typographyStyleVariableReference(textProps.typo, 'fontSize'))

  if (showCursor && phrases.length > 0 && cursor != null && cursor !== false) {
    return (
      <View
        data={{ 'weave-typewriter': '' }}
        gap={2}
        color={textProps.color}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          verticalAlign: 'baseline',
          fontSize: cursorFontSize,
        }}
      >
        <Text {...textProps} viewProps={viewProps}>
          {content}
        </Text>
        {preset ? (
          <View
            data={{ 'weave-typewriter-cursor': '', 'weave-typewriter-preset': cursor as string }}
            aria-hidden="true"
            width={cursor === 'bar' ? '2px' : '0.7em'}
            height="1em"
            background={cursor === 'block' ? 'currentColor' : undefined}
            border={cursor === 'outline' ? '1px' : 0}
            borderLeft={cursor === 'bar' ? '2px' : undefined}
            borderBottom={cursor === 'underline' ? '2px' : undefined}
            borderStyle={cursor === 'block' ? undefined : 'solid'}
            borderColor="currentColor"
            style={{ boxSizing: 'border-box', flexShrink: 0 }}
          />
        ) : (
          <span data-weave-typewriter-cursor="" aria-hidden="true">
            {cursor}
          </span>
        )}
      </View>
    )
  }

  return (
    <Text
      {...textProps}
      viewProps={{
        ...viewProps,
        data: { ...viewProps?.data, 'weave-typewriter': '' },
      }}
    >
      {content}
      {showCursor && phrases.length > 0 && cursor != null ? (
        <span data-weave-typewriter-cursor="" aria-hidden="true">
          {cursor}
        </span>
      ) : null}
    </Text>
  )
}
