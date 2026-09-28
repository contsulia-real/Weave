const stylesheet = `
:where(.weave-link) {
  --weave-component-display: inline-flex;
  --weave-component-align-items: center;
  --weave-component-position: relative;
  --weave-component-color: var(--weave-link-theme-color);
  --weave-component-cursor: pointer;
  --weave-component-outline-width: 0;

  gap: var(--weave-link-theme-gap);
  color: var(--weave-link-theme-color);
  text-decoration: none;
  vertical-align: baseline;
}

:where(.weave-link)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: calc(-1 * var(--weave-link-theme-underline-offset));
  width: 45%;
  height: var(--weave-link-theme-underline-thickness);
  border-radius: 9999px;
  background: var(--weave-link-theme-underline-color);
  pointer-events: none;
  transition:
    width var(--weave-motion-duration-normal)
      var(--weave-motion-curve-standard),
    background-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-link:hover)::after {
  width: 60%;
}

:where(.weave-link:active)::after {
  width: 80%;
}

:where(.weave-link:focus-visible) {
  --weave-component-outline-width: var(--weave-link-theme-focus-outline-width);
  --weave-component-outline-color: var(--weave-link-theme-focus-outline-color);
  --weave-component-outline-style: var(--weave-link-theme-focus-outline-style);
  --weave-component-outline-offset: var(--weave-link-theme-focus-outline-offset);
}

:where(.weave-link__text) {
  min-width: 0;
}

:where(.weave-link__icon) {
  flex: 0 0 auto;
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-link)::after {
    transition: none;
  }
}
`

export function ensureLinkStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-link-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveLinkStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
