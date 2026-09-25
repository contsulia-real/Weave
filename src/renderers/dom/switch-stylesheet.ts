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
    --weave-switch-checked-background
  );
}

:where(.weave-switch[aria-disabled="true"]) {
  --weave-component-opacity: var(--weave-switch-disabled-opacity);
  --weave-component-cursor: var(--weave-switch-disabled-cursor);
}

:where(.weave-switch__thumb) {
  position: absolute;
  top: var(--weave-switch-thumb-inset);
  left: var(--weave-switch-thumb-inset);
  width: var(--weave-switch-thumb-size);
  height: var(--weave-switch-thumb-size);
  pointer-events: auto;
  touch-action: none;
  transform: translateX(0);
  transition:
    transform var(--weave-motion-duration-fast)
      var(--weave-motion-curve-spring);
  will-change: transform;
}

:where(.weave-switch[aria-checked="true"])
  > :where(.weave-switch__thumb) {
  transform: translateX(var(--weave-switch-shift));
}

:where(.weave-switch__thumb-core) {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: var(--weave-switch-thumb-radius);
  background: var(--weave-switch-thumb-background);
  box-shadow: var(--weave-switch-thumb-shadow);
  transform: scale(1);
  transition:
    transform var(--weave-motion-duration-fast)
      var(--weave-motion-curve-spring),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
  will-change: transform;
}

:where(.weave-switch:hover:not([aria-disabled="true"]))
  :where(.weave-switch__thumb-core) {
  box-shadow: var(--weave-switch-thumb-hover-shadow);
}

:where(.weave-switch__drag-tail) {
  position: absolute;
  top: 50%;
  right: 50%;
  width: 140%;
  height: 38%;
  z-index: 0;
  border-radius: var(--weave-switch-thumb-radius);
  background: var(--weave-switch-thumb-background);
  pointer-events: none;
  visibility: hidden;
  transform: translateY(-50%) scaleX(0);
  transform-origin: right center;
  will-change: transform;
}

:where(.weave-switch[data-weave-switch-dragging="true"])
  > :where(
    .weave-switch__thumb[data-weave-switch-drag-direction]
  )
  > :where(.weave-switch__drag-tail) {
  visibility: visible;
}

:where(
  .weave-switch__thumb[data-weave-switch-drag-direction="backward"]
) > :where(.weave-switch__drag-tail) {
  right: auto;
  left: 50%;
  transform-origin: left center;
}

:where(.weave-switch[data-weave-switch-dragging="true"])
  > :where(.weave-switch__thumb),
:where(.weave-switch[data-weave-switch-dragging="true"])
  :where(.weave-switch__thumb-core) {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-switch),
  :where(.weave-switch__thumb),
  :where(.weave-switch__thumb-core) {
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
