const stylesheet = `
:where([data-weave-switch]) {
  --weave-width: 2.5rem;
  --weave-height: 1.5rem;
  --weave-padding: 0.125rem;
  --weave-radius-top-left: var(--weave-radius-full);
  --weave-radius-top-right: var(--weave-radius-full);
  --weave-radius-bottom-right: var(--weave-radius-full);
  --weave-radius-bottom-left: var(--weave-radius-full);
  --weave-background: var(--weave-color-outline);
  --weave-cursor: pointer;
  --weave-focus-visible-outline-width: 0.125rem;
  --weave-focus-visible-outline-color: var(--weave-color-focus);
  --weave-focus-visible-outline-style: solid;
  --weave-focus-visible-outline-offset: 0.125rem;

  position: relative;
}

:where([data-weave-switch][data-weave-switch-size="small"]) {
  --weave-width: 2rem;
  --weave-height: 1.125rem;
  --weave-switch-thumb-size: 0.875rem;
  --weave-switch-shift: 0.875rem;
}

:where([data-weave-switch][data-weave-switch-size="medium"]) {
  --weave-width: 2.5rem;
  --weave-height: 1.5rem;
  --weave-switch-thumb-size: 1.25rem;
  --weave-switch-shift: 1rem;
}

:where([data-weave-switch][data-weave-switch-size="large"]) {
  --weave-width: 3rem;
  --weave-height: 1.75rem;
  --weave-switch-thumb-size: 1.5rem;
  --weave-switch-shift: 1.25rem;
}

:where([data-weave-switch][aria-checked="true"]) {
  --weave-background: var(--weave-color-primary);
}

:where([data-weave-switch-thumb]) {
  --weave-width: var(--weave-switch-thumb-size, 1.25rem);
  --weave-height: var(--weave-switch-thumb-size, 1.25rem);
  --weave-radius-top-left: var(--weave-radius-full);
  --weave-radius-top-right: var(--weave-radius-full);
  --weave-radius-bottom-right: var(--weave-radius-full);
  --weave-radius-bottom-left: var(--weave-radius-full);
  --weave-background: var(--weave-color-surface);
  --weave-pointer-events: none;
  --weave-transform: translateX(0);
  --weave-transition:
    transform var(--weave-motion-duration-fast)
    var(--weave-motion-curve-standard);

  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  transition:
    transform var(--weave-motion-duration-fast)
    var(--weave-motion-curve-standard);
}

:where([data-weave-switch][aria-checked="true"]) > :where([data-weave-switch-thumb]) {
  --weave-transform: translateX(var(--weave-switch-shift, 1rem));
}
`

export function ensureSwitchStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-switch-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveSwitchStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
