const stylesheet = `
@property --weave-progress-value {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

:where(.weave-progress) {
  --weave-display: inline-grid;
  --weave-position: relative;
  --weave-flex-grow: 0;
  --weave-flex-shrink: 0;
  --weave-progress-duration: var(--weave-motion-duration-normal);
  --weave-progress-track: color-mix(
    in srgb,
    currentColor 16%,
    transparent
  );

  place-items: center;
}

:where(.weave-progress--spin.weave-progress--small) {
  --weave-width: 1.125rem;
  --weave-height: 1.125rem;
  --weave-progress-thickness: 0.125rem;
  --weave-progress-dot-angle: 10deg;
  --weave-progress-dot-gap: 8deg;
}

:where(.weave-progress--spin.weave-progress--medium) {
  --weave-width: 1.5rem;
  --weave-height: 1.5rem;
  --weave-progress-thickness: 0.15625rem;
  --weave-progress-dot-angle: 9deg;
  --weave-progress-dot-gap: 7deg;
}

:where(.weave-progress--spin.weave-progress--large) {
  --weave-width: 2rem;
  --weave-height: 2rem;
  --weave-progress-thickness: 0.1875rem;
  --weave-progress-dot-angle: 8deg;
  --weave-progress-dot-gap: 6deg;
}

:where(.weave-progress--linear.weave-progress--small) {
  --weave-width: 6rem;
  --weave-height: 0.25rem;
  --weave-progress-dot-size: 0.25rem;
  --weave-progress-dot-gap: 0.1875rem;
}

:where(.weave-progress--linear.weave-progress--medium) {
  --weave-width: 8rem;
  --weave-height: 0.375rem;
  --weave-progress-dot-size: 0.375rem;
  --weave-progress-dot-gap: 0.25rem;
}

:where(.weave-progress--linear.weave-progress--large) {
  --weave-width: 10rem;
  --weave-height: 0.5rem;
  --weave-progress-dot-size: 0.5rem;
  --weave-progress-dot-gap: 0.3125rem;
}

:where(.weave-progress--determined.weave-progress--speed-slow) {
  --weave-progress-duration: var(--weave-motion-duration-slow);
}

:where(.weave-progress--determined.weave-progress--speed-normal) {
  --weave-progress-duration: var(--weave-motion-duration-normal);
}

:where(.weave-progress--determined.weave-progress--speed-fast) {
  --weave-progress-duration: var(--weave-motion-duration-fast);
}

:where(.weave-progress--undetermined.weave-progress--speed-slow) {
  --weave-progress-duration:
    calc(var(--weave-motion-duration-slow) * 4);
}

:where(.weave-progress--undetermined.weave-progress--speed-normal) {
  --weave-progress-duration:
    calc(var(--weave-motion-duration-normal) * 5);
}

:where(.weave-progress--undetermined.weave-progress--speed-fast) {
  --weave-progress-duration:
    calc(var(--weave-motion-duration-fast) * 6);
}

:where(.weave-progress__visual) {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

:where(.weave-progress--spin) > :where(.weave-progress__visual) {
  border-radius: 50%;
  mask:
    radial-gradient(
      farthest-side,
      transparent calc(100% - var(--weave-progress-thickness)),
      #000 0
    );
}

:where(.weave-progress--spin.weave-progress--dotted)
  > :where(.weave-progress__visual) {
  mask-image:
    radial-gradient(
      farthest-side,
      transparent calc(100% - var(--weave-progress-thickness)),
      #000 0
    ),
    repeating-conic-gradient(
      from -90deg,
      #000 0 var(--weave-progress-dot-angle),
      transparent var(--weave-progress-dot-angle)
        calc(
          var(--weave-progress-dot-angle) +
          var(--weave-progress-dot-gap)
        )
    );
  mask-composite: intersect;
}

:where(.weave-progress--spin.weave-progress--determined)
  > :where(.weave-progress__visual) {
  background:
    conic-gradient(
      from -90deg,
      currentColor var(--weave-progress-value),
      var(--weave-progress-track) 0
    );

  transition:
    --weave-progress-value
    var(--weave-progress-duration)
    var(--weave-motion-curve-standard);
}

:where(.weave-progress--spin.weave-progress--undetermined)
  > :where(.weave-progress__visual) {
  background:
    conic-gradient(
      from -90deg,
      transparent 0deg,
      color-mix(in srgb, currentColor 18%, transparent) 72deg,
      currentColor 248deg,
      currentColor 330deg,
      transparent 360deg
    );

  animation:
    weave-progress-spin-undetermined
    var(--weave-progress-duration)
    linear
    infinite;
}

:where(.weave-progress--linear) > :where(.weave-progress__visual) {
  border-radius: var(--weave-radius-full);
}

:where(.weave-progress--linear.weave-progress--dotted)
  > :where(.weave-progress__visual) {
  mask:
    repeating-linear-gradient(
      90deg,
      #000 0 var(--weave-progress-dot-size),
      transparent var(--weave-progress-dot-size)
        calc(
          var(--weave-progress-dot-size) +
          var(--weave-progress-dot-gap)
        )
    );
}

:where(.weave-progress--linear.weave-progress--determined)
  > :where(.weave-progress__visual) {
  background:
    linear-gradient(
      90deg,
      currentColor var(--weave-progress-value),
      var(--weave-progress-track) 0
    );

  transition:
    --weave-progress-value
    var(--weave-progress-duration)
    var(--weave-motion-curve-standard);
}

:where(.weave-progress--linear.weave-progress--undetermined)
  > :where(.weave-progress__visual) {
  background: var(--weave-progress-track);
}

:where(.weave-progress--linear.weave-progress--undetermined)
  > :where(.weave-progress__visual)::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 36%;
  border-radius: inherit;
  background: currentColor;
  transform: translateX(-120%);
  animation:
    weave-progress-linear-undetermined
    var(--weave-progress-duration)
    var(--weave-motion-curve-standard)
    infinite;
}

@keyframes weave-progress-spin-undetermined {
  to {
    transform: rotate(1turn);
  }
}

@keyframes weave-progress-linear-undetermined {
  0% {
    transform: translateX(-120%);
  }

  50% {
    transform: translateX(180%);
  }

  100% {
    transform: translateX(320%);
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-progress--determined)
    > :where(.weave-progress__visual) {
    transition: none;
  }

  :where(.weave-progress--undetermined)
    > :where(.weave-progress__visual),
  :where(.weave-progress--undetermined)
    > :where(.weave-progress__visual)::after {
    animation: none;
  }
}
`

export function ensureProgressStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-progress-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveProgressStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
