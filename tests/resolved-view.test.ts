import { describe, expect, it } from 'vitest'
import { resolveView } from '../src/core/resolved-view'
import type { ViewProps } from '../src/core/view-types'
import { defaultBreakpoints } from '../src/theme/default-theme'

describe('ResolvedView IR', () => {
  it('normalizes View aliases without compiling renderer strings', () => {
    const props: ViewProps = {
      width: 10,
      height: 6,
      padding: 1,
      paddingTop: 2,
      background: 'primary',
      radius: 'large',
      opacity: 0.8,
      translateX: 1,
      scale: 1.05,
      hover: {
        opacity: 1,
        translateY: -0.25,
      },
      md: {
        width: 12,
        paddingX: 1.5,
      },
      id: 'card',
      label: 'Card',
      onClick: () => {},
      focusable: true,
      autoFocus: true,
      tabIndex: -1,
    }

    const resolved = resolveView(props, defaultBreakpoints)

    expect(resolved.style).toMatchObject({
      width: 10,
      height: 6,
      paddingTop: 2,
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
        { translate: [1, 0] },
        { scale: 1.05 },
      ],
    })
    expect(resolved.style).not.toHaveProperty('padding')
    expect(resolved.style).not.toHaveProperty('radius')
    expect(resolved.style).not.toHaveProperty('translateX')
    expect(resolved.semantics.label).toBe('Card')
    expect(resolved.eventTarget).toEqual({
      id: 'card',
    })
    expect(resolved.events.onClick).toBe(
      props.onClick,
    )
    expect(resolved.interaction).toEqual({
      focusable: true,
      autoFocus: true,
      tabIndex: -1,
    })

    expect(resolved.states.hover).toMatchObject({
      opacity: 1,
      transform: [{ translate: [0, -0.25] }],
    })

    expect(resolved.responsive).toContainEqual(
      expect.objectContaining({
        name: 'md',
        minWidth: 48,
        scope: 'viewport',
        style: expect.objectContaining({
          width: 12,
          paddingRight: 1.5,
          paddingLeft: 1.5,
        }),
      }),
    )

    expect(JSON.stringify(resolved)).not.toContain('rem')
    expect(JSON.stringify(resolved)).not.toContain('--weave-')
  })
})
