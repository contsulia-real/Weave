const stylesheet = `
:where(.weave-scroll-host) {
  scrollbar-width: none;
}

:where(.weave-scrollbar) {
  --weave-component-display: none;
  --weave-component-position: fixed;
  --weave-component-z-index: 0;
  --weave-component-background: transparent;
  --weave-component-border-top-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-top-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-opacity: var(--weave-scrollbar-opacity);
  --weave-component-user-select: none;

  touch-action: none;
}

:where(.weave-scrollbar[data-weave-scrollbar-visible="true"]) {
  --weave-component-display: block;
}

:where(.weave-scrollbar--tracked) {
  --weave-component-background: var(--weave-scrollbar-track-color);
}

:where(.weave-scrollbar--vertical) {
  --weave-component-width: var(--weave-scrollbar-thickness);
  --weave-component-transform: translateX(-100%);
}

:where(.weave-scrollbar--horizontal) {
  --weave-component-height: var(--weave-scrollbar-thickness);
  --weave-component-transform: translateY(-100%);
}

:where(.weave-scrollbar__thumb) {
  --weave-component-position: absolute;
  --weave-component-background: var(--weave-scrollbar-color);
  --weave-component-border-top-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-top-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-cursor: var(--weave-scrollbar-thumb-cursor);
  --weave-component-user-select: none;

  will-change: transform;
}

:where(.weave-scrollbar--vertical) > :where(.weave-scrollbar__thumb) {
  --weave-component-width: 100%;
  --weave-component-left: 0;
}

:where(.weave-scrollbar--horizontal) > :where(.weave-scrollbar__thumb) {
  --weave-component-height: 100%;
  --weave-component-top: 0;
}
`

export function ensureScrollbarStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-scrollbar-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveScrollbarStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
