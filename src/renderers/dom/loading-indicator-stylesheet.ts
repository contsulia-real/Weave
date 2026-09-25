const stylesheet = `
:where(.weave-loading-indicator) {
  --weave-display: inline-grid;
  --weave-position: relative;
  --weave-flex-grow: 0;
  --weave-flex-shrink: 0;
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-loading-duration:
    calc(var(--weave-motion-duration-normal) * 5);
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
  --weave-loading-dot: 0.25rem;
}

:where(.weave-loading-indicator--medium) {
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-loading-stroke: 0.15625rem;
  --weave-loading-dot: 0.3125rem;
}

:where(.weave-loading-indicator--large) {
  --weave-width: 2rem;
  --weave-height: 2rem;
  --weave-loading-stroke: 0.1875rem;
  --weave-loading-dot: 0.375rem;
}

:where(.weave-loading-indicator--speed-slow) {
  --weave-loading-duration:
    calc(var(--weave-motion-duration-slow) * 4);
}

:where(.weave-loading-indicator--speed-normal) {
  --weave-loading-duration:
    calc(var(--weave-motion-duration-normal) * 5);
}

:where(.weave-loading-indicator--speed-fast) {
  --weave-loading-duration:
    calc(var(--weave-motion-duration-fast) * 6);
}

:where(.weave-loading-indicator__ring),
:where(.weave-loading-indicator__dots) {
  grid-area: 1 / 1;
}

:where(.weave-loading-indicator__ring) {
  --weave-position: relative;
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
}

:where(.weave-loading-indicator--determined.weave-loading-indicator--spin)
  > :where(.weave-loading-indicator__ring)::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    conic-gradient(
      from -90deg,
      transparent 0deg,
      transparent 310deg,
      color-mix(in srgb, currentColor 24%, transparent) 338deg,
      currentColor 360deg
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

:where(.weave-loading-indicator--determined.weave-loading-indicator--pulse)
  > :where(.weave-loading-indicator__ring) {
  animation:
    weave-loading-pulse
    var(--weave-loading-duration)
    ease-in-out
    infinite
    alternate;
}

:where(.weave-loading-indicator--undetermined.weave-loading-indicator--spin)
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
    weave-loading-spin
    var(--weave-loading-duration)
    linear
    infinite;
}

:where(.weave-loading-indicator--undetermined.weave-loading-indicator--pulse)
  > :where(.weave-loading-indicator__ring) {
  --weave-background:
    conic-gradient(
      from -90deg,
      currentColor 100%,
      transparent 0
    );
  animation:
    weave-loading-pulse
    var(--weave-loading-duration)
    ease-in-out
    infinite
    alternate;
}

:where(.weave-loading-indicator__dots) {
  --weave-display: none;
  --weave-align-items: center;
  --weave-justify-content: center;
  --weave-gap: calc(var(--weave-loading-dot) * 0.65);
}

:where(.weave-loading-indicator--dots)
  > :where(.weave-loading-indicator__dots) {
  --weave-display: flex;
}

:where(.weave-loading-indicator--undetermined.weave-loading-indicator--dots)
  > :where(.weave-loading-indicator__ring) {
  --weave-display: none;
}

:where(.weave-loading-indicator--determined.weave-loading-indicator--dots)
  > :where(.weave-loading-indicator__dots) {
  transform: scale(0.72);
}

:where(.weave-loading-indicator__dot) {
  --weave-width: var(--weave-loading-dot);
  --weave-height: var(--weave-loading-dot);
  --weave-border-top-left-radius: 50%;
  --weave-border-top-right-radius: 50%;
  --weave-border-bottom-right-radius: 50%;
  --weave-border-bottom-left-radius: 50%;
  --weave-background: currentColor;

  opacity: 0.32;
  transform: scale(0.72);
  transform-origin: center;
  animation:
    weave-loading-dot
    var(--weave-loading-duration)
    ease-in-out
    infinite;
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
    opacity: 0.48;
  }

  to {
    opacity: 1;
  }
}

@keyframes weave-loading-dot {
  0%,
  60%,
  100% {
    opacity: 0.28;
    transform: scale(0.72);
  }

  30% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-loading-indicator__ring),
  :where(.weave-loading-indicator__ring)::after,
  :where(.weave-loading-indicator__dot) {
    animation: none !important;
  }

  :where(.weave-loading-indicator__dot) {
    opacity: 0.72;
    transform: none;
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
