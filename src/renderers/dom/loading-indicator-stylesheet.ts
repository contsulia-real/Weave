const stylesheet = `
@property --weave-loading-progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

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
    currentColor 16%,
    transparent
  );

  place-items: center;
}

:where(.weave-loading-indicator--small) {
  --weave-width: 1.125rem;
  --weave-height: 1.125rem;
  --weave-loading-stroke: 0.125rem;
}

:where(.weave-loading-indicator--medium) {
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-loading-stroke: 0.15625rem;
}

:where(.weave-loading-indicator--large) {
  --weave-width: 2rem;
  --weave-height: 2rem;
  --weave-loading-stroke: 0.1875rem;
}

:where(
  .weave-loading-indicator--determined.weave-loading-indicator--speed-slow
) {
  --weave-loading-duration: var(--weave-motion-duration-slow);
}

:where(
  .weave-loading-indicator--determined.weave-loading-indicator--speed-normal
) {
  --weave-loading-duration: var(--weave-motion-duration-normal);
}

:where(
  .weave-loading-indicator--determined.weave-loading-indicator--speed-fast
) {
  --weave-loading-duration: var(--weave-motion-duration-fast);
}

:where(
  .weave-loading-indicator--undetermined.weave-loading-indicator--speed-slow
) {
  --weave-loading-duration:
    calc(var(--weave-motion-duration-slow) * 4);
}

:where(
  .weave-loading-indicator--undetermined.weave-loading-indicator--speed-normal
) {
  --weave-loading-duration:
    calc(var(--weave-motion-duration-normal) * 5);
}

:where(
  .weave-loading-indicator--undetermined.weave-loading-indicator--speed-fast
) {
  --weave-loading-duration:
    calc(var(--weave-motion-duration-fast) * 6);
}

:where(.weave-loading-indicator__ring) {
  --weave-width: 100%;
  --weave-height: 100%;
  --weave-border-top-left-radius: 50%;
  --weave-border-top-right-radius: 50%;
  --weave-border-bottom-right-radius: 50%;
  --weave-border-bottom-left-radius: 50%;

  mask:
    radial-gradient(
      farthest-side,
      transparent calc(100% - var(--weave-loading-stroke)),
      #000 0
    );
}

:where(.weave-loading-indicator--determined)
  > :where(.weave-loading-indicator__ring) {
  --weave-background:
    conic-gradient(
      from -90deg,
      currentColor var(--weave-loading-progress),
      var(--weave-loading-track) 0
    );

  transition:
    --weave-loading-progress
    var(--weave-loading-duration)
    var(--weave-motion-curve-standard);
}

:where(.weave-loading-indicator--undetermined)
  > :where(.weave-loading-indicator__ring) {
  --weave-background:
    conic-gradient(
      from -90deg,
      transparent 0deg,
      color-mix(in srgb, currentColor 20%, transparent) 72deg,
      currentColor 250deg,
      currentColor 330deg,
      transparent 360deg
    );

  animation:
    weave-loading-undetermined
    var(--weave-loading-duration)
    linear
    infinite;
}

@keyframes weave-loading-undetermined {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-loading-indicator--determined)
    > :where(.weave-loading-indicator__ring) {
    transition: none;
  }

  :where(.weave-loading-indicator--undetermined)
    > :where(.weave-loading-indicator__ring) {
    animation: none;
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
