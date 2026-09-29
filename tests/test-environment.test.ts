import { describe, expect, it } from 'vitest'

describe('test environment', () => {
  it('enables React act support in the jsdom realm', () => {
    const globalFlag = (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT?: boolean
      }
    ).IS_REACT_ACT_ENVIRONMENT

    const windowFlag = (
      window as typeof window & {
        IS_REACT_ACT_ENVIRONMENT?: boolean
      }
    ).IS_REACT_ACT_ENVIRONMENT

    expect(globalFlag).toBe(true)
    expect(windowFlag).toBe(true)
  })
})
