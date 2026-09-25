const stylesheet = `
@property --weave-loading-duration {
  syntax: "*";
  inherits: false;
}

@property --weave-loading-progress {
  syntax: "*";
  inherits: false;
}

:where([data-weave-loading]) {
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-loading-track: color-mix(
    in srgb,
    currentColor 20%,
    transparent
  );

  position: relative;
  display: inline-grid;
  place-items: center;
  flex: none;
}

:where([data-weave-loading][data-weave-loading-size="small"]) {
  --weave-width: 1rem;
  --weave-height: 1rem;
  --weave-loading-stroke: 0.125rem;
  --weave-loading-dot: 0.25rem;
}

:where([data-weave-loading][data-weave-loading-size="medium"]) {
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-loading-stroke: 0.1875rem;
  --weave-loading-dot: 0.375rem;
}

:where([data-weave-loading][data-weave-loading-size="large"]) {
  --weave-width: 2rem;
  --weave-height: 2rem;
  --weave-loading-stroke: 0.25rem;
  --weave-loading-dot: 0.5rem;
}

:where([data-weave-loading-ring]) {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
}

:where(
  [data-weave-loading][data-weave-loading-animation="spin"]
  > [data-weave-loading-ring]
) {
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

:where(
  [data-weave-loading][data-weave-loading-animation="pulse"]
  > [data-weave-loading-ring]
) {
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

:where(
  [data-weave-loading][data-weave-loading-animation="dots"]
  > [data-weave-loading-ring]
) {
  display: none;
}

:where([data-weave-loading-dots]) {
  display: none;
  align-items: center;
  justify-content: center;
  gap: calc(var(--weave-loading-dot) / 2);
}

:where(
  [data-weave-loading][data-weave-loading-animation="dots"]
  > [data-weave-loading-dots]
) {
  display: flex;
}

:where([data-weave-loading-dot]) {
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
  :where([data-weave-loading-ring]),
  :where([data-weave-loading-dot]) {
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
