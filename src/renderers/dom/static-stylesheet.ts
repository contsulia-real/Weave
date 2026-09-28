export function ensureStaticStylesheet(
  name: string,
  stylesheet: string,
): void {
  if (typeof document === 'undefined') return

  const attribute = `data-weave-${name}-styles`
  const existing = document.querySelector<HTMLStyleElement>(
    `style[${attribute}]`,
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.setAttribute(attribute, '')
  element.textContent = stylesheet
  document.head.append(element)
}
