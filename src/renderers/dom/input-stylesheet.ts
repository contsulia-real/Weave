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
    var(--weave-input-shadow);

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

:where(.weave-input[type="search"]::-webkit-search-cancel-button) {
  appearance: none;
  display: none;
}

:where(.weave-input-root) {
  position: relative;
  display: inline-block;
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;
}

:where(
  .weave-input-root[
    data-weave-input-root-fill="true"
  ]
) {
  width: 100%;
}

:where(.weave-input[data-weave-input-has-leading-icon="true"]) {
  --weave-component-padding-left: var(--weave-input-min-height);
}

:where(
  .weave-input[data-weave-input-has-clear="true"],
  .weave-input[data-weave-input-has-trailing-icon="true"]
) {
  --weave-component-padding-right: var(--weave-input-min-height);
}

:where(
  .weave-input[data-weave-input-has-clear="true"][data-weave-input-has-trailing-icon="true"]
) {
  --weave-component-padding-right: calc(var(--weave-input-min-height) * 2);
}

:where(.weave-input__clear) {
  position: absolute;
  top: 50%;
  right:
    calc(
      (
        var(--weave-input-min-height) -
        var(--weave-button-min-height)
      ) / 2
    );
  translate: 0 -50%;
}

:where(.weave-input-root[data-weave-input-has-trailing-icon="true"] .weave-input__clear) {
  right:
    calc(
      var(--weave-input-min-height) +
      (
        var(--weave-input-min-height) -
        var(--weave-button-min-height)
      ) / 2
    );
}

:where(.weave-input__leading-icon),
:where(.weave-input__trailing-icon) {
  position: absolute;
  top: 0;
  width: var(--weave-input-min-height);
  height: var(--weave-input-min-height);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

:where(.weave-input__leading-icon) {
  left: 0;
}

:where(.weave-input__trailing-icon) {
  right: 0;
}

:where(.weave-input::placeholder) {
  color:
    var(--weave-input-placeholder-color);
  opacity: 1;
}

:where(.weave-input:focus-visible),
:where(.weave-select:focus-visible) {
  --weave-component-box-shadow:
    var(--weave-input-shadow);
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
  --weave-component-cursor: not-allowed;
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
  ensureStaticStylesheet('input', stylesheet)
}
