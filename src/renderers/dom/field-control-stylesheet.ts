import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-field-control) {
  --weave-component-background:
    var(--weave-field-control-background);
  --weave-component-color:
    var(--weave-field-control-color);
  --weave-component-min-height:
    var(--weave-field-control-min-height);
  --weave-component-min-width:
    var(--weave-field-control-min-width);
  --weave-component-padding-top: 0rem;
  --weave-component-padding-bottom: 0rem;
  --weave-component-padding-left:
    var(--weave-field-control-padding-x);
  --weave-component-padding-right:
    var(--weave-field-control-padding-x);

  --weave-component-border-top-width:
    var(--weave-field-control-border-width);
  --weave-component-border-right-width:
    var(--weave-field-control-border-width);
  --weave-component-border-bottom-width:
    var(--weave-field-control-border-width);
  --weave-component-border-left-width:
    var(--weave-field-control-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color:
    var(--weave-field-control-border-color);
  --weave-component-border-right-color:
    var(--weave-field-control-border-color);
  --weave-component-border-bottom-color:
    var(--weave-field-control-border-color);
  --weave-component-border-left-color:
    var(--weave-field-control-border-color);

  --weave-component-border-top-left-radius:
    var(--weave-field-control-radius);
  --weave-component-border-top-right-radius:
    var(--weave-field-control-radius);
  --weave-component-border-bottom-right-radius:
    var(--weave-field-control-radius);
  --weave-component-border-bottom-left-radius:
    var(--weave-field-control-radius);
  --weave-component-outline-width: 0;
  --weave-component-box-shadow:
    0 0.0625rem 0
    color-mix(
      in srgb,
      var(--weave-field-control-border-color) 72%,
      transparent
    );

  appearance: none;
  font: inherit;
  font-size:
    var(--weave-field-control-font-size);
  font-weight:
    var(--weave-field-control-font-weight);
  line-height:
    var(--weave-field-control-line-height);
  letter-spacing:
    var(--weave-field-control-letter-spacing);

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

:where(.weave-field-control::placeholder) {
  color:
    var(--weave-field-control-placeholder-color);
  opacity: 1;
}

:where(
  .weave-field-control:hover:not(:disabled):not(
    [aria-disabled="true"]
  )
) {
  --weave-component-box-shadow:
    0 calc(var(--weave-feedback-rest-depth) * 0.5) 0
    color-mix(
      in srgb,
      var(--weave-field-control-border-color) 82%,
      transparent
    );
}

:where(.weave-field-control:focus-visible) {
  --weave-component-box-shadow:
    0 var(--weave-feedback-rest-depth) 0
    color-mix(
      in srgb,
      var(--weave-field-control-focus-outline-color) 34%,
      transparent
    );
  --weave-component-border-top-color:
    var(--weave-field-control-focus-outline-color);
  --weave-component-border-right-color:
    var(--weave-field-control-focus-outline-color);
  --weave-component-border-bottom-color:
    var(--weave-field-control-focus-outline-color);
  --weave-component-border-left-color:
    var(--weave-field-control-focus-outline-color);
  --weave-component-outline-width:
    var(--weave-field-control-focus-outline-width);
  --weave-component-outline-color:
    var(--weave-field-control-focus-outline-color);
  --weave-component-outline-style:
    var(--weave-field-control-focus-outline-style);
  --weave-component-outline-offset:
    var(--weave-field-control-focus-outline-offset);
}

:where(
  .weave-field-control:disabled,
  .weave-field-control[aria-disabled="true"]
) {
  --weave-component-opacity:
    var(--weave-field-control-disabled-opacity);
  --weave-component-cursor:
    var(--weave-field-control-disabled-cursor);
}
`

export function ensureFieldControlStylesheet(): void {
  ensureStaticStylesheet(
    'field-control',
    stylesheet,
  )
}
