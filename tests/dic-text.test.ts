import { describe, expect, it, vi } from 'vitest'
import { resolveText } from '../src/core/resolved-text'
import { resolveView } from '../src/core/resolved-view'
import type { TextProps } from '../src/core/text-types'
import { compileDiCText } from '../src/renderers/dic/compile-text'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import { drawDiCViewTree } from '../src/renderers/dic/draw-view'
import {
  layoutDiCViewTree,
  measureDiCIntrinsicSize,
} from '../src/renderers/dic/layout-tree'
import { layoutDiCText } from '../src/renderers/dic/text-layout'
import {
  createRootDiCTypography,
} from '../src/renderers/dic/text-style'
import {
  defaultBreakpoints,
  defaultTheme,
} from '../src/theme/default-theme'

function canvasContext() {
  let font = ''
  const fillText = vi.fn()

  const context = {
    globalAlpha: 1,
    fillStyle: '',
    textBaseline: 'alphabetic',
    get font() {
      return font
    },
    set font(value: string) {
      font = value
    },
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    transform: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    roundRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    fillText,
    measureText: vi.fn((value: string) => {
      const match = font.match(/([0-9.]+)px/)
      const fontSize =
        match?.[1] === undefined
          ? 16
          : Number.parseFloat(match[1])

      return {
        width: Array.from(value).length * fontSize * 0.5,
      }
    }),
    createLinearGradient: vi.fn(),
    createRadialGradient: vi.fn(),
  } as unknown as CanvasRenderingContext2D

  return {
    context,
    fillText,
  }
}

describe('DiC Text', () => {
  it('keeps Text semantics renderer-neutral and applies responsive typo', () => {
    const props: TextProps = {
      typo: 'body-small',
      color: 'secondary',
      md: {
        typo: 'body-large',
        color: 'primary',
      },
    }

    const text = resolveText(
      props,
      defaultBreakpoints,
    )

    expect(text.base).toMatchObject({
      typo: 'body-small',
      color: 'secondary',
    })
    expect(text.responsive).toContainEqual({
      name: 'md',
      minWidth: 48,
      style: expect.objectContaining({
        typo: 'body-large',
        color: 'primary',
      }),
    })
    expect(JSON.stringify(text)).not.toContain('var(')
    expect(JSON.stringify(text)).not.toContain('rem')
  })

  it('measures Text as intrinsic tree content', () => {
    const { context } = canvasContext()
    const textNode = compileDiCText(
      resolveView({}, defaultBreakpoints),
      resolveText(
        {
          typo: 'body-medium',
        },
        defaultBreakpoints,
      ),
      'Hello',
    )
    const root = compileDiCView(
      resolveView(
        {
          layout: 'flex',
          direction: 'column',
          align: 'start',
          width: 20,
          height: 'content',
          padding: 1,
        },
        defaultBreakpoints,
      ),
      {
        children: [textNode],
      },
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 500,
        height: 400,
      },
      {
        viewportWidth: 500,
        rem: 16,
        context,
        theme: defaultTheme,
      },
    )

    expect(layout.frame.width).toBe(320)
    expect(layout.frame.height).toBeCloseTo(53)
    expect(layout.children[0]?.frame.width).toBeCloseTo(35)
    expect(layout.children[0]?.frame.height).toBeCloseTo(21)
  })

  it('inherits typography context from an ancestor View', () => {
    const { context } = canvasContext()
    const textNode = compileDiCText(
      resolveView({}, defaultBreakpoints),
      resolveText({}, defaultBreakpoints),
      'Hi',
    )
    const root = compileDiCView(
      resolveView(
        {
          layout: 'flex',
          direction: 'column',
          align: 'start',
          width: 20,
          height: 'content',
        },
        defaultBreakpoints,
      ),
      {
        typography: {
          typo: 'label-medium',
        },
        children: [textNode],
      },
    )

    const layout = layoutDiCViewTree(
      root,
      {
        width: 500,
        height: 300,
      },
      {
        viewportWidth: 500,
        rem: 16,
        context,
        theme: defaultTheme,
      },
    )

    expect(layout.typography?.fontSize).toBe(13)
    expect(layout.children[0]?.typography?.fontSize).toBe(13)
    expect(layout.children[0]?.frame.height).toBeCloseTo(16.25)
  })

  it('uses responsive Text typography during measurement', () => {
    const { context } = canvasContext()
    const props: TextProps = {
      typo: 'body-small',
      md: {
        typo: 'body-large',
      },
    }
    const node = compileDiCText(
      resolveView(
        {
          width: 'content',
          height: 'content',
        },
        defaultBreakpoints,
      ),
      resolveText(props, defaultBreakpoints),
      'Hello',
    )

    const small = measureDiCIntrinsicSize(
      node,
      {
        width: 500,
        height: 200,
      },
      {
        viewportWidth: 700,
        rem: 16,
        context,
        theme: defaultTheme,
      },
    )
    const large = measureDiCIntrinsicSize(
      node,
      {
        width: 500,
        height: 200,
      },
      {
        viewportWidth: 900,
        rem: 16,
        context,
        theme: defaultTheme,
      },
    )

    // body-small uses 0.005em letter spacing:
    // 5 glyphs => 4 × 0.06px extra at 12px.
    expect(small.width).toBeCloseTo(30.24)
    expect(small.height).toBeCloseTo(17.4)
    expect(large.width).toBeCloseTo(40)
    expect(large.height).toBeCloseTo(24.8)
  })

  it('wraps and forces ellipsis when maxLines truncates content', () => {
    const { context } = canvasContext()
    const typography = createRootDiCTypography(
      defaultTheme,
      16,
    )
    const content = compileDiCText(
      resolveView({}, defaultBreakpoints),
      resolveText(
        {
          typo: 'body-large',
          maxLines: 2,
          overflow: 'ellipsis',
        },
        defaultBreakpoints,
      ),
      'one two three',
    ).content

    if (content?.kind !== 'text') {
      throw new Error('Expected text content')
    }

    const layout = layoutDiCText(
      content,
      {
        maxWidth: 40,
        maxHeight: 200,
        rem: 16,
      },
      {
        context,
        theme: defaultTheme,
        typography,
        viewportWidth: 500,
        containerWidth: 500,
        rem: 16,
      },
    )

    expect(layout.lines.map((line) => line.text)).toEqual([
      'one',
      'two…',
    ])
    expect(layout.height).toBeCloseTo(49.6)
  })

  it('draws Text content through the recursive View tree', () => {
    const { context, fillText } = canvasContext()
    const node = compileDiCText(
      resolveView(
        {
          width: 10,
          height: 3,
        },
        defaultBreakpoints,
      ),
      resolveText(
        {
          typo: 'body-large',
          align: 'center',
        },
        defaultBreakpoints,
      ),
      42,
    )

    const layout = layoutDiCViewTree(
      node,
      {
        width: 300,
        height: 100,
      },
      {
        viewportWidth: 300,
        rem: 16,
        context,
        theme: defaultTheme,
      },
    )

    drawDiCViewTree(
      context,
      layout,
      {
        theme: defaultTheme,
        rem: 16,
        viewportWidth: 300,
      },
    )

    const call = fillText.mock.calls[0]
    expect(call?.[0]).toBe('42')
    expect(call?.[1]).toBe(72)
    expect(call?.[2]).toBeCloseTo(4.4)
  })

  it('fails explicitly for unsupported balanced and justified text', () => {
    const { context } = canvasContext()
    const typography = createRootDiCTypography(
      defaultTheme,
      16,
    )

    const balanced = compileDiCText(
      resolveView({}, defaultBreakpoints),
      resolveText(
        {
          wrap: 'balance',
        },
        defaultBreakpoints,
      ),
      'balanced text',
    ).content

    const justified = compileDiCText(
      resolveView({}, defaultBreakpoints),
      resolveText(
        {
          align: 'justify',
        },
        defaultBreakpoints,
      ),
      'justified text',
    ).content

    if (
      balanced?.kind !== 'text' ||
      justified?.kind !== 'text'
    ) {
      throw new Error('Expected text content')
    }

    const environment = {
      context,
      theme: defaultTheme,
      typography,
      viewportWidth: 500,
      containerWidth: 500,
      rem: 16,
    }

    expect(() =>
      layoutDiCText(
        balanced,
        {
          maxWidth: 200,
          maxHeight: 100,
          rem: 16,
        },
        environment,
      ),
    ).toThrow('balanced text wrapping is not implemented yet')

    expect(() =>
      layoutDiCText(
        justified,
        {
          maxWidth: 200,
          maxHeight: 100,
          rem: 16,
        },
        environment,
      ),
    ).toThrow('justified text drawing is not implemented yet')
  })
})
