import type {
  DiCIntrinsicEnvironment,
  DiCTextContent,
} from './compile-view'
import type { DiCViewFrame } from './draw-view'
import {
  applyDiCTextFont,
  layoutDiCText,
} from './text-layout'

function graphemes(value: string): readonly string[] {
  return Array.from(value)
}

function drawLine(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
): void {
  if (letterSpacing === 0) {
    context.fillText(text, x, y)
    return
  }

  let cursor = x
  const chars = graphemes(text)

  for (const [index, character] of chars.entries()) {
    context.fillText(character, cursor, y)
    cursor += context.measureText(character).width

    if (index < chars.length - 1) {
      cursor += letterSpacing
    }
  }
}

export function drawDiCText(
  context: CanvasRenderingContext2D,
  content: DiCTextContent,
  frame: DiCViewFrame,
  environment: Omit<
    DiCIntrinsicEnvironment,
    'context'
  >,
): void {
  context.save()
  context.translate(frame.x, frame.y)

  const layout = layoutDiCText(
    content,
    {
      maxWidth: frame.width,
      maxHeight: frame.height,
      rem: environment.rem,
    },
    {
      ...environment,
      context,
    },
  )
  const style = layout.style

  if (
    style.overflow === 'ellipsis' ||
    style.maxLines !== undefined
  ) {
    context.beginPath()
    context.rect(0, 0, frame.width, frame.height)
    context.clip()
  }

  applyDiCTextFont(context, style)
  context.fillStyle = style.color

  for (const [index, line] of layout.lines.entries()) {
    const x =
      style.align === 'center'
        ? (frame.width - line.width) / 2
        : style.align === 'end'
          ? frame.width - line.width
          : 0
    const leading = Math.max(
      0,
      style.lineHeight - style.fontSize,
    ) / 2
    const y =
      index * style.lineHeight +
      leading

    drawLine(
      context,
      line.text,
      x,
      y,
      style.letterSpacing,
    )
  }

  context.restore()
}
