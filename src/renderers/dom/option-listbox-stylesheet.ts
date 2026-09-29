import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-option-listbox) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-align-items: stretch;
  --weave-component-gap: var(--weave-option-listbox-gap);
  --weave-component-min-width:
    max(
      var(--weave-option-listbox-min-width),
      var(--weave-option-listbox-anchor-width, 0px)
    );
  --weave-component-max-width: var(--weave-option-listbox-max-width);
  --weave-component-max-height: var(--weave-option-listbox-max-height);
  --weave-component-padding-top: var(--weave-option-listbox-padding);
  --weave-component-padding-right: var(--weave-option-listbox-padding);
  --weave-component-padding-bottom: var(--weave-option-listbox-padding);
  --weave-component-padding-left: var(--weave-option-listbox-padding);
  --weave-component-background: var(--weave-option-listbox-background);
  --weave-component-color: var(--weave-option-listbox-color);
  --weave-component-overflow-y: auto;
  --weave-component-border-top-width: var(--weave-option-listbox-border-width);
  --weave-component-border-right-width: var(--weave-option-listbox-border-width);
  --weave-component-border-bottom-width: var(--weave-option-listbox-border-width);
  --weave-component-border-left-width: var(--weave-option-listbox-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-option-listbox-border-color);
  --weave-component-border-right-color: var(--weave-option-listbox-border-color);
  --weave-component-border-bottom-color: var(--weave-option-listbox-border-color);
  --weave-component-border-left-color: var(--weave-option-listbox-border-color);
  --weave-component-border-top-left-radius: var(--weave-option-listbox-radius);
  --weave-component-border-top-right-radius: var(--weave-option-listbox-radius);
  --weave-component-border-bottom-right-radius: var(--weave-option-listbox-radius);
  --weave-component-border-bottom-left-radius: var(--weave-option-listbox-radius);
  --weave-component-box-shadow: var(--weave-option-listbox-shadow);

  --weave-option-listbox-motion-x: 0rem;
  --weave-option-listbox-motion-y: 0rem;

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
  :where(.weave-option-listbox[data-weave-option-listbox-state="open"]) {
    opacity: 0;
    translate:
      var(--weave-option-listbox-motion-x)
      var(--weave-option-listbox-motion-y);
    scale: 0.98;
  }
}

:where(.weave-option-listbox[data-weave-option-listbox-state="closing"]) {
  opacity: 0;
  translate:
    var(--weave-option-listbox-motion-x)
    var(--weave-option-listbox-motion-y);
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

:where(.weave-option-listbox[data-placement^="top"]) {
  --weave-option-listbox-motion-y:
    var(--weave-option-listbox-motion-offset);
  transform-origin: center bottom;
}

:where(.weave-option-listbox[data-placement^="bottom"]) {
  --weave-option-listbox-motion-y:
    calc(-1 * var(--weave-option-listbox-motion-offset));
  transform-origin: center top;
}

:where(.weave-option-listbox[data-placement="left"]) {
  --weave-option-listbox-motion-x:
    var(--weave-option-listbox-motion-offset);
  transform-origin: right center;
}

:where(.weave-option-listbox[data-placement="right"]) {
  --weave-option-listbox-motion-x:
    calc(-1 * var(--weave-option-listbox-motion-offset));
  transform-origin: left center;
}

:where(.weave-option-listbox[data-weave-reduced-motion="reduce"]),
:where(
  .weave-option-listbox[
    data-weave-reduced-motion="reduce"
  ][data-weave-option-listbox-state="closing"]
) {
  translate: 0 0;
  scale: 1;
  transition: none;
}

:where(.weave-option) {
  --weave-component-display: flex;
  --weave-component-flex-direction: row;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-option-gap);
  --weave-component-padding-top: var(--weave-option-padding-y);
  --weave-component-padding-right: var(--weave-option-padding-x);
  --weave-component-padding-bottom: var(--weave-option-padding-y);
  --weave-component-padding-left: var(--weave-option-padding-x);
  --weave-component-background: var(--weave-option-background);
  --weave-component-color: var(--weave-option-color);
  --weave-component-border-top-left-radius: var(--weave-option-radius);
  --weave-component-border-top-right-radius: var(--weave-option-radius);
  --weave-component-border-bottom-right-radius: var(--weave-option-radius);
  --weave-component-border-bottom-left-radius: var(--weave-option-radius);
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

:where(.weave-option[data-weave-option-active="true"]) {
  --weave-component-background:
    var(--weave-option-active-background);
}

:where(.weave-option[aria-selected="true"]) {
  --weave-component-background:
    var(--weave-option-selected-background);
  --weave-component-color:
    var(--weave-option-selected-color);
}

:where(
  .weave-select-option[aria-selected="true"][data-weave-option-active="true"]
) {
  --weave-component-background:
    color-mix(
      in srgb,
      var(--weave-option-selected-background) 72%,
      var(--weave-option-active-background)
    );
}

:where(.weave-option[aria-disabled="true"]) {
  --weave-component-opacity:
    var(--weave-option-disabled-opacity);
  --weave-component-cursor: default;
}

:where(.weave-option__icon) {
  --weave-component-width: var(--weave-option-icon-size);
  --weave-component-height: var(--weave-option-icon-size);
  --weave-component-flex-shrink: 0;
}

:where(.weave-option__text) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-gap: 0.125rem;
  --weave-component-flex-grow: 1;
  --weave-component-min-width: 0rem;
}

:where(.weave-option__secondary) {
  color: var(--weave-option-secondary-color);
}

:where(.weave-option__check) {
  --weave-component-width: var(--weave-option-check-size);
  --weave-component-height: var(--weave-option-check-size);
  --weave-component-flex-shrink: 0;
  opacity: 0;
}

:where(.weave-option[aria-selected="true"] .weave-option__check) {
  opacity: 1;
}
`

export function ensureOptionListboxStylesheet(): void {
  ensureStaticStylesheet('option-listbox', stylesheet)
}
