const stylesheet = `
:where(.weave-switch) {
  --weave-position: relative;
  --weave-width: 2.5rem;
  --weave-height: 1.5rem;
  --weave-background: var(--weave-color-outline);
  --weave-border-top-left-radius: var(--weave-radius-full);
  --weave-border-top-right-radius: var(--weave-radius-full);
  --weave-border-bottom-right-radius: var(--weave-radius-full);
  --weave-border-bottom-left-radius: var(--weave-radius-full);
  --weave-cursor: pointer;
  --weave-focus-visible-outline-width: 0.125rem;
  --weave-focus-visible-outline-color: var(--weave-color-focus);
  --weave-focus-visible-outline-style: solid;
  --weave-focus-visible-outline-offset: 0.125rem;
}

:where(.weave-switch--small) {
  --weave-width: 2rem;
  --weave-height: 1.125rem;
  --weave-switch-thumb-size: 0.875rem;
  --weave-switch-shift: 0.875rem;
}

:where(.weave-switch--medium) {
  --weave-width: 2.5rem;
  --weave-height: 1.5rem;
  --weave-switch-thumb-size: 1.25rem;
  --weave-switch-shift: 1rem;
}

:where(.weave-switch--large) {
  --weave-width: 3rem;
  --weave-height: 1.75rem;
  --weave-switch-thumb-size: 1.5rem;
  --weave-switch-shift: 1.25rem;
}

:where(.weave-switch[aria-checked="true"]) {
  --weave-background: var(--weave-color-primary);
}

:where(.weave-switch[aria-disabled="true"]) {
  --weave-opacity: 0.5;
  --weave-cursor: default;
}

:where(.weave-switch__thumb) {
  --weave-position: absolute;
  --weave-top: 0.125rem;
  --weave-left: 0.125rem;
  --weave-width: var(--weave-switch-thumb-size, 1.25rem);
  --weave-height: var(--weave-switch-thumb-size, 1.25rem);
  --weave-border-top-left-radius: var(--weave-radius-full);
  --weave-border-top-right-radius: var(--weave-radius-full);
  --weave-border-bottom-right-radius: var(--weave-radius-full);
  --weave-border-bottom-left-radius: var(--weave-radius-full);
  --weave-background: var(--weave-color-surface);
  --weave-pointer-events: none;
  --weave-transform: translateX(0);

  transition:
    transform var(--weave-motion-duration-fast)
    var(--weave-motion-curve-standard);
}

:where(.weave-switch[aria-checked="true"]) > :where(.weave-switch__thumb) {
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
