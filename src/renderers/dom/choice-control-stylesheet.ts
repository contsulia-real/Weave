const stylesheet = `
:where(.weave-choice-control) {
  --weave-component-position: relative;
  --weave-component-display: inline-block;
  --weave-component-width: var(--weave-choice-size);
  --weave-component-height: var(--weave-choice-size);
  --weave-component-background: var(--weave-choice-background);
  --weave-component-border-top-width: var(--weave-choice-border-width);
  --weave-component-border-right-width: var(--weave-choice-border-width);
  --weave-component-border-bottom-width: var(--weave-choice-border-width);
  --weave-component-border-left-width: var(--weave-choice-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-choice-border-color);
  --weave-component-border-right-color: var(--weave-choice-border-color);
  --weave-component-border-bottom-color: var(--weave-choice-border-color);
  --weave-component-border-left-color: var(--weave-choice-border-color);
  --weave-component-border-top-left-radius: var(--weave-choice-radius);
  --weave-component-border-top-right-radius: var(--weave-choice-radius);
  --weave-component-border-bottom-right-radius: var(--weave-choice-radius);
  --weave-component-border-bottom-left-radius: var(--weave-choice-radius);
  --weave-component-box-shadow: var(--weave-choice-shadow);
  --weave-component-cursor: var(--weave-choice-cursor);
  --weave-component-outline-width: 0;

  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
  vertical-align: middle;
  transition:
    border-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-choice-control:hover:not([aria-disabled="true"])) {
  --weave-component-box-shadow: var(--weave-choice-hover-shadow);
}

:where(.weave-choice-control:checked) {
  --weave-component-border-top-color: var(--weave-choice-checked-border-color);
  --weave-component-border-right-color: var(--weave-choice-checked-border-color);
  --weave-component-border-bottom-color: var(--weave-choice-checked-border-color);
  --weave-component-border-left-color: var(--weave-choice-checked-border-color);
}

:where(.weave-choice-control:focus-visible) {
  --weave-component-outline-width: var(--weave-choice-focus-outline-width);
  --weave-component-outline-color: var(--weave-choice-focus-outline-color);
  --weave-component-outline-style: var(--weave-choice-focus-outline-style);
  --weave-component-outline-offset: var(--weave-choice-focus-outline-offset);
}

:where(.weave-choice-control[aria-disabled="true"]) {
  --weave-component-opacity: var(--weave-choice-disabled-opacity);
  --weave-component-cursor: var(--weave-choice-disabled-cursor);
}

:where(.weave-choice-control)::before,
:where(.weave-choice-control)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.58);
  transition:
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    transform var(--weave-motion-duration-fast)
      var(--weave-motion-curve-spring);
}

:where(.weave-choice-control)::before {
  width: var(--weave-choice-indicator-size);
  height: var(--weave-choice-indicator-size);
  background: var(--weave-choice-checked-indicator-background);
  box-shadow: var(--weave-choice-indicator-shadow);
}

:where(.weave-radio)::before {
  border-radius: 9999px;
}

:where(.weave-radio)::after {
  display: none;
}

:where(.weave-checkbox)::before {
  border-radius: calc(var(--weave-choice-size) * 0.18);
}

:where(.weave-checkbox)::after {
  width: var(--weave-choice-mark-size);
  height: var(--weave-choice-mark-size);
  background: var(--weave-choice-checked-indicator-color);
  clip-path: polygon(
    12% 48%,
    0 62%,
    38% 100%,
    100% 20%,
    82% 4%,
    36% 70%
  );
}

:where(.weave-choice-control:checked)::before,
:where(.weave-checkbox:checked)::after {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-choice-control),
  :where(.weave-choice-control)::before,
  :where(.weave-choice-control)::after {
    transition: none;
  }
}
`

export function ensureChoiceControlStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-choice-control-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveChoiceControlStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
