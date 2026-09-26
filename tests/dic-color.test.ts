import { describe, expect, it } from 'vitest'
import { resolveDiCColor } from '../src/renderers/dic/color'
import { defaultTheme } from '../src/theme/default-theme'

describe('DiC color resolution', () => {
  it('resolves semantic color tokens without CSS variables', () => {
    expect(
      resolveDiCColor(
        'primary',
        defaultTheme,
      ),
    ).toBe('#6d5dfc')
  })

  it('resolves nested Weave color variables inside theme expressions', () => {
    const offSwitch =
      defaultTheme.components.Switch?.base?.background

    expect(offSwitch).toBeDefined()

    const resolved = resolveDiCColor(
      offSwitch ?? '',
      defaultTheme,
    )

    expect(resolved).toContain('#d8cec4')
    expect(resolved).toContain('#fffdfa')
    expect(resolved).not.toContain('var(')
  })

  it('fails explicitly for unresolved CSS variables', () => {
    expect(() =>
      resolveDiCColor(
        'var(--foreign-color)',
        defaultTheme,
      ),
    ).toThrow('Unsupported DiC color variable')
  })
})
