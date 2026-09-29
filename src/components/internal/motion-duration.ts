export function durationMilliseconds(value: number | string | undefined, fallback: number): number {
  if (typeof value === 'number') {
    return Math.max(0, value)
  }

  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()
  const parsed = Number.parseFloat(normalized)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  if (normalized.endsWith('ms')) {
    return Math.max(0, parsed)
  }

  if (normalized.endsWith('s')) {
    return Math.max(0, parsed * 1000)
  }

  return fallback
}
