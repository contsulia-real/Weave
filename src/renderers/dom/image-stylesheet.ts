const stylesheet = `
@property --weave-image-fit {
  syntax: "*";
  inherits: false;
}

@property --weave-image-position {
  syntax: "*";
  inherits: false;
}

:where([data-weave-image]) {
  object-fit: var(--weave-image-fit, fill);
  object-position: var(--weave-image-position, 50% 50%);
}
`

export function ensureImageStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-image-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveImageStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
