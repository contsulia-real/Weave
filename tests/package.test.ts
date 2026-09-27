import { describe, expect, it } from 'vitest'

describe('Weave package entry', () => {
  it('loads as an ES module', async () => {
    const weave = await import('../src/index')

    expect(weave).toBeDefined()
  })
})
