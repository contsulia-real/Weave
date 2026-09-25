import { describe, expect, it } from 'vitest'
import {
  angle,
  background,
  dimension,
  length,
  time,
  transformValue,
} from '../src/core/values'

describe('Weave value normalization', () => {
  it('converts public scale numbers to rem', () => {
    expect(length(1)).toBe('1rem')
    expect(length(0.5)).toBe('0.5rem')
    expect(length('12px')).toBe('12px')
  })

  it('converts public time numbers to ms', () => {
    expect(time(120)).toBe('120ms')
    expect(time('0.2s')).toBe('0.2s')
  })

  it('keeps non-scale angle semantics', () => {
    expect(angle(20)).toBe('20deg')
    expect(angle('0.5turn')).toBe('0.5turn')
  })

  it('maps semantic dimensions to CSS', () => {
    expect(dimension('fill')).toBe('100%')
    expect(dimension('fit')).toBe('fit-content')
    expect(dimension('content')).toBe('max-content')
  })

  it('resolves gradient stops and explicit transform order', () => {
    expect(
      background({
        type: 'linear',
        angle: 90,
        stops: [
          ['primary', 0],
          ['transparent', 1],
        ],
      }),
    ).toContain('linear-gradient(90deg')

    expect(
      transformValue({
        transform: [
          { translateX: 1 },
          { rotate: 5 },
          { scale: 1.05 },
        ],
      }),
    ).toBe('translateX(1rem) rotate(5deg) scale(1.05)')
  })
})
