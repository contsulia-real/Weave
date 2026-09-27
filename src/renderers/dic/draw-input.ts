import type {
  DiCInputContent,
  DiCTypographyContext,
} from './compile-view'
import type { DiCViewFrame } from './draw-view'
import type { ResolvedTheme } from '../../theme/theme-types'
import { applyDiCTextFont } from './text-layout'
import { resolveDiCColor } from './color'

export interface DiCInputDrawEnvironment {
  theme: ResolvedTheme
  typography: DiCTypographyContext
}

interface InputLine {
  text: string
  start: number
  end: number
  width: number
}

function textWidth(
  context: CanvasRenderingContext2D,
  value: string,
  typography: DiCTypographyContext,
): number {
  if (value.length === 0) return 0

  return (
    context.measureText(value).width +
    Math.max(
      0,
      Array.from(value).length - 1,
    ) * typography.letterSpacing
  )
}

function visibleValue(
  content: DiCInputContent,
): string {
  if (
    !content.input.multiline &&
    content.input.type === 'password'
  ) {
    return '•'.repeat(
      Array.from(content.value).length,
    )
  }

  return content.value
}

function hardWrappedLines(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
  typography: DiCTypographyContext,
): readonly InputLine[] {
  const output: InputLine[] = []
  let line = ''
  let lineStart = 0
  let index = 0

  const push = (
    end: number,
  ) => {
    output.push({
      text: line,
      start: lineStart,
      end,
      width: textWidth(
        context,
        line,
        typography,
      ),
    })
    line = ''
    lineStart = end
  }

  for (const character of value) {
    const characterLength =
      character.length

    if (character === '\n') {
      push(index)
      index += characterLength
      lineStart = index
      continue
    }

    const candidate =
      line + character

    if (
      line.length > 0 &&
      textWidth(
        context,
        candidate,
        typography,
      ) > maxWidth
    ) {
      push(index)
    }

    line += character
    index += characterLength
  }

  output.push({
    text: line,
    start: lineStart,
    end: index,
    width: textWidth(
      context,
      line,
      typography,
    ),
  })

  return output
}

function prefixWidth(
  context: CanvasRenderingContext2D,
  line: InputLine,
  absoluteIndex: number,
  typography: DiCTypographyContext,
): number {
  const local = Math.max(
    0,
    Math.min(
      line.text.length,
      absoluteIndex - line.start,
    ),
  )

  return textWidth(
    context,
    line.text.slice(0, local),
    typography,
  )
}

function selectionRange(
  content: DiCInputContent,
): readonly [number, number] {
  const start =
    content.selectionStart ??
    content.value.length
  const end =
    content.selectionEnd ??
    start

  return start <= end
    ? [start, end]
    : [end, start]
}

function drawSelection(
  context: CanvasRenderingContext2D,
  line: InputLine,
  lineX: number,
  lineY: number,
  lineHeight: number,
  content: DiCInputContent,
  environment: DiCInputDrawEnvironment,
): void {
  if (!content.focused) return

  const [selectionStart, selectionEnd] =
    selectionRange(content)

  if (selectionStart === selectionEnd) {
    if (
      selectionStart < line.start ||
      selectionStart > line.end
    ) {
      return
    }

    const caretX =
      lineX +
      prefixWidth(
        context,
        line,
        selectionStart,
        environment.typography,
      )

    context.save()
    context.fillStyle =
      resolveDiCColor(
        'focus',
        environment.theme,
      )
    context.fillRect(
      caretX,
      lineY,
      1,
      lineHeight,
    )
    context.restore()
    return
  }

  const start = Math.max(
    selectionStart,
    line.start,
  )
  const end = Math.min(
    selectionEnd,
    line.end,
  )

  if (end <= start) return

  const startX = prefixWidth(
    context,
    line,
    start,
    environment.typography,
  )
  const endX = prefixWidth(
    context,
    line,
    end,
    environment.typography,
  )

  context.save()
  context.globalAlpha *= 0.18
  context.fillStyle =
    resolveDiCColor(
      'focus',
      environment.theme,
    )
  context.fillRect(
    lineX + startX,
    lineY,
    Math.max(0, endX - startX),
    lineHeight,
  )
  context.restore()
}

function drawLineText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  typography: DiCTypographyContext,
): void {
  if (typography.letterSpacing === 0) {
    context.fillText(
      value,
      x,
      y,
    )
    return
  }

  let cursor = x
  const characters = Array.from(value)

  for (
    let index = 0;
    index < characters.length;
    index += 1
  ) {
    const character =
      characters[index] ?? ''
    context.fillText(
      character,
      cursor,
      y,
    )
    cursor +=
      context.measureText(
        character,
      ).width

    if (index < characters.length - 1) {
      cursor += typography.letterSpacing
    }
  }
}

export function drawDiCInput(
  context: CanvasRenderingContext2D,
  content: DiCInputContent,
  frame: DiCViewFrame,
  environment: DiCInputDrawEnvironment,
): void {
  const typography =
    environment.typography
  const rawValue = visibleValue(content)
  const placeholder =
    content.input.placeholder ?? ''
  const empty =
    rawValue.length === 0
  const display =
    empty
      ? placeholder
      : rawValue

  applyDiCTextFont(
    context,
    {
      ...typography,
      align: 'start',
      wrap:
        content.input.multiline
          ? 'wrap'
          : 'nowrap',
      overflow: 'clip',
      case: 'none',
    },
  )

  context.save()
  context.beginPath()
  context.rect(
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  )
  context.clip()

  context.fillStyle =
    empty
      ? resolveDiCColor(
          environment.theme.components.Input?.base
            ?.placeholderColor ??
            'secondary',
          environment.theme,
          typography.color,
        )
      : typography.color

  if (!content.input.multiline) {
    const textY =
      frame.y +
      Math.max(
        0,
        (
          frame.height -
          typography.lineHeight
        ) / 2,
      )
    const textX =
      frame.x -
      (content.scrollLeft ?? 0)
    const line: InputLine = {
      text: display,
      start: 0,
      end: content.value.length,
      width: textWidth(
        context,
        display,
        typography,
      ),
    }

    drawSelection(
      context,
      line,
      textX,
      textY,
      typography.lineHeight,
      content,
      environment,
    )

    drawLineText(
      context,
      display,
      textX,
      textY,
      typography,
    )
    context.restore()
    return
  }

  const lines = hardWrappedLines(
    context,
    display,
    frame.width,
    typography,
  )
  const scrollTop =
    content.scrollTop ?? 0
  const scrollLeft =
    content.scrollLeft ?? 0

  for (
    let index = 0;
    index < lines.length;
    index += 1
  ) {
    const line = lines[index]
    if (line === undefined) continue

    const y =
      frame.y +
      index * typography.lineHeight -
      scrollTop

    if (
      y + typography.lineHeight < frame.y ||
      y > frame.y + frame.height
    ) {
      continue
    }

    const x =
      frame.x -
      scrollLeft

    drawSelection(
      context,
      line,
      x,
      y,
      typography.lineHeight,
      content,
      environment,
    )

    drawLineText(
      context,
      line.text,
      x,
      y,
      typography,
    )
  }

  context.restore()
}
