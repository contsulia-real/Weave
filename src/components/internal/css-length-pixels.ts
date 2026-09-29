export function cssLengthPixels(element: HTMLElement, value: string): number {
  const normalized = value.trim()

  if (normalized.length === 0 || normalized === '0') {
    return 0
  }

  const direct = /^(-?\d*\.?\d+)(px|rem)$/.exec(normalized)

  if (direct !== null) {
    const amount = Number.parseFloat(direct[1] ?? '0')

    if (direct[2] === 'px') {
      return amount
    }

    const rootSize =
      Number.parseFloat(
        element.ownerDocument.defaultView?.getComputedStyle(element.ownerDocument.documentElement)
          .fontSize ?? '16',
      ) || 16

    return amount * rootSize
  }

  const probe = element.ownerDocument.createElement('div')

  probe.style.position = 'fixed'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.width = normalized
  probe.style.height = '0'
  probe.style.fontSize = element.ownerDocument.defaultView?.getComputedStyle(element).fontSize ?? ''

  element.ownerDocument.body.append(probe)

  const pixels = probe.getBoundingClientRect().width

  probe.remove()
  return pixels
}
