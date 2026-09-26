import { describe, expect, it } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { compileDiCView } from '../src/renderers/dic/compile-view'
import { resolveDiCViewPaint } from '../src/renderers/dic/resolve-paint'
import { defaultBreakpoints } from '../src/theme/default-theme'

describe('DiC View paint resolution', () => {
  it('applies active breakpoints before interaction states', () => {
    const props: ViewProps = {
      width: 10,
      background: 'primary',
      opacity: 0.6,
      md: {
        width: 12,
        background: 'secondary',
      },
      containerMd: {
        opacity: 0.75,
      },
      hover: {
        opacity: 0.9,
      },
      disabledStyle: {
        background: 'disabled',
      },
    }

    const node = compileDiCView(
      resolveView(props, defaultBreakpoints),
    )

    expect(
      resolveDiCViewPaint(node, {
        viewportWidth: 700,
        containerWidth: 900,
        rem: 16,
      }),
    ).toMatchObject({
      width: 10,
      background: 'primary',
      opacity: 0.75,
    })

    expect(
      resolveDiCViewPaint(node, {
        viewportWidth: 900,
        containerWidth: 900,
        rem: 16,
        state: {
          hover: true,
          disabled: true,
        },
      }),
    ).toMatchObject({
      width: 12,
      background: 'disabled',
      opacity: 0.9,
    })
  })
})
