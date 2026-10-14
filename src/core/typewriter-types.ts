import type { ReactNode } from 'react'
import type { TextProps } from './text-types'

export type TypewriterCursorPreset = 'bar' | 'underline' | 'block' | 'outline'

/** An automatic type–pause–delete text sequence. */
export interface TypewriterProps extends Omit<TextProps, 'children'> {
  /** Plain text phrases shown in order. Empty phrases are skipped. */
  texts: readonly string[]
  /** Milliseconds per visible grapheme while typing. Default: 100. */
  typeInterval?: number
  /** Milliseconds per removed grapheme. Default: 60. */
  deleteInterval?: number
  /** Milliseconds to hold a complete phrase before deleting or finishing. Default: 1000. */
  pauseDuration?: number
  /** Repeat the sequence indefinitely. Default: true. */
  loop?: boolean
  /** Show or hide the cursor. Default: true. */
  showCursor?: boolean
  /** Preset blinking cursor or a custom React node. Default: 'bar'. */
  cursor?: TypewriterCursorPreset | ReactNode
}
