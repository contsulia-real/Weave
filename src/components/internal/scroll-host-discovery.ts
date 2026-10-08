export function usesCustomScrollbar(element: HTMLElement): boolean {
  if (
    element.closest('.weave-scrollbar') !== null ||
    element.classList.contains('weave-scroll-host')
  ) {
    return false
  }

  const view = element.ownerDocument.defaultView
  if (view === null) return false

  const style = view.getComputedStyle(element)
  const documentScroller = element.ownerDocument.scrollingElement === element
  const canScroll = (value: string) => value === 'auto' || value === 'scroll' || value === 'overlay'

  const vertical = documentScroller || canScroll(style.overflowY)
  const horizontal = documentScroller || canScroll(style.overflowX)

  return (
    (vertical &&
      (style.overflowY === 'scroll' || element.scrollHeight > element.clientHeight + 1)) ||
    (horizontal && (style.overflowX === 'scroll' || element.scrollWidth > element.clientWidth + 1))
  )
}
