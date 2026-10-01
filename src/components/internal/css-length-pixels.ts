export function cssLengthPixels(
  element: HTMLElement,
  value: string,
  axis: 'width' | 'height' = 'width',
  referencePixels?: number,
): number {
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

  const document = element.ownerDocument
  const probe = document.createElement('div')
  const computed = document.defaultView?.getComputedStyle(element)

  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.width = axis === 'width' ? normalized : '0'
  probe.style.height = axis === 'height' ? normalized : '0'
  probe.style.fontSize = computed?.fontSize ?? ''

  let measurementHost: HTMLElement = document.body
  let reference: HTMLDivElement | null = null

  if (referencePixels !== undefined && Number.isFinite(referencePixels)) {
    reference = document.createElement('div')
    reference.style.position = 'fixed'
    reference.style.visibility = 'hidden'
    reference.style.pointerEvents = 'none'
    reference.style.top = '0'
    reference.style.left = '0'
    reference.style.width = axis === 'width' ? `${Math.max(0, referencePixels)}px` : '0'
    reference.style.height = axis === 'height' ? `${Math.max(0, referencePixels)}px` : '0'
    reference.style.fontSize = computed?.fontSize ?? ''
    element.append(reference)
    measurementHost = reference
  }

  measurementHost.append(probe)

  const rect = probe.getBoundingClientRect()
  const pixels = axis === 'width' ? rect.width : rect.height

  reference?.remove()
  if (reference === null) {
    probe.remove()
  }

  return pixels
}
