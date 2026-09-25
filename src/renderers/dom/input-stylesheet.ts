const stylesheet = `
:where(.weave-input) {
  --weave-component-display: block;
  --weave-component-background: var(--weave-input-theme-background);
  --weave-component-color: var(--weave-input-theme-color);
  --weave-component-min-height: var(--weave-input-theme-min-height);
  --weave-component-padding-top: var(--weave-input-theme-padding-y);
  --weave-component-padding-bottom: var(--weave-input-theme-padding-y);
  --weave-component-padding-left: var(--weave-input-theme-padding-x);
  --weave-component-padding-right: var(--weave-input-theme-padding-x);
  --weave-component-border-top-width: var(--weave-input-theme-border-width);
  --weave-component-border-right-width: var(--weave-input-theme-border-width);
  --weave-component-border-bottom-width: var(--weave-input-theme-border-width);
  --weave-component-border-left-width: var(--weave-input-theme-border-width);
  --weave-component-border-top-color: var(--weave-input-theme-border-color);
  --weave-component-border-right-color: var(--weave-input-theme-border-color);
  --weave-component-border-bottom-color: var(--weave-input-theme-border-color);
  --weave-component-border-left-color: var(--weave-input-theme-border-color);
  --weave-component-border-style: solid;
  --weave-component-border-top-left-radius: var(--weave-input-theme-radius);
  --weave-component-border-top-right-radius: var(--weave-input-theme-radius);
  --weave-component-border-bottom-right-radius: var(--weave-input-theme-radius);
  --weave-component-border-bottom-left-radius: var(--weave-input-theme-radius);
  --weave-component-outline-width: 0;

  font: inherit;
  font-size: var(--weave-input-theme-font-size);
  line-height: var(--weave-input-theme-line-height);
  transition:
    background-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    border-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-input::placeholder) {
  color: var(--weave-input-theme-placeholder-color);
  opacity: 1;
}

:where(.weave-input:focus-visible) {
  --weave-component-outline-width: var(
    --weave-input-theme-focus-outline-width
  );
  --weave-component-outline-color: var(
    --weave-input-theme-focus-outline-color
  );
  --weave-component-outline-style: var(
    --weave-input-theme-focus-outline-style
  );
  --weave-component-outline-offset: var(
    --weave-input-theme-focus-outline-offset
  );
}

:where(.weave-input[aria-disabled="true"]) {
  --weave-component-opacity: var(--weave-input-theme-disabled-opacity);
  --weave-component-cursor: var(--weave-input-theme-disabled-cursor);
}

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
