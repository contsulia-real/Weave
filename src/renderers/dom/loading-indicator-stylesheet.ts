const stylesheet = `
:where(.weave-loading-indicator) {
  --weave-display: inline-grid;
  --weave-position: relative;
  --weave-flex-grow: 0;
  --weave-flex-shrink: 0;
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-loading-duration: var(--weave-motion-duration-normal);
  --weave-loading-track: color-mix(
    in srgb,
    currentColor 20%,
    transparent
  );

  place-items: center;
}

:where(.weave-loading-indicator--small) {
  --weave-width: 1rem;
  --weave-height: 1rem;
  --weave-loading-stroke: 0.125rem;
  --weave-loading-dot: 0.25rem;
}

:where(.weave-loading-indicator--medium) {
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-loading-stroke: 0.1875rem;
  --weave-loading-dot: 0.375rem;
}

:where(.weave-loading-indicator--large) {
  --weave-width: 2rem;
  --weave-height: 2rem;
  --weave-loading-stroke: 0.25rem;
  --weave-loading-dot: 0.5rem;
}

:where(.weave-loading-indicator--speed-slow) {
  --weave-loading-duration: var(--weave-motion-duration-slow);
}

:where(.weave-loading-indicator--speed-normal) {
  --weave-loading-duration: var(--weave-motion-duration-normal);
}

:where(.weave-loading-indicator--speed-fast) {
  --weave-loading-duration: var(--weave-motion-duration-fast);
}

:where(.weave-loading-indicator__ring) {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
}

:where(.weave-loading-indicator--spin)
  > :where(.weave-loading-indicator__ring) {
  background:
    conic-gradient(
      currentColor
        var(--weave-loading-progress, 25%),
      var(--weave-loading-track) 0
    );
  mask:
    radial-gradient(
      farthest-side,
      transparent calc(100% - var(--weave-loading-stroke)),
      #000 0
    );
  animation:
    weave-loading-spin
    var(--weave-loading-duration)
    linear
    infinite;
}

:where(.weave-loading-indicator--pulse)
  > :where(.weave-loading-indicator__ring) {
  background:
    conic-gradient(
      currentColor
        var(--weave-loading-progress, 100%),
      var(--weave-loading-track) 0
    );
  mask:
    radial-gradient(
      farthest-side,
      transparent calc(100% - var(--weave-loading-stroke)),
      #000 0
    );
  animation:
    weave-loading-pulse
    var(--weave-loading-duration)
    ease-in-out
    infinite
    alternate;
}

:where(.weave-loading-indicator--dots)
  > :where(.weave-loading-indicator__ring) {
  display: none;
}

:where(.weave-loading-indicator__dots) {
  display: none;
  align-items: center;
  justify-content: center;
  gap: calc(var(--weave-loading-dot) / 2);
}

:where(.weave-loading-indicator--dots)
  > :where(.weave-loading-indicator__dots) {
  display: flex;
}

:where(.weave-loading-indicator__dot) {
  width: var(--weave-loading-dot);
  height: var(--weave-loading-dot);
  border-radius: 9999px;
  background: currentColor;
  animation:
    weave-loading-dot
    var(--weave-loading-duration)
    ease-in-out
    infinite
    alternate;
}

:where([data-weave-loading-dot="2"]) {
  animation-delay: calc(var(--weave-loading-duration) * -0.66);
}

:where([data-weave-loading-dot="3"]) {
  animation-delay: calc(var(--weave-loading-duration) * -0.33);
}

@keyframes weave-loading-spin {
  to {
    transform: rotate(1turn);
  }
}

@keyframes weave-loading-pulse {
  from {
    opacity: 0.35;
    transform: scale(0.82);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes weave-loading-dot {
  from {
    opacity: 0.25;
    transform: translateY(20%);
  }

  to {
    opacity: 1;
    transform: translateY(-20%);
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-loading-indicator__ring),
  :where(.weave-loading-indicator__dot) {
    animation: none !important;
  }
}
`

export function ensureLoadingIndicatorStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-loading-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveLoadingStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
