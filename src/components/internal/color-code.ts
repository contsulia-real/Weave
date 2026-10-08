export type ColorCodeFormat = 'hex' | 'rgb' | 'hsl' | 'hsv'

export function normalizeHex(value: string | number | undefined): string {
  const text = String(value ?? '#000000')
    .trim()
    .toLowerCase()
  if (/^#[\da-f]{6}$/.test(text)) return text
  if (/^#[\da-f]{3}$/.test(text)) {
    return '#' + [...text.slice(1)].map((digit) => digit + digit).join('')
  }
  return '#000000'
}

function channels(hex: string): [number, number, number] {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)) as [
    number,
    number,
    number,
  ]
}

export function rgbToHsv(hex: string): [number, number, number] {
  const [r, g, b] = channels(hex).map((channel) => channel / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let hue = 0
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
  }
  return [Math.round((hue * 60 + 360) % 360), max === 0 ? 0 : delta / max, max]
}

export function hsvToHex(hue: number, saturation: number, value: number): string {
  const chroma = value * saturation
  const segment = (((hue % 360) + 360) % 360) / 60
  const x = chroma * (1 - Math.abs((segment % 2) - 1))
  let rgb: number[]
  if (segment < 1) rgb = [chroma, x, 0]
  else if (segment < 2) rgb = [x, chroma, 0]
  else if (segment < 3) rgb = [0, chroma, x]
  else if (segment < 4) rgb = [0, x, chroma]
  else if (segment < 5) rgb = [x, 0, chroma]
  else rgb = [chroma, 0, x]
  const offset = value - chroma
  return (
    '#' +
    rgb
      .map((part) =>
        Math.round((part + offset) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

function rgbToHsl(hex: string): [number, number, number] {
  const [r, g, b] = channels(hex).map((channel) => channel / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2
  const chroma = max - min
  const saturation = chroma === 0 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1))
  return [rgbToHsv(hex)[0], saturation, lightness]
}

export function formatColorCode(hex: string, format: ColorCodeFormat): string {
  if (format === 'hex') return hex
  if (format === 'rgb') return 'rgb(' + channels(hex).join(', ') + ')'
  const [hue, saturation, last] = format === 'hsl' ? rgbToHsl(hex) : rgbToHsv(hex)
  const percent = (value: number) => String(Math.round(value * 1000) / 10)
  return format + '(' + hue + ', ' + percent(saturation) + '%, ' + percent(last) + '%)'
}

export function parseColorCode(text: string, format: ColorCodeFormat): string | null {
  const value = text.trim()
  if (format === 'hex') {
    return /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(value) ? normalizeHex(value) : null
  }
  const match =
    /^(rgb|hsl|hsv)\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(%)?\s*,\s*(\d+(?:\.\d+)?)\s*(%)?\s*\)$/i.exec(
      value,
    )
  if (match === null || match[1]?.toLowerCase() !== format) return null
  const first = Number(match[2])
  const second = Number(match[3])
  const third = Number(match[5])
  if (format === 'rgb') {
    if (
      match[4] ||
      match[6] ||
      ![first, second, third].every((n) => Number.isInteger(n) && n >= 0 && n <= 255)
    )
      return null
    return '#' + [first, second, third].map((n) => n.toString(16).padStart(2, '0')).join('')
  }
  if (!match[4] || !match[6] || first > 360 || second > 100 || third > 100) return null
  if (format === 'hsv') return hsvToHex(first, second / 100, third / 100)
  const lightness = third / 100
  const chroma = ((1 - Math.abs(2 * lightness - 1)) * second) / 100
  const brightness = lightness + chroma / 2
  return hsvToHex(first, brightness === 0 ? 0 : chroma / brightness, brightness)
}
