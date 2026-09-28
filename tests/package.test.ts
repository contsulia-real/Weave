import { describe, expect, it } from 'vitest'

describe('Weave built package entry', () => {
  it('loads the built ES module with current public exports', async () => {
    const weave = await import('../dist/weave.js')

    expect(weave).toBeDefined()
    expect(weave.Badge).toBeTypeOf('function')
    expect(weave.List).toBeTypeOf('function')
    expect(weave.ListItem).toBeTypeOf('function')
    expect(weave.Link).toBeTypeOf('function')
    expect(weave.Radio).toBeTypeOf('function')
    expect(weave.Checkbox).toBeTypeOf('function')
    expect(weave.createRoot).toBeTypeOf('function')
  })
})