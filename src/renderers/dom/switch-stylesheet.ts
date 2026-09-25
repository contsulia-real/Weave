const stylesheet = `
:where(.weave-switch) {
  --weave-component-position: relative;
  --weave-component-width: var(--weave-switch-width);
  --weave-component-height: var(--weave-switch-height);
  --weave-component-background: var(--weave-switch-background);
  --weave-component-border-top-left-radius: var(--weave-switch-radius);
  --weave-component-border-top-right-radius: var(--weave-switch-radius);
  --weave-component-border-bottom-right-radius: var(--weave-switch-radius);
  --weave-component-border-bottom-left-radius: var(--weave-switch-radius);
  --weave-component-cursor: var(--weave-switch-cursor);
  --weave-component-outline-width: 0;
  --weave-component-box-shadow: var(--weave-switch-track-shadow);

  transition:
    background-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-switch:focus-visible) {
  --weave-component-outline-width: var(
    --weave-switch-focus-outline-width
  );
  --weave-component-outline-color: var(
    --weave-switch-focus-outline-color
  );
  --weave-component-outline-style: var(
    --weave-switch-focus-outline-style
  );
  --weave-component-outline-offset: var(
    --weave-switch-focus-outline-offset
  );
}

:where(.weave-switch[aria-checked="true"]) {
  --weave-component-background: var(
    --weave-switch-checked-background,
    var(--weave-switch-background)
  );
}

:where(.weave-switch[aria-disabled="true"]) {
  --weave-component-opacity: var(--weave-switch-disabled-opacity);
  --weave-component-cursor: var(--weave-switch-disabled-cursor);
}

:where(.weave-switch__thumb) {
  --weave-component-position: absolute;
  --weave-component-top: var(--weave-switch-thumb-inset);
  --weave-component-left: var(--weave-switch-thumb-inset);
  --weave-component-width: var(--weave-switch-thumb-size);
  --weave-component-height: var(--weave-switch-thumb-size);
  --weave-component-border-top-left-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-border-top-right-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-border-bottom-right-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-border-bottom-left-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-background: var(
    --weave-switch-thumb-background
  );
  --weave-component-box-shadow: var(--weave-switch-thumb-shadow);
  --weave-component-pointer-events: auto;
  --weave-component-transform: translateX(0);

  touch-action: none;
  will-change: transform;

  transition:
    transform var(--weave-motion-duration-fast)
      var(--weave-motion-curve-spring),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-switch[aria-checked="true"]) > :where(.weave-switch__thumb) {
  --weave-component-transform: translateX(var(--weave-switch-shift));
}

:where(.weave-switch:hover:not([aria-disabled="true"]))
  > :where(.weave-switch__thumb) {
  --weave-component-box-shadow: var(
    --weave-switch-thumb-hover-shadow
  );
}

:where(.weave-switch[data-weave-switch-dragging="true"])
  > :where(.weave-switch__thumb) {
  --weave-component-cursor: grabbing;
  --weave-component-box-shadow: var(--weave-switch-thumb-shadow);
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-switch),
  :where(.weave-switch__thumb),
  :where(.weave-switch[data-weave-switch-dragging="true"])
    > :where(.weave-switch__thumb) {
    transition: none;
  }

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
