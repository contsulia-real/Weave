const stylesheet = `
:where(.weave-scroll-host) {
  scrollbar-width: none;
}

:where(.weave-scrollbar) {
  --weave-display: none;
  --weave-position: fixed;
  --weave-z-index: 0;
  --weave-background: var(--weave-scrollbar-track-color, transparent);
  --weave-border-top-left-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-border-top-right-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-border-bottom-right-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-border-bottom-left-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-opacity: var(--weave-scrollbar-opacity, 1);
  --weave-user-select: none;

  touch-action: none;
}

:where(.weave-scrollbar[data-weave-scrollbar-visible="true"]) {
  --weave-display: block;
}

:where(.weave-scrollbar--small.weave-scrollbar--vertical) {
  --weave-width: 0.25rem;
}

:where(.weave-scrollbar--medium.weave-scrollbar--vertical) {
  --weave-width: 0.375rem;
}

:where(.weave-scrollbar--large.weave-scrollbar--vertical) {
  --weave-width: 0.5rem;
}

:where(.weave-scrollbar--small.weave-scrollbar--horizontal) {
  --weave-height: 0.25rem;
}

:where(.weave-scrollbar--medium.weave-scrollbar--horizontal) {
  --weave-height: 0.375rem;
}

:where(.weave-scrollbar--large.weave-scrollbar--horizontal) {
  --weave-height: 0.5rem;
}

:where(.weave-scrollbar--vertical) {
  --weave-transform: translateX(-100%);
}

:where(.weave-scrollbar--horizontal) {
  --weave-transform: translateY(-100%);
}

:where(.weave-scrollbar__thumb) {
  --weave-position: absolute;
  --weave-background: var(
    --weave-scrollbar-color,
    var(--weave-color-secondary)
  );
  --weave-border-top-left-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-border-top-right-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-border-bottom-right-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-border-bottom-left-radius: var(
    --weave-scrollbar-radius,
    var(--weave-radius-full)
  );
  --weave-cursor: pointer;
  --weave-user-select: none;
}

:where(.weave-scrollbar--vertical) > :where(.weave-scrollbar__thumb) {
  --weave-width: 100%;
  --weave-left: 0;
}

:where(.weave-scrollbar--horizontal) > :where(.weave-scrollbar__thumb) {
  --weave-height: 100%;
  --weave-top: 0;
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
