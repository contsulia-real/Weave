import { describe, expect, it } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import { defaultBreakpoints } from '../src/theme/default-theme'

describe('DiC View compiler', () => {
  it('compiles the first View paint slice from ResolvedView', () => {
    const props: ViewProps = {
      width: 10,
      height: 6,
      padding: 1,
      background: 'primary',
      radius: 'large',
      opacity: 0.8,
      translateX: 0.5,
      rotate: 5,
      hover: {
        opacity: 1,
      },
      md: {
        width: 12,
        radius: 'medium',
      },
    }

    const node = compileDiCView(
      resolveView(props, defaultBreakpoints),
    )

    expect(node.kind).toBe('view')
    expect(node.paint).toEqual({
      width: 10,
      height: 6,
      paddingTop: 1,
      paddingRight: 1,
      paddingBottom: 1,
      paddingLeft: 1,
      background: 'primary',
      radiusTopLeft: 'large',
      radiusTopRight: 'large',
      radiusBottomRight: 'large',
      radiusBottomLeft: 'large',
      opacity: 0.8,
      transform: [
        { translate: [0.5, 0] },
        { rotate: 5 },
      ],
    })

    expect(node.states.hover).toMatchObject({
      opacity: 1,
    })
    expect(node.states.hover).not.toHaveProperty('width')
    expect(node.states.hover).not.toHaveProperty('background')

    expect(node.responsive).toContainEqual(
      expect.objectContaining({
        name: 'md',
        minWidth: 48,
        scope: 'viewport',
        paint: expect.objectContaining({
          width: 12,
          radiusTopLeft: 'medium',
          radiusTopRight: 'medium',
          radiusBottomRight: 'medium',
          radiusBottomLeft: 'medium',
        }),
      }),
    )

    expect(JSON.stringify(node)).not.toContain('rem')
    expect(JSON.stringify(node)).not.toContain('var(')
  })
})
