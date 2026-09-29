import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-combobox-root) {
  position: relative;
  display: inline-block;
  min-width: 0;
}

:where(.weave-combobox) {
  --weave-component-min-height: var(--weave-combobox-min-height);
  --weave-component-min-width: var(--weave-combobox-min-width);
  --weave-component-padding-left: var(--weave-combobox-padding-x);
  --weave-component-padding-right:
    calc(
      var(--weave-combobox-padding-x) +
      var(--weave-combobox-action-size) +
      0.25rem
    );
  --weave-component-background: var(--weave-combobox-background);
  --weave-component-color: var(--weave-combobox-color);
  --weave-component-border-top-width: var(--weave-combobox-border-width);
  --weave-component-border-right-width: var(--weave-combobox-border-width);
  --weave-component-border-bottom-width: var(--weave-combobox-border-width);
  --weave-component-border-left-width: var(--weave-combobox-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-combobox-border-color);
  --weave-component-border-right-color: var(--weave-combobox-border-color);
  --weave-component-border-bottom-color: var(--weave-combobox-border-color);
  --weave-component-border-left-color: var(--weave-combobox-border-color);
  --weave-component-border-top-left-radius: var(--weave-combobox-radius);
  --weave-component-border-top-right-radius: var(--weave-combobox-radius);
  --weave-component-border-bottom-right-radius: var(--weave-combobox-radius);
  --weave-component-border-bottom-left-radius: var(--weave-combobox-radius);
  --weave-component-outline-width: 0;

  appearance: none;
  font: inherit;
  font-size: var(--weave-combobox-font-size);
  font-weight: var(--weave-combobox-font-weight);
  line-height: var(--weave-combobox-line-height);
  letter-spacing: var(--weave-combobox-letter-spacing);

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

:where(
  .weave-combobox-root[
    data-weave-combobox-has-clear="true"
  ] .weave-combobox
) {
  --weave-component-padding-right:
    calc(
      var(--weave-combobox-padding-x) +
      var(--weave-combobox-action-size) * 2 +
      0.5rem
    );
}

:where(.weave-combobox::placeholder) {
  color: var(--weave-combobox-placeholder-color);
}

:where(.weave-combobox:focus-visible) {
  --weave-component-outline-width:
    var(--weave-combobox-focus-outline-width);
  --weave-component-outline-color:
    var(--weave-combobox-focus-outline-color);
  --weave-component-outline-style:
    var(--weave-combobox-focus-outline-style);
  --weave-component-outline-offset:
    var(--weave-combobox-focus-outline-offset);
}

:where(.weave-combobox:disabled) {
  --weave-component-opacity:
    var(--weave-combobox-disabled-opacity);
  --weave-component-cursor:
    var(--weave-combobox-disabled-cursor);
}

:where(.weave-combobox__actions) {
  position: absolute;
  top: 50%;
  right: 0.25rem;
  translate: 0 -50%;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  pointer-events: none;
}

:where(.weave-combobox__action) {
  width: var(--weave-combobox-action-size);
  height: var(--weave-combobox-action-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  padding: 0;
  background: transparent;
  color: var(--weave-combobox-action-color);
  font: inherit;
  cursor: pointer;
  pointer-events: auto;
}

:where(.weave-combobox__action:hover) {
  background: var(--weave-combobox-action-hover-background);
}

:where(.weave-combobox__action:focus-visible) {
  outline:
    var(--weave-combobox-focus-outline-width)
    var(--weave-combobox-focus-outline-style)
    var(--weave-combobox-focus-outline-color);
  outline-offset:
    var(--weave-combobox-focus-outline-offset);
}

:where(.weave-combobox__action-icon),
:where(.weave-combobox__chevron) {
  width: var(--weave-combobox-icon-size);
  height: var(--weave-combobox-icon-size);
}

:where(.weave-combobox__chevron) {
  pointer-events: none;
  transition:
    transform
    var(--weave-motion-duration-fast)
    var(--weave-motion-curve-standard);
}

:where(
  .weave-combobox-root[
    data-weave-combobox-open="true"
  ] .weave-combobox__chevron
) {
  transform: rotate(180deg);
}

:where(.weave-combobox-listbox) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-align-items: stretch;
  --weave-component-gap: var(--weave-combobox-listbox-gap);
  --weave-component-min-width:
    max(
      var(--weave-combobox-listbox-min-width),
      var(--weave-combobox-anchor-width, 0px)
    );
  --weave-component-max-width: var(--weave-combobox-listbox-max-width);
  --weave-component-max-height: var(--weave-combobox-listbox-max-height);
  --weave-component-padding-top: var(--weave-combobox-listbox-padding);
  --weave-component-padding-right: var(--weave-combobox-listbox-padding);
  --weave-component-padding-bottom: var(--weave-combobox-listbox-padding);
  --weave-component-padding-left: var(--weave-combobox-listbox-padding);
  --weave-component-background: var(--weave-combobox-listbox-background);
  --weave-component-color: var(--weave-combobox-listbox-color);
  --weave-component-overflow-y: auto;
  --weave-component-border-top-width: var(--weave-combobox-listbox-border-width);
  --weave-component-border-right-width: var(--weave-combobox-listbox-border-width);
  --weave-component-border-bottom-width: var(--weave-combobox-listbox-border-width);
  --weave-component-border-left-width: var(--weave-combobox-listbox-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-combobox-listbox-border-color);
  --weave-component-border-right-color: var(--weave-combobox-listbox-border-color);
  --weave-component-border-bottom-color: var(--weave-combobox-listbox-border-color);
  --weave-component-border-left-color: var(--weave-combobox-listbox-border-color);
  --weave-component-border-top-left-radius: var(--weave-combobox-listbox-radius);
  --weave-component-border-top-right-radius: var(--weave-combobox-listbox-radius);
  --weave-component-border-bottom-right-radius: var(--weave-combobox-listbox-radius);
  --weave-component-border-bottom-left-radius: var(--weave-combobox-listbox-radius);
  --weave-component-box-shadow: var(--weave-combobox-listbox-shadow);

  --weave-combobox-listbox-motion-x: 0rem;
  --weave-combobox-listbox-motion-y: 0rem;
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
  :where(.weave-combobox-listbox[data-weave-combobox-state="open"]) {
    opacity: 0;
    translate:
      var(--weave-combobox-listbox-motion-x)
      var(--weave-combobox-listbox-motion-y);
    scale: 0.98;
  }
}

:where(.weave-combobox-listbox[data-weave-combobox-state="closing"]) {
  opacity: 0;
  translate:
    var(--weave-combobox-listbox-motion-x)
    var(--weave-combobox-listbox-motion-y);
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

:where(.weave-combobox-listbox[data-placement^="top"]) {
  --weave-combobox-listbox-motion-y:
    var(--weave-combobox-listbox-motion-offset);
  transform-origin: center bottom;
}

:where(.weave-combobox-listbox[data-placement^="bottom"]) {
  --weave-combobox-listbox-motion-y:
    calc(-1 * var(--weave-combobox-listbox-motion-offset));
  transform-origin: center top;
}

:where(.weave-combobox-listbox[data-placement="left"]) {
  --weave-combobox-listbox-motion-x:
    var(--weave-combobox-listbox-motion-offset);
  transform-origin: right center;
}

:where(.weave-combobox-listbox[data-placement="right"]) {
  --weave-combobox-listbox-motion-x:
    calc(-1 * var(--weave-combobox-listbox-motion-offset));
  transform-origin: left center;
}

:where(.weave-combobox-listbox[data-weave-reduced-motion="reduce"]),
:where(
  .weave-combobox-listbox[
    data-weave-reduced-motion="reduce"
  ][data-weave-combobox-state="closing"]
) {
  translate: 0 0;
  scale: 1;
  transition: none;
}

:where(.weave-combobox-option) {
  --weave-component-display: flex;
  --weave-component-flex-direction: row;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-combobox-option-gap);
  --weave-component-padding-top: var(--weave-combobox-option-padding-y);
  --weave-component-padding-right: var(--weave-combobox-option-padding-x);
  --weave-component-padding-bottom: var(--weave-combobox-option-padding-y);
  --weave-component-padding-left: var(--weave-combobox-option-padding-x);
  --weave-component-background: var(--weave-combobox-option-background);
  --weave-component-color: var(--weave-combobox-option-color);
  --weave-component-border-top-left-radius: var(--weave-combobox-option-radius);
  --weave-component-border-top-right-radius: var(--weave-combobox-option-radius);
  --weave-component-border-bottom-right-radius: var(--weave-combobox-option-radius);
  --weave-component-border-bottom-left-radius: var(--weave-combobox-option-radius);
  --weave-component-cursor: pointer;
  --weave-component-user-select: none;
  min-width: 0;
}

:where(.weave-combobox-option[data-weave-combobox-option-active="true"]) {
  --weave-component-background:
    var(--weave-combobox-option-active-background);
}

:where(.weave-combobox-option[aria-selected="true"]) {
  --weave-component-background:
    var(--weave-combobox-option-selected-background);
  --weave-component-color:
    var(--weave-combobox-option-selected-color);
}

:where(.weave-combobox-option[aria-disabled="true"]) {
  --weave-component-opacity:
    var(--weave-combobox-option-disabled-opacity);
  --weave-component-cursor: default;
}

:where(.weave-combobox-option__icon) {
  --weave-component-width: var(--weave-combobox-option-icon-size);
  --weave-component-height: var(--weave-combobox-option-icon-size);
  --weave-component-flex-shrink: 0;
}

:where(.weave-combobox-option__text) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-gap: 0.125rem;
  --weave-component-flex-grow: 1;
  --weave-component-min-width: 0rem;
}

:where(.weave-combobox-option__secondary) {
  color: var(--weave-combobox-option-secondary-color);
}

:where(.weave-combobox-option__check) {
  --weave-component-width: var(--weave-combobox-option-check-size);
  --weave-component-height: var(--weave-combobox-option-check-size);
  --weave-component-flex-shrink: 0;
  opacity: 0;
}

:where(.weave-combobox-option[aria-selected="true"] .weave-combobox-option__check) {
  opacity: 1;
}

:where(.weave-combobox-empty) {
  --weave-component-padding-top: 0.625rem;
  --weave-component-padding-right: 0.75rem;
  --weave-component-padding-bottom: 0.625rem;
  --weave-component-padding-left: 0.75rem;
  --weave-component-color: var(--weave-combobox-option-secondary-color);
}
`

export function ensureComboboxStylesheet(): void {
  ensureStaticStylesheet(
    'combobox',
    stylesheet,
  )
}
