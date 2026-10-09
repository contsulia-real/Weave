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
  --weave-component-padding-top: 0px;
  --weave-component-padding-bottom: 0px;
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
  --weave-component-width: var(--weave-input-min-width);
}

.weave-input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
  width: 0;
  height: 0;
  margin: 0;
}

:where(.weave-file-input__native) {
  cursor: pointer;
  color: transparent;
  --weave-component-padding-left: 0px;
  --weave-component-padding-right: 0px;
}

:where(.weave-file-input__native)::file-selector-button {
  opacity: 0;
}

:where(.weave-file-input__native--dropzone) {
  --weave-component-min-height: 144px;
  --weave-component-border-style: dashed;
}

:where(.weave-file-input__native[data-weave-file-drop-active="true"]) {
  --weave-component-border-top-color: var(--weave-input-focus-outline-color);
  --weave-component-border-right-color: var(--weave-input-focus-outline-color);
  --weave-component-border-bottom-color: var(--weave-input-focus-outline-color);
  --weave-component-border-left-color: var(--weave-input-focus-outline-color);
}

.weave-input-root:has(> .weave-file-input__native) > .weave-input__trailing-action {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 0;
  pointer-events: none;
}

:where(.weave-file-input__content) {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: 12px;
  width: 100%;
  height: 100%;
  min-width: 0;
  cursor: pointer;
  pointer-events: auto;
  padding: var(--weave-input-padding-y) var(--weave-input-padding-x);
  color: var(--weave-input-color);
  font-size: var(--weave-input-font-size);
  line-height: var(--weave-input-line-height);
}

:where(.weave-file-input__icon) {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: var(--weave-input-focus-outline-color);
}

:where(.weave-file-input__copy) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}

:where(.weave-file-input__title) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--weave-input-font-weight);
}

:where(.weave-file-input__subtitle) {
  max-width: 100%;
  overflow: hidden;
  color: var(--weave-input-placeholder-color);
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.weave-input-root:has(> .weave-file-input__native:disabled) > .weave-input__trailing-action) {
  opacity: var(--weave-input-disabled-opacity);
}

:where(.weave-file-input__native:not(.weave-file-input__native--dropzone) ~ .weave-input__trailing-action .weave-file-input__subtitle) {
  display: none;
}

:where(.weave-file-input__native--dropzone ~ .weave-input__trailing-action .weave-file-input__content) {
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

:where(.weave-file-input__native--dropzone ~ .weave-input__trailing-action .weave-file-input__copy) {
  align-items: center;
  width: 100%;
}

:where(.weave-input-root) {
  position: relative;
  display: inline-block;
  width: fit-content;
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
  .weave-input[data-weave-input-has-trailing-icon="true"],
  .weave-input[data-weave-input-has-trailing-action="true"]
) {
  --weave-component-padding-right: var(--weave-input-min-height);
}

:where(
  .weave-input[data-weave-input-has-clear="true"][data-weave-input-has-trailing-icon="true"],
  .weave-input[data-weave-input-has-clear="true"][data-weave-input-has-trailing-action="true"],
  .weave-input[data-weave-input-has-trailing-icon="true"][data-weave-input-has-trailing-action="true"]
) {
  --weave-component-padding-right: calc(var(--weave-input-min-height) * 2);
}

:where(.weave-input[data-weave-input-has-clear="true"][data-weave-input-has-trailing-icon="true"][data-weave-input-has-trailing-action="true"]) {
  --weave-component-padding-right: calc(var(--weave-input-min-height) * 3);
}

:where(.weave-input[data-weave-input-has-clear="true"][data-weave-input-has-trailing-icon="true"]:not([data-weave-input-has-trailing-action="true"])) {
  --weave-component-padding-right: calc(var(--weave-input-min-height) + var(--weave-input-padding-x) * 2);
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

:where(.weave-input-root[data-weave-input-has-trailing-icon="true"] > .weave-input__clear),
:where(.weave-input-root[data-weave-input-has-trailing-icon="true"] .weave-input__trailing-action .weave-input__clear),
:where(.weave-input-root[data-weave-input-has-trailing-action="true"] > .weave-input__clear) {
  right:
    calc(
      var(--weave-input-min-height) +
      (
        var(--weave-input-min-height) -
        var(--weave-button-min-height)
      ) / 2
    );
}

:where(.weave-input-root[data-weave-input-has-trailing-icon="true"][data-weave-input-has-trailing-action="true"] > .weave-input__clear) {
  right: calc(
    var(--weave-input-min-height) * 2 +
    (var(--weave-input-min-height) - var(--weave-button-min-height)) / 2
  );
}

:where(.weave-input-root[data-weave-input-has-trailing-icon="true"][data-weave-input-has-trailing-action="false"] > .weave-input__clear) {
  right: calc(
    var(--weave-button-min-height) +
    (var(--weave-input-min-height) - var(--weave-button-min-height)) / 2
  );
}

:where(.weave-input__trailing-action) {
  display: contents;
}

:where(.weave-date-input)::-webkit-calendar-picker-indicator {
  display: none;
}

:where(.weave-input-picker-tabs .weave-tab-list) {
  --weave-tabs-tab-padding-y: var(--weave-button-theme-small-padding-y);
}

:where(.weave-color-input) {
  cursor: pointer;
  padding: 6px var(--weave-input-min-height) 6px 8px;
}

.weave-color-input__preview {
  position: absolute;
  top: 6px;
  right: var(--weave-input-min-height);
  bottom: 6px;
  left: 8px;
  border-radius: var(--weave-input-radius);
  background:
    linear-gradient(var(--weave-color-picker-preview), var(--weave-color-picker-preview)),
    repeating-conic-gradient(#aaa 0% 25%, #eee 0% 50%) 0 0 / 12px 12px;
  pointer-events: none;
}
:where(.weave-color-input)::-webkit-color-swatch-wrapper {
  display: none;
}
:where(.weave-color-input)::-webkit-color-swatch {
  display: none;
}
:where(.weave-color-input)::-moz-color-swatch {
  display: none;
}

.weave-color-picker__area {
  overflow: hidden;
  border: 1px solid var(--weave-input-border-color);
  border-radius: var(--weave-input-radius);
  cursor: crosshair;
}

.weave-color-picker__area:focus-visible {
  outline: var(--weave-input-focus-outline-width, 2px) solid var(--weave-input-focus-outline-color, currentColor);
  outline-offset: 2px;
}

.weave-color-picker__cursor {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.weave-color-picker__preview {
  background:
    linear-gradient(var(--weave-color-picker-preview), var(--weave-color-picker-preview)),
    repeating-conic-gradient(#aaa 0% 25%, #eee 0% 50%) 0 0 / 10px 10px;
}

.weave-color-picker__hue,
.weave-color-picker__alpha {
  --weave-slider-width: 100%;
  min-width: 0;
}

.weave-color-picker__hue .weave-slider-field,
.weave-color-picker__alpha .weave-slider-field {
  width: 100%;
}

.weave-color-picker__hue .weave-slider__label,
.weave-color-picker__alpha .weave-slider__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(50%);
}

.weave-color-picker__hue .weave-slider-control,
.weave-color-picker__alpha .weave-slider-control {
  width: 100%;
  grid-template-columns: minmax(0, 1fr);
}

.weave-color-picker__hue .weave-slider__range::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: var(--weave-slider-track-height);
  border-radius: var(--weave-radius-full);
  background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  transform: translateY(-50%);
}

.weave-color-picker__hue .weave-slider__track,
.weave-color-picker__alpha .weave-slider__track {
  background: transparent;
  box-shadow: none;
}

.weave-color-picker__hue .weave-slider__thumb {
  background: var(--weave-color-picker-hue-thumb);
}

.weave-color-picker__alpha .weave-slider__range::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: var(--weave-slider-track-height);
  border-radius: var(--weave-radius-full);
  background:
    linear-gradient(to right, var(--weave-color-picker-alpha-start), var(--weave-color-picker-alpha-end)),
    repeating-conic-gradient(#aaa 0% 25%, #eee 0% 50%) 0 0 / 10px 10px;
  transform: translateY(-50%);
}

.weave-color-picker__alpha .weave-slider__thumb {
  background:
    linear-gradient(var(--weave-color-picker-alpha-thumb), var(--weave-color-picker-alpha-thumb)),
    repeating-conic-gradient(#aaa 0% 25%, #eee 0% 50%) 0 0 / 10px 10px;
}

.weave-color-picker__code .weave-input__trailing-action {
  display: block;
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
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
