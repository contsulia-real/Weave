import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-menu) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-align-items: stretch;
  --weave-component-gap: var(--weave-menu-gap);
  --weave-component-width: max-content;
  --weave-component-min-width: var(--weave-menu-min-width);
  --weave-component-max-width: var(--weave-menu-max-width);
  --weave-component-background: var(--weave-menu-background);
  --weave-component-color: var(--weave-menu-color);

  --weave-component-border-top-width: var(--weave-menu-border-width);
  --weave-component-border-right-width: var(--weave-menu-border-width);
  --weave-component-border-bottom-width: var(--weave-menu-border-width);
  --weave-component-border-left-width: var(--weave-menu-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-menu-border-color);
  --weave-component-border-right-color: var(--weave-menu-border-color);
  --weave-component-border-bottom-color: var(--weave-menu-border-color);
  --weave-component-border-left-color: var(--weave-menu-border-color);

  --weave-component-border-top-left-radius: var(--weave-menu-radius);
  --weave-component-border-top-right-radius: var(--weave-menu-radius);
  --weave-component-border-bottom-right-radius: var(--weave-menu-radius);
  --weave-component-border-bottom-left-radius: var(--weave-menu-radius);

  --weave-component-padding-top: var(--weave-menu-padding);
  --weave-component-padding-right: var(--weave-menu-padding);
  --weave-component-padding-bottom: var(--weave-menu-padding);
  --weave-component-padding-left: var(--weave-menu-padding);

  --weave-component-box-shadow: var(--weave-menu-shadow);

  --weave-menu-motion-x: 0rem;
  --weave-menu-motion-y: 0rem;

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
  :where(.weave-menu[data-weave-menu-state="open"]) {
    opacity: 0;
    translate:
      var(--weave-menu-motion-x)
      var(--weave-menu-motion-y);
    scale: var(--weave-menu-enter-scale);
  }
}

:where(.weave-menu[data-weave-menu-state="closing"]) {
  opacity: 0;
  translate:
    var(--weave-menu-motion-x)
    var(--weave-menu-motion-y);
  scale: var(--weave-menu-exit-scale);
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit);
}

:where(.weave-menu[data-placement^="top"]) {
  --weave-menu-motion-y: var(--weave-menu-motion-offset);
  transform-origin: center bottom;
}

:where(.weave-menu[data-placement^="bottom"]) {
  --weave-menu-motion-y:
    calc(-1 * var(--weave-menu-motion-offset));
  transform-origin: center top;
}

:where(.weave-menu[data-placement="left"]) {
  --weave-menu-motion-x: var(--weave-menu-motion-offset);
  transform-origin: right top;
}

:where(.weave-menu[data-placement="right"]) {
  --weave-menu-motion-x:
    calc(-1 * var(--weave-menu-motion-offset));
  transform-origin: left top;
}

:where(.weave-menu[data-weave-reduced-motion="reduce"]),
:where(
  .weave-menu[data-weave-reduced-motion="reduce"][data-weave-menu-state="closing"]
) {
  translate: 0 0;
  scale: 1;
  transition: none;
}

:where(.weave-menu-item) {
  --weave-component-display: flex;
  --weave-component-flex-direction: row;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-menu-item-gap);
  --weave-component-background: var(--weave-menu-item-background);
  --weave-component-color: var(--weave-menu-item-color);

  --weave-component-padding-top: var(--weave-menu-item-padding-y);
  --weave-component-padding-right: var(--weave-menu-item-padding-x);
  --weave-component-padding-bottom: var(--weave-menu-item-padding-y);
  --weave-component-padding-left: var(--weave-menu-item-padding-x);

  --weave-component-border-top-left-radius: var(--weave-menu-item-radius);
  --weave-component-border-top-right-radius: var(--weave-menu-item-radius);
  --weave-component-border-bottom-right-radius: var(--weave-menu-item-radius);
  --weave-component-border-bottom-left-radius: var(--weave-menu-item-radius);

  --weave-component-outline-width: 0;
  --weave-component-position: relative;
  --weave-component-user-select: none;
  --weave-component-cursor: pointer;

  min-width: 0;

  --weave-component-transition-property: background, color;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-menu-item:not([aria-disabled="true"]):hover),
:where(.weave-menu-item[data-weave-menu-item-submenu-open="true"]) {
  --weave-component-background:
    var(--weave-menu-item-hover-background);
}

:where(.weave-menu-item:not([aria-disabled="true"]):active) {
  --weave-component-background:
    var(--weave-menu-item-active-background);
}

:where(.weave-menu-item:focus-visible) {
  --weave-component-outline-width:
    var(--weave-menu-item-focus-outline-width);
  --weave-component-outline-color:
    var(--weave-menu-item-focus-outline-color);
  --weave-component-outline-style:
    var(--weave-menu-item-focus-outline-style);
  --weave-component-outline-offset:
    var(--weave-menu-item-focus-outline-offset);
}

:where(.weave-menu-item[aria-disabled="true"]) {
  --weave-component-opacity:
    var(--weave-menu-item-disabled-opacity);
  --weave-component-cursor: not-allowed;
}

:where(.weave-menu-item[data-weave-menu-item-danger="true"]) {
  --weave-component-color:
    var(--weave-menu-item-danger-color);
}

:where(
  .weave-menu-item[data-weave-menu-item-danger="true"]:not([aria-disabled="true"]):hover
),
:where(
  .weave-menu-item[data-weave-menu-item-danger="true"]:not([aria-disabled="true"]):active
) {
  --weave-component-background:
    var(--weave-menu-item-danger-background);
}

:where(.weave-menu-item__icon) {
  --weave-component-width:
    var(--weave-menu-item-icon-size);
  --weave-component-height:
    var(--weave-menu-item-icon-size);
  --weave-component-flex-shrink: 0;
}

:where(.weave-menu-item__text) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-gap: var(--weave-menu-item-text-gap);
  --weave-component-flex-grow: 1;
  --weave-component-min-width: 0rem;
}

:where(.weave-menu-item__secondary) {
  color: var(--weave-menu-item-secondary-color);
}

:where(.weave-menu-item__submenu-icon) {
  --weave-component-width:
    var(--weave-menu-item-submenu-icon-size);
  --weave-component-height:
    var(--weave-menu-item-submenu-icon-size);
  --weave-component-flex-shrink: 0;
  margin-inline-start: auto;
}

`

export function ensureMenuStylesheet(): void {
  ensureStaticStylesheet('menu', stylesheet)
}
