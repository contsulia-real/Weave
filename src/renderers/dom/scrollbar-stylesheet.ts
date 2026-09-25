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

  will-change: transform, scale;
  scale: 1;
  transform-origin: center;
  transition:
    scale var(--weave-motion-duration-fast)
      var(--weave-motion-curve-spring),
    background-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-scrollbar--vertical) > :where(.weave-scrollbar__thumb) {
  --weave-component-width: 100%;
  --weave-component-left: 0;
}

:where(.weave-scrollbar--vertical:hover)
  > :where(.weave-scrollbar__thumb) {
  scale: var(--weave-feedback-hover-scale) 1;
}

:where(.weave-scrollbar--vertical[data-weave-scrollbar-dragging="true"])
  > :where(.weave-scrollbar__thumb) {
  scale: var(--weave-feedback-drag-scale) 1;
}

:where(.weave-scrollbar--horizontal) > :where(.weave-scrollbar__thumb) {
  --weave-component-height: 100%;
  --weave-component-top: 0;
}

:where(.weave-scrollbar--horizontal:hover)
  > :where(.weave-scrollbar__thumb) {
  scale: 1 var(--weave-feedback-hover-scale);
}

:where(.weave-scrollbar--horizontal[data-weave-scrollbar-dragging="true"])
  > :where(.weave-scrollbar__thumb) {
  scale: 1 var(--weave-feedback-drag-scale);
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-scrollbar__thumb) {
    transition:
      background-color var(--weave-motion-duration-fast)
        var(--weave-motion-curve-standard),
      opacity var(--weave-motion-duration-fast)
        var(--weave-motion-curve-standard);
  }

  :where(.weave-scrollbar--vertical:hover)
    > :where(.weave-scrollbar__thumb),
  :where(.weave-scrollbar--vertical[data-weave-scrollbar-dragging="true"])
    > :where(.weave-scrollbar__thumb),
  :where(.weave-scrollbar--horizontal:hover)
    > :where(.weave-scrollbar__thumb),
  :where(.weave-scrollbar--horizontal[data-weave-scrollbar-dragging="true"])
    > :where(.weave-scrollbar__thumb) {
    scale: 1;
  }
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
