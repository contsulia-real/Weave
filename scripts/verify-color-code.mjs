import assert from 'node:assert/strict'
import {
  colorAlpha,
  formatColorCode,
  normalizeHex,
  parseColorCode,
  withAlpha,
} from '../src/components/internal/color-code.ts'

assert.equal(normalizeHex('#abc'), '#aabbcc')
assert.equal(normalizeHex('#abcd'), '#aabbccdd')
assert.equal(normalizeHex('#123456ff'), '#123456')
assert.equal(normalizeHex('#12345600'), '#12345600')
assert.equal(withAlpha('#123456', 128), '#12345680')
assert.equal(withAlpha('#12345680', 255), '#123456')
assert.equal(colorAlpha('#12345680'), 128)
assert.equal(colorAlpha('#123456'), 255)

assert.equal(parseColorCode('rgba(18, 52, 86, 0.5)', 'rgb'), '#12345680')
assert.equal(parseColorCode('hsla(0, 100%, 50%, 0.5)', 'hsl'), '#ff000080')
assert.equal(parseColorCode('hsva(120, 100%, 100%, 0.5)', 'hsv'), '#00ff0080')
assert.equal(parseColorCode('rgba(18, 52, 86, 1.5)', 'rgb'), null)
assert.equal(parseColorCode('rgba(18, 52, 86, 0.5)', 'hsl'), null)
assert.equal(formatColorCode('#12345680', 'rgb'), 'rgba(18, 52, 86, 0.502)')

for (const format of ['hex', 'rgb', 'hsl', 'hsv']) {
  const parsed = parseColorCode(formatColorCode('#e76b9480', format), format)
  assert.equal(colorAlpha(parsed ?? ''), 128, `${format} must retain alpha`)
}

console.log('Color-code alpha regression checks passed.')
