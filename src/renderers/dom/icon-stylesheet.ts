const stylesheet = `
:where(.weave-icon) {
  --weave-component-display: inline-flex;
  --weave-component-align-items: center;
  --weave-component-justify-content: center;
  --weave-component-flex-shrink: 0;
  line-height: 0;
  vertical-align: middle;
}

:where(.weave-icon--small) {
  --weave-component-width: 0.875rem;
  --weave-component-height: 0.875rem;
}

:where(.weave-icon--medium) {
  --weave-component-width: 1rem;
  --weave-component-height: 1rem;
}

:where(.weave-icon--large) {
  --weave-component-width: 1.25rem;
  --weave-component-height: 1.25rem;
}

:where(.weave-icon--xlarge) {
  --weave-component-width: 1.5rem;
  --weave-component-height: 1.5rem;
}

:where(.weave-icon) > :where(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
`

export function ensureIconStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-icon-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveIconStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
