const stylesheet = `
@property --weave-progress-value {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

:where(.weave-progress) {
  --weave-component-display: inline-grid;
  --weave-component-position: relative;
  --weave-component-flex-grow: 0;
  --weave-component-flex-shrink: 0;
  --weave-component-width: var(--weave-progress-width);
  --weave-component-height: var(--weave-progress-height);
  --weave-progress-duration: var(--weave-motion-duration-normal);

  place-items: center;
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
    calc(var(--weave-motion-duration-slow) * 6);
}

:where(.weave-progress--undetermined.weave-progress--speed-normal) {
  --weave-progress-duration:
    calc(var(--weave-motion-duration-normal) * 8);
}

:where(.weave-progress--undetermined.weave-progress--speed-fast) {
  --weave-progress-duration:
    calc(var(--weave-motion-duration-fast) * 9);
}

:where(.weave-progress__track),
:where(.weave-progress__value) {
  --weave-position: absolute;
  --weave-top: 0;
  --weave-right: 0;
  --weave-bottom: 0;
  --weave-left: 0;
}

:where(.weave-progress__track) {
  --weave-display: none;
  --weave-background: var(--weave-progress-track-color);
  --weave-component-box-shadow: var(--weave-progress-track-shadow);
}

:where(.weave-progress__value) {
  --weave-component-box-shadow: var(--weave-progress-value-shadow);
}

:where(.weave-progress--tracked) > :where(.weave-progress__track) {
  --weave-display: block;
}

/* spin */

:where(.weave-progress--spin) > :where(.weave-progress__track),
:where(.weave-progress--spin) > :where(.weave-progress__value) {
  --weave-border-top-left-radius: 50%;
  --weave-border-top-right-radius: 50%;
  --weave-border-bottom-right-radius: 50%;
  --weave-border-bottom-left-radius: 50%;

  mask:
    radial-gradient(
      farthest-side,
      transparent calc(100% - var(--weave-progress-thickness)),
      #000 0
    );
}

:where(.weave-progress--spin.weave-progress--determined)
  > :where(.weave-progress__value) {
  --weave-background:
    conic-gradient(
      from -90deg,
      currentColor var(--weave-progress-value),
      transparent 0
    );

  transition:
    --weave-progress-value
    var(--weave-progress-duration)
    var(--weave-motion-curve-standard);
}

:where(.weave-progress--spin.weave-progress--undetermined)
  > :where(.weave-progress__value) {
  --weave-background:
    conic-gradient(
      from -90deg,
      currentColor 0deg 96deg,
      transparent 96deg 360deg
    );

  will-change: transform;
  animation:
    weave-progress-spin-rotate
    var(--weave-progress-duration)
    linear
    infinite;
}

/* linear */

:where(.weave-progress--linear) {
  --weave-overflow: hidden;
  --weave-overflow-x: hidden;
  --weave-overflow-y: hidden;
  --weave-border-top-left-radius: var(--weave-progress-linear-radius);
  --weave-border-top-right-radius: var(--weave-progress-linear-radius);
  --weave-border-bottom-right-radius: var(--weave-progress-linear-radius);
  --weave-border-bottom-left-radius: var(--weave-progress-linear-radius);
}

:where(.weave-progress--linear) > :where(.weave-progress__track),
:where(.weave-progress--linear) > :where(.weave-progress__value) {
  --weave-border-top-left-radius: var(--weave-progress-linear-radius);
  --weave-border-top-right-radius: var(--weave-progress-linear-radius);
  --weave-border-bottom-right-radius: var(--weave-progress-linear-radius);
  --weave-border-bottom-left-radius: var(--weave-progress-linear-radius);
}

:where(.weave-progress--linear.weave-progress--determined)
  > :where(.weave-progress__value) {
  --weave-right: auto;
  --weave-width: var(--weave-progress-value);
  --weave-background: currentColor;

  transition:
    width
    var(--weave-progress-duration)
    var(--weave-motion-curve-standard);
}

:where(.weave-progress--linear.weave-progress--undetermined)
  > :where(.weave-progress__value) {
  --weave-background: transparent;
  --weave-overflow: hidden;
  --weave-overflow-x: hidden;
  --weave-overflow-y: hidden;
}

:where(.weave-progress--linear.weave-progress--undetermined)
  > :where(.weave-progress__value)::before,
:where(.weave-progress--linear.weave-progress--undetermined)
  > :where(.weave-progress__value)::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 42%;
  border-radius: inherit;
  background: currentColor;
}

:where(.weave-progress--linear.weave-progress--undetermined)
  > :where(.weave-progress__value)::before {
  animation:
    weave-progress-linear-leading
    var(--weave-progress-duration)
    linear
    infinite;
}

:where(.weave-progress--linear.weave-progress--undetermined)
  > :where(.weave-progress__value)::after {
  animation:
    weave-progress-linear-trailing
    var(--weave-progress-duration)
    linear
    infinite;
}

@keyframes weave-progress-spin-rotate {
  to {
    transform: rotate(1turn);
  }
}

@keyframes weave-progress-linear-leading {
  from {
    transform: translateX(-120%);
  }

  to {
    transform: translateX(360%);
  }
}

@keyframes weave-progress-linear-trailing {
  0% {
    transform: translateX(120%);
  }

  49.999% {
    transform: translateX(360%);
  }

  50% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(120%);
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-progress--spin.weave-progress--determined)
    > :where(.weave-progress__value) {
    transition: none;
  }

  :where(.weave-progress--linear.weave-progress--determined)
    > :where(.weave-progress__value) {
    transition: none;
  }

  :where(.weave-progress--spin.weave-progress--undetermined)
    > :where(.weave-progress__value) {
    animation: none;
    transform: rotate(0deg);
  }

  :where(.weave-progress--linear.weave-progress--undetermined)
    > :where(.weave-progress__value)::before,
  :where(.weave-progress--linear.weave-progress--undetermined)
    > :where(.weave-progress__value)::after {
    animation: none;
  }

  :where(.weave-progress--linear.weave-progress--undetermined)
    > :where(.weave-progress__value)::before {
    transform: translateX(70%);
  }

  :where(.weave-progress--linear.weave-progress--undetermined)
    > :where(.weave-progress__value)::after {
    display: none;
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
