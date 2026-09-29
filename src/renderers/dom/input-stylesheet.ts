import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-input),
:where(.weave-select) {
  --weave-component-background:
    var(--weave-input-background);
  --weave-component-color:
    var(--weave-input-color);
  --weave-component-min-height:
    var(--weave-input-min-height);
  --weave-component-min-width:
    var(--weave-input-min-width);
  --weave-component-padding-top: 0rem;
  --weave-component-padding-bottom: 0rem;
  --weave-component-padding-left:
    var(--weave-input-padding-x);
  --weave-component-padding-right:
    var(--weave-input-padding-x);

  --weave-component-border-top-width:
    var(--weave-input-border-width);
  --weave-component-border-right-width:
    var(--weave-input-border-width);
  --weave-component-border-bottom-width:
    var(--weave-input-border-width);
  --weave-component-border-left-width:
    var(--weave-input-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color:
    var(--weave-input-border-color);
  --weave-component-border-right-color:
    var(--weave-input-border-color);
  --weave-component-border-bottom-color:
    var(--weave-input-border-color);
  --weave-component-border-left-color:
    var(--weave-input-border-color);

  --weave-component-border-top-left-radius:
    var(--weave-input-radius);
  --weave-component-border-top-right-radius:
    var(--weave-input-radius);
  --weave-component-border-bottom-right-radius:
    var(--weave-input-radius);
  --weave-component-border-bottom-left-radius:
    var(--weave-input-radius);
  --weave-component-outline-width: 0;
  --weave-component-box-shadow:
    0 0.0625rem 0
    color-mix(
      in srgb,
      var(--weave-input-border-color) 72%,
      transparent
    );

  appearance: none;
  font: inherit;
  font-size:
    var(--weave-input-font-size);
  font-weight:
    var(--weave-input-font-weight);
  line-height:
    var(--weave-input-line-height);
  letter-spacing:
    var(--weave-input-letter-spacing);

  --weave-component-transition-property:
    background-color,
    border-color,
    color,
    opacity,
    box-shadow;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-input) {
  --weave-component-display: block;
}

:where(.weave-input::placeholder) {
  color:
    var(--weave-input-placeholder-color);
  opacity: 1;
}

:where(
  .weave-input:hover:not(:disabled),
  .weave-select:hover:not(:disabled):not(
    [aria-disabled="true"]
  )
) {
  --weave-component-box-shadow:
    0 calc(var(--weave-feedback-rest-depth) * 0.5) 0
    color-mix(
      in srgb,
      var(--weave-input-border-color) 82%,
      transparent
    );
}

:where(.weave-input:focus-visible),
:where(.weave-select:focus-visible) {
  --weave-component-box-shadow:
    0 var(--weave-feedback-rest-depth) 0
    color-mix(
      in srgb,
      var(--weave-input-focus-outline-color) 34%,
      transparent
    );
  --weave-component-border-top-color:
    var(--weave-input-focus-outline-color);
  --weave-component-border-right-color:
    var(--weave-input-focus-outline-color);
  --weave-component-border-bottom-color:
    var(--weave-input-focus-outline-color);
  --weave-component-border-left-color:
    var(--weave-input-focus-outline-color);
  --weave-component-outline-width:
    var(--weave-input-focus-outline-width);
  --weave-component-outline-color:
    var(--weave-input-focus-outline-color);
  --weave-component-outline-style:
    var(--weave-input-focus-outline-style);
  --weave-component-outline-offset:
    var(--weave-input-focus-outline-offset);
}

:where(
  .weave-input:disabled,
  .weave-select:disabled,
  .weave-select[aria-disabled="true"]
) {
  --weave-component-opacity:
    var(--weave-input-disabled-opacity);
  --weave-component-cursor:
    var(--weave-input-disabled-cursor);
}

:where(.weave-input--multiline) {
  --weave-component-padding-top:
    var(--weave-input-padding-y);
  --weave-component-padding-bottom:
    var(--weave-input-padding-y);
}

:where([data-weave-input-multiline]) {
  resize: none;
}
`

export function ensureInputStylesheet(): void {
  ensureStaticStylesheet(
    'input',
    stylesheet,
  )
}
