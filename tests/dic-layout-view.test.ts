import { describe, expect, it } from 'vitest'
import { layoutDiCView } from '../src/renderers/dic/layout-view'

describe('DiC View layout', () => {
  it('resolves dimensions and padding into frame geometry', () => {
    const layout = layoutDiCView(
      {
        width: '50%',
        height: 6,
        paddingTop: 1,
        paddingRight: 2,
        paddingBottom: 0.5,
        paddingLeft: 1,
      },
      {
        x: 10,
        y: 20,
        width: 400,
        height: 240,
      },
      {
        rem: 16,
      },
    )

    expect(layout.frame).toEqual({
      x: 10,
      y: 20,
      width: 200,
      height: 96,
    })
    expect(layout.contentFrame).toEqual({
      x: 26,
      y: 36,
      width: 152,
      height: 72,
    })
  })

  it('fills unconstrained dimensions and rejects intrinsic sizing for now', () => {
    expect(
      layoutDiCView(
        {},
        {
          width: 320,
          height: 180,
        },
      ).frame,
    ).toEqual({
      x: 0,
      y: 0,
      width: 320,
      height: 180,
    })

    expect(() =>
      layoutDiCView(
        {
          width: 'content',
        },
        {
          width: 320,
          height: 180,
        },
      ),
    ).toThrow('requires tree measurement')
  })
})
