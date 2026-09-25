const stylesheet = `
:where([data-weave-input-multiline]) {
  resize: none;
}
`

export function ensureInputStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-input-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveInputStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
