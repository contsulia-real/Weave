import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-select) {
  --weave-component-display: inline-flex;
  --weave-component-align-items: center;
  --weave-component-justify-content: space-between;
  --weave-component-gap: var(--weave-select-gap);
  --weave-component-min-height: var(--weave-select-min-height);
  --weave-component-min-width: var(--weave-select-min-width);
  --weave-component-padding-left: var(--weave-select-padding-x);
  --weave-component-padding-right: var(--weave-select-padding-x);
  --weave-component-background: var(--weave-select-background);
  --weave-component-color: var(--weave-select-color);

  --weave-component-border-top-width: var(--weave-select-border-width);
  --weave-component-border-right-width: var(--weave-select-border-width);
  --weave-component-border-bottom-width: var(--weave-select-border-width);
  --weave-component-border-left-width: var(--weave-select-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-select-border-color);
  --weave-component-border-right-color: var(--weave-select-border-color);
  --weave-component-border-bottom-color: var(--weave-select-border-color);
  --weave-component-border-left-color: var(--weave-select-border-color);

  --weave-component-border-top-left-radius: var(--weave-select-radius);
  --weave-component-border-top-right-radius: var(--weave-select-radius);
  --weave-component-border-bottom-right-radius: var(--weave-select-radius);
  --weave-component-border-bottom-left-radius: var(--weave-select-radius);

  --weave-component-cursor: pointer;
  --weave-component-user-select: none;
  --weave-component-outline-width: 0;

  appearance: none;
  font: inherit;
  font-size: var(--weave-select-font-size);
  font-weight: var(--weave-select-font-weight);
  line-height: var(--weave-select-line-height);
  letter-spacing: var(--weave-select-letter-spacing);
  text-align: start;

  --weave-component-transition-property:
    background-color, border-color, color, opacity;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-select:hover:not([aria-disabled="true"])) {
  --weave-component-background: var(--weave-color-surface-hover);
}

:where(.weave-select:focus-visible) {
  --weave-component-outline-width:
    var(--weave-select-focus-outline-width);
  --weave-component-outline-color:
    var(--weave-select-focus-outline-color);
  --weave-component-outline-style:
    var(--weave-select-focus-outline-style);
  --weave-component-outline-offset:
    var(--weave-select-focus-outline-offset);
}

:where(.weave-select[aria-disabled="true"]) {
  --weave-component-opacity:
    var(--weave-select-disabled-opacity);
  --weave-component-cursor:
    var(--weave-select-disabled-cursor);
}

:where(.weave-select__value) {
  --weave-component-display: flex;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-select-gap);
  --weave-component-flex-grow: 1;
  --weave-component-min-width: 0rem;
}

:where(.weave-select__placeholder) {
  color: var(--weave-select-placeholder-color);
}

:where(.weave-select__value-icon),
:where(.weave-select__chevron) {
  --weave-component-width: var(--weave-select-icon-size);
  --weave-component-height: var(--weave-select-icon-size);
  --weave-component-flex-shrink: 0;
}

:where(.weave-select__chevron) {
  transition:
    transform
    var(--weave-motion-duration-fast)
    var(--weave-motion-curve-standard);
}

:where(.weave-select[data-weave-select-open="true"] .weave-select__chevron) {
  transform: rotate(180deg);
}

:where(.weave-select-listbox) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-align-items: stretch;
  --weave-component-gap: var(--weave-select-listbox-gap);
  --weave-component-min-width: var(--weave-select-listbox-min-width);
  --weave-component-max-width: var(--weave-select-listbox-max-width);
  --weave-component-max-height: var(--weave-select-listbox-max-height);
  --weave-component-padding-top: var(--weave-select-listbox-padding);
  --weave-component-padding-right: var(--weave-select-listbox-padding);
  --weave-component-padding-bottom: var(--weave-select-listbox-padding);
  --weave-component-padding-left: var(--weave-select-listbox-padding);
  --weave-component-background: var(--weave-select-listbox-background);
  --weave-component-color: var(--weave-select-listbox-color);
  --weave-component-overflow-y: auto;

  --weave-component-border-top-width: var(--weave-select-listbox-border-width);
  --weave-component-border-right-width: var(--weave-select-listbox-border-width);
  --weave-component-border-bottom-width: var(--weave-select-listbox-border-width);
  --weave-component-border-left-width: var(--weave-select-listbox-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-select-listbox-border-color);
  --weave-component-border-right-color: var(--weave-select-listbox-border-color);
  --weave-component-border-bottom-color: var(--weave-select-listbox-border-color);
  --weave-component-border-left-color: var(--weave-select-listbox-border-color);

  --weave-component-border-top-left-radius: var(--weave-select-listbox-radius);
  --weave-component-border-top-right-radius: var(--weave-select-listbox-radius);
  --weave-component-border-bottom-right-radius: var(--weave-select-listbox-radius);
  --weave-component-border-bottom-left-radius: var(--weave-select-listbox-radius);

  --weave-component-box-shadow: var(--weave-select-listbox-shadow);

  --weave-select-listbox-motion-x: 0rem;
  --weave-select-listbox-motion-y: 0rem;

  opacity: 1;
  translate: 0 0;
  scale: 1;
  isolation: isolate;
  will-change: opacity, translate, scale;

  --weave-component-transition-property: opacity, translate, scale;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-normal),
    var(--weave-motion-duration-normal);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-enter),
    var(--weave-motion-curve-emphasized),
    var(--weave-motion-curve-emphasized);
  --weave-component-transition-delay: 0ms;
}

@starting-style {
  :where(.weave-select-listbox[data-weave-select-state="open"]) {
    opacity: 0;
    translate:
      var(--weave-select-listbox-motion-x)
      var(--weave-select-listbox-motion-y);
    scale: 0.98;
  }
}

:where(.weave-select-listbox[data-weave-select-state="closing"]) {
  opacity: 0;
  translate:
    var(--weave-select-listbox-motion-x)
    var(--weave-select-listbox-motion-y);
  scale: 0.985;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit);
}

:where(.weave-select-listbox[data-placement^="top"]) {
  --weave-select-listbox-motion-y:
    var(--weave-select-listbox-motion-offset);
  transform-origin: center bottom;
}

:where(.weave-select-listbox[data-placement^="bottom"]) {
  --weave-select-listbox-motion-y:
    calc(-1 * var(--weave-select-listbox-motion-offset));
  transform-origin: center top;
}

:where(.weave-select-listbox[data-placement="left"]) {
  --weave-select-listbox-motion-x:
    var(--weave-select-listbox-motion-offset);
  transform-origin: right center;
}

:where(.weave-select-listbox[data-placement="right"]) {
  --weave-select-listbox-motion-x:
    calc(-1 * var(--weave-select-listbox-motion-offset));
  transform-origin: left center;
}

:where(.weave-select-listbox[data-weave-reduced-motion="reduce"]),
:where(
  .weave-select-listbox[data-weave-reduced-motion="reduce"][data-weave-select-state="closing"]
) {
  translate: 0 0;
  scale: 1;
  transition: none;
}

:where(.weave-select-option) {
  --weave-component-display: flex;
  --weave-component-flex-direction: row;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-select-option-gap);
  --weave-component-padding-top: var(--weave-select-option-padding-y);
  --weave-component-padding-right: var(--weave-select-option-padding-x);
  --weave-component-padding-bottom: var(--weave-select-option-padding-y);
  --weave-component-padding-left: var(--weave-select-option-padding-x);
  --weave-component-background: var(--weave-select-option-background);
  --weave-component-color: var(--weave-select-option-color);

  --weave-component-border-top-left-radius: var(--weave-select-option-radius);
  --weave-component-border-top-right-radius: var(--weave-select-option-radius);
  --weave-component-border-bottom-right-radius: var(--weave-select-option-radius);
  --weave-component-border-bottom-left-radius: var(--weave-select-option-radius);

  --weave-component-cursor: pointer;
  --weave-component-user-select: none;
  min-width: 0;

  --weave-component-transition-property: background, color, opacity;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-select-option[data-weave-select-option-active="true"]) {
  --weave-component-background:
    var(--weave-select-option-active-background);
}

:where(.weave-select-option[aria-selected="true"]) {
  --weave-component-background:
    var(--weave-select-option-selected-background);
  --weave-component-color:
    var(--weave-select-option-selected-color);
}

:where(
  .weave-select-option[aria-selected="true"][data-weave-select-option-active="true"]
) {
  --weave-component-background:
    color-mix(
      in srgb,
      var(--weave-select-option-selected-background) 72%,
      var(--weave-select-option-active-background)
    );
}

:where(.weave-select-option[aria-disabled="true"]) {
  --weave-component-opacity:
    var(--weave-select-option-disabled-opacity);
  --weave-component-cursor: default;
}

:where(.weave-select-option__icon) {
  --weave-component-width: var(--weave-select-option-icon-size);
  --weave-component-height: var(--weave-select-option-icon-size);
  --weave-component-flex-shrink: 0;
}

:where(.weave-select-option__text) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-gap: 0.125rem;
  --weave-component-flex-grow: 1;
  --weave-component-min-width: 0rem;
}

:where(.weave-select-option__secondary) {
  color: var(--weave-select-option-secondary-color);
}

:where(.weave-select-option__check) {
  --weave-component-width: var(--weave-select-option-check-size);
  --weave-component-height: var(--weave-select-option-check-size);
  --weave-component-flex-shrink: 0;
  opacity: 0;
}

:where(.weave-select-option[aria-selected="true"] .weave-select-option__check) {
  opacity: 1;
}
`

export function ensureSelectStylesheet(): void {
  ensureStaticStylesheet(
    'select',
    stylesheet,
  )
}
