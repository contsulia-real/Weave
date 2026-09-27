const stylesheet = `
:where(.weave-snack-region) {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: calc(100vw - 2rem);
  pointer-events: none;
  z-index: var(--weave-layer-snack);
}

:where(.weave-snack-region[data-weave-snack-region^="top-"]) {
  top: 1rem;
}

:where(.weave-snack-region[data-weave-snack-region^="bottom-"]) {
  bottom: 1rem;
}

:where(.weave-snack-region[data-weave-snack-region$="-left"]) {
  left: 1rem;
  align-items: flex-start;
}

:where(.weave-snack-region[data-weave-snack-region$="-right"]) {
  right: 1rem;
  align-items: flex-end;
}

:where(.weave-snack-region[data-weave-snack-region$="-center"]) {
  left: 50%;
  align-items: center;
  transform: translateX(-50%);
}

:where(.weave-snack) {
  --weave-component-display: flex;
  --weave-component-flex-direction: row;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-snack-gap);

  --weave-component-min-width: min(
    var(--weave-snack-min-width),
    calc(100vw - 2rem)
  );
  --weave-component-max-width: min(
    var(--weave-snack-max-width),
    calc(100vw - 2rem)
  );

  --weave-component-background: var(--weave-snack-background);
  --weave-component-color: var(--weave-snack-color);

  --weave-component-border-top-width: var(--weave-snack-border-width);
  --weave-component-border-right-width: var(--weave-snack-border-width);
  --weave-component-border-bottom-width: var(--weave-snack-border-width);
  --weave-component-border-left-width: var(--weave-snack-accent-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-snack-border-color);
  --weave-component-border-right-color: var(--weave-snack-border-color);
  --weave-component-border-bottom-color: var(--weave-snack-border-color);
  --weave-component-border-left-color: var(--weave-snack-accent);

  --weave-component-border-top-left-radius: var(--weave-snack-radius);
  --weave-component-border-top-right-radius: var(--weave-snack-radius);
  --weave-component-border-bottom-right-radius: var(--weave-snack-radius);
  --weave-component-border-bottom-left-radius: var(--weave-snack-radius);

  --weave-component-padding-top: var(--weave-snack-padding-y);
  --weave-component-padding-right: var(--weave-snack-padding-x);
  --weave-component-padding-bottom: var(--weave-snack-padding-y);
  --weave-component-padding-left: var(--weave-snack-padding-x);

  --weave-component-box-shadow: var(--weave-snack-shadow);
  --weave-component-pointer-events: auto;

  opacity: 1;
  translate: 0 0;
  scale: 1;
  will-change: opacity, translate, scale;

  transition:
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-enter),
    translate var(--weave-motion-duration-normal)
      var(--weave-motion-curve-emphasized),
    scale var(--weave-motion-duration-normal)
      var(--weave-motion-curve-emphasized);
}

:where(.weave-snack[data-weave-snack-placement^="top-"]) {
  --weave-snack-motion-y:
    calc(-1 * var(--weave-snack-motion-offset));
}

:where(.weave-snack[data-weave-snack-placement^="bottom-"]) {
  --weave-snack-motion-y:
    var(--weave-snack-motion-offset);
}

@starting-style {
  :where(.weave-snack[data-weave-snack-state="open"]) {
    opacity: 0;
    translate: 0 var(--weave-snack-motion-y);
    scale: 0.985;
  }
}

:where(.weave-snack[data-weave-snack-state="closing"]) {
  opacity: 0;
  translate: 0 var(--weave-snack-motion-y);
  scale: 0.99;
  transition:
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-exit),
    translate var(--weave-motion-duration-fast)
      var(--weave-motion-curve-exit),
    scale var(--weave-motion-duration-fast)
      var(--weave-motion-curve-exit);
}

:where(.weave-snack--default) {
  --weave-snack-accent: var(--weave-snack-default-accent);
}

:where(.weave-snack--success) {
  --weave-snack-accent: var(--weave-snack-success-accent);
}

:where(.weave-snack--warning) {
  --weave-snack-accent: var(--weave-snack-warning-accent);
}

:where(.weave-snack--danger) {
  --weave-snack-accent: var(--weave-snack-danger-accent);
}

:where(.weave-snack--info) {
  --weave-snack-accent: var(--weave-snack-info-accent);
}

:where(.weave-snack__icon) {
  flex: 0 0 auto;
  color: var(--weave-snack-accent);
}

:where(.weave-snack__message) {
  flex: 1 1 auto;
  min-width: 0;
}

:where(.weave-snack__action) {
  flex: 0 0 auto;
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-snack),
  :where(.weave-snack[data-weave-snack-state="closing"]) {
    transition: none;
    translate: 0 0;
    scale: 1;
  }
}
`

export function ensureSnackStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing =
    document.querySelector<HTMLStyleElement>(
      'style[data-weave-snack-styles]',
    )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element =
    document.createElement('style')
  element.dataset.weaveSnackStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
