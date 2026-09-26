import type {
  DiCIntrinsicConstraints,
  DiCIntrinsicEnvironment,
  DiCTextContent,
  DiCIntrinsicSize,
} from './compile-view'
import {
  resolveDiCTextStyle,
  type DiCResolvedTextStyle,
} from './text-style'

export interface DiCTextLine {
  text: string
  width: number
}

export interface DiCTextLayout extends DiCIntrinsicSize {
  style: DiCResolvedTextStyle
  lines: readonly DiCTextLine[]
}

function applyCase(
  value: string,
  textCase: DiCResolvedTextStyle['case'],
): string {
  switch (textCase) {
    case 'uppercase':
      return value.toUpperCase()
    case 'lowercase':
      return value.toLowerCase()
    case 'capitalize':
      return value.replace(
        /(^|\s)(\S)/g,
        (_match, prefix: string, letter: string) =>
          `${prefix}${letter.toUpperCase()}`,
      )
    default:
      return value
  }
}

function graphemes(value: string): readonly string[] {
  return Array.from(value)
}

export function applyDiCTextFont(
  context: CanvasRenderingContext2D,
  style: DiCResolvedTextStyle,
): void {
  context.font =
    `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`
  context.textBaseline = 'top'
}

function lineWidth(
  context: CanvasRenderingContext2D,
  value: string,
  letterSpacing: number,
): number {
  if (value.length === 0) return 0

  const base = context.measureText(value).width
  const count = graphemes(value).length

  return base + Math.max(0, count - 1) * letterSpacing
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function fitPrefix(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
  letterSpacing: number,
): string {
  const chars = graphemes(value)
  let low = 0
  let high = chars.length

  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    const candidate = chars.slice(0, middle).join('')

    if (
      lineWidth(
        context,
        candidate,
        letterSpacing,
      ) <= maxWidth
    ) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return chars.slice(0, low).join('')
}

function ellipsize(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
  letterSpacing: number,
  force = false,
): DiCTextLine {
  const ellipsis = '…'
  const ellipsisWidth = lineWidth(
    context,
    ellipsis,
    letterSpacing,
  )

  if (maxWidth <= 0) {
    return {
      text: '',
      width: 0,
    }
  }

  const currentWidth = lineWidth(
    context,
    value,
    letterSpacing,
  )

  if (!force && currentWidth <= maxWidth) {
    return {
      text: value,
      width: currentWidth,
    }
  }

  if (ellipsisWidth > maxWidth) {
    return {
      text: '',
      width: 0,
    }
  }

  const prefix = fitPrefix(
    context,
    value,
    maxWidth - ellipsisWidth,
    letterSpacing,
  ).trimEnd()
  const text = `${prefix}${ellipsis}`

  return {
    text,
    width: lineWidth(
      context,
      text,
      letterSpacing,
    ),
  }
}

function splitLongToken(
  context: CanvasRenderingContext2D,
  token: string,
  maxWidth: number,
  letterSpacing: number,
): readonly string[] {
  const output: string[] = []
  let remaining = token

  while (remaining.length > 0) {
    const prefix = fitPrefix(
      context,
      remaining,
      maxWidth,
      letterSpacing,
    )

    if (prefix.length === 0) {
      const [first = ''] = graphemes(remaining)
      output.push(first)
      remaining = graphemes(remaining).slice(1).join('')
      continue
    }

    output.push(prefix)
    remaining = remaining.slice(prefix.length)
  }

  return output
}

function wrapText(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
  letterSpacing: number,
): readonly DiCTextLine[] {
  if (value.length === 0) {
    return [{
      text: '',
      width: 0,
    }]
  }

  const words = value.split(' ')
  const lines: DiCTextLine[] = []
  let current = ''

  const push = (text: string) => {
    lines.push({
      text,
      width: lineWidth(
        context,
        text,
        letterSpacing,
      ),
    })
  }

  for (const word of words) {
    const candidate =
      current.length === 0
        ? word
        : `${current} ${word}`

    if (
      lineWidth(
        context,
        candidate,
        letterSpacing,
      ) <= maxWidth
    ) {
      current = candidate
      continue
    }

    if (current.length > 0) {
      push(current)
      current = ''
    }

    if (
      lineWidth(
        context,
        word,
        letterSpacing,
      ) <= maxWidth
    ) {
      current = word
      continue
    }

    const pieces = splitLongToken(
      context,
      word,
      maxWidth,
      letterSpacing,
    )

    for (const [index, piece] of pieces.entries()) {
      if (index === pieces.length - 1) {
        current = piece
      } else {
        push(piece)
      }
    }
  }

  if (current.length > 0 || lines.length === 0) {
    push(current)
  }

  return lines
}

function layoutLines(
  context: CanvasRenderingContext2D,
  value: string,
  style: DiCResolvedTextStyle,
  maxWidth: number,
): readonly DiCTextLine[] {
  if (style.wrap === 'balance') {
    throw new Error(
      'DiC balanced text wrapping is not implemented yet',
    )
  }

  const collapsed = collapseWhitespace(
    applyCase(value, style.case),
  )

  if (style.wrap === 'nowrap') {
    const width = lineWidth(
      context,
      collapsed,
      style.letterSpacing,
    )

    if (
      style.overflow === 'ellipsis' &&
      width > maxWidth
    ) {
      return [
        ellipsize(
          context,
          collapsed,
          maxWidth,
          style.letterSpacing,
          true,
        ),
      ]
    }

    return [{
      text: collapsed,
      width,
    }]
  }

  return wrapText(
    context,
    collapsed,
    maxWidth,
    style.letterSpacing,
  )
}

export function layoutDiCText(
  content: DiCTextContent,
  constraints: DiCIntrinsicConstraints,
  environment: DiCIntrinsicEnvironment,
): DiCTextLayout {
  const context = environment.context
  const theme = environment.theme
  const inherited = environment.typography

  if (
    context === undefined ||
    theme === undefined ||
    inherited === undefined
  ) {
    throw new Error(
      'DiC text measurement requires context, theme, and inherited typography',
    )
  }

  const style = resolveDiCTextStyle(
    content.style,
    inherited,
    theme,
    environment.viewportWidth,
    constraints.rem,
  )

  if (style.align === 'justify') {
    throw new Error(
      'DiC justified text drawing is not implemented yet',
    )
  }

  applyDiCTextFont(context, style)

  const maxWidth = Math.max(0, constraints.maxWidth)
  let lines = [...layoutLines(
    context,
    content.text,
    style,
    maxWidth,
  )]

  const maxLines =
    style.maxLines === undefined
      ? undefined
      : Math.max(1, Math.floor(style.maxLines))

  if (
    maxLines !== undefined &&
    lines.length > maxLines
  ) {
    lines = lines.slice(0, maxLines)

    if (style.overflow === 'ellipsis') {
      const last = lines[maxLines - 1]
      if (last !== undefined) {
        lines[maxLines - 1] = ellipsize(
          context,
          last.text,
          maxWidth,
          style.letterSpacing,
        )
      }
    }
  }

  const width = Math.max(
    0,
    ...lines.map((line) => line.width),
  )
  const height = lines.length * style.lineHeight

  return {
    style,
    lines,
    width,
    height,
  }
}

export function measureDiCText(
  content: DiCTextContent,
  constraints: DiCIntrinsicConstraints,
  environment: DiCIntrinsicEnvironment,
): DiCIntrinsicSize {
  const layout = layoutDiCText(
    content,
    constraints,
    environment,
  )

  return {
    width: layout.width,
    height: layout.height,
  }
}
