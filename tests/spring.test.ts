import {
  describe,
  expect,
  it,
} from 'vitest'
import { solveSpring } from '../src/core/spring'

describe('spring solver', () => {
  it('solves an underdamped spring with physical overshoot', () => {
    const spring = solveSpring({
      stiffness: 420,
      damping: 30,
      mass: 0.9,
    })

    expect(spring.durationMs).toBeGreaterThan(100)
    expect(spring.durationMs).toBeLessThan(3000)
    expect(spring.samples[0]).toBe(0)
    expect(spring.samples.at(-1)).toBe(1)
    expect(Math.max(...spring.samples)).toBeGreaterThan(1)
    expect(spring.easing).toMatch(/^linear\(/)
    expect(spring.easing).toContain('100%')
  })

  it('keeps a strongly damped spring finite without requiring overshoot', () => {
    const spring = solveSpring({
      stiffness: 180,
      damping: 60,
      mass: 1,
    })

    expect(spring.durationMs).toBeGreaterThan(0)
    expect(spring.durationMs).toBeLessThanOrEqual(10_000)
    expect(spring.samples.every(Number.isFinite)).toBe(true)
    expect(spring.samples.at(-1)).toBe(1)
  })

  it('normalizes invalid physical parameters to safe defaults', () => {
    const spring = solveSpring({
      stiffness: -1,
      damping: 0,
      mass: Number.NaN,
      velocity: Number.POSITIVE_INFINITY,
    })

    expect(spring.durationMs).toBeGreaterThan(0)
    expect(spring.samples.every(Number.isFinite)).toBe(true)
  })
})
