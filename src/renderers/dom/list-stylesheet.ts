import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-list) {
  --weave-component-display: flex;
  --weave-component-align-items: stretch;
  --weave-component-gap: var(--weave-list-gap);
  --weave-component-background: var(--weave-list-background);

  --weave-component-border-top-width: var(--weave-list-border-width);
  --weave-component-border-right-width: var(--weave-list-border-width);
  --weave-component-border-bottom-width: var(--weave-list-border-width);
  --weave-component-border-left-width: var(--weave-list-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-list-border-color);
  --weave-component-border-right-color: var(--weave-list-border-color);
  --weave-component-border-bottom-color: var(--weave-list-border-color);
  --weave-component-border-left-color: var(--weave-list-border-color);

  --weave-component-border-top-left-radius: var(--weave-list-radius);
  --weave-component-border-top-right-radius: var(--weave-list-radius);
  --weave-component-border-bottom-right-radius: var(--weave-list-radius);
  --weave-component-border-bottom-left-radius: var(--weave-list-radius);

  --weave-component-padding-top: var(--weave-list-padding);
  --weave-component-padding-right: var(--weave-list-padding);
  --weave-component-padding-bottom: var(--weave-list-padding);
  --weave-component-padding-left: var(--weave-list-padding);

  box-sizing: border-box;
}

:where(.weave-list[data-weave-list-orientation="vertical"]) {
  --weave-component-flex-direction: column;
}

:where(.weave-list[data-weave-list-orientation="horizontal"]) {
  --weave-component-flex-direction: row;
}

:where(.weave-list[data-weave-list-virtualized="true"]) {
  --weave-component-display: block;
  --weave-component-position: relative;
}

:where(.weave-list-item) {
  --weave-component-display: flex;
  --weave-component-flex-direction: row;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-list-item-gap);
  --weave-component-background: var(--weave-list-item-background);
  --weave-component-color: var(--weave-list-item-color);

  --weave-component-padding-top: var(--weave-list-item-padding-y);
  --weave-component-padding-right: var(--weave-list-item-padding-x);
  --weave-component-padding-bottom: var(--weave-list-item-padding-y);
  --weave-component-padding-left: var(--weave-list-item-padding-x);

  --weave-component-border-top-left-radius: var(--weave-list-item-radius);
  --weave-component-border-top-right-radius: var(--weave-list-item-radius);
  --weave-component-border-bottom-right-radius: var(--weave-list-item-radius);
  --weave-component-border-bottom-left-radius: var(--weave-list-item-radius);

  --weave-component-outline-width: 0;
  --weave-component-position: relative;
  --weave-component-user-select: none;

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


:where(.weave-list-item[data-weave-list-item-selectable="true"]) {
  --weave-component-cursor: pointer;
}

:where(.weave-list-item[data-weave-list-item-selectable="true"]:not([aria-disabled="true"]):hover) {
  --weave-component-background:
    var(--weave-list-item-hover-background);
}

:where(.weave-list-item[data-weave-list-item-selectable="true"]:not([aria-disabled="true"]):active) {
  --weave-component-background:
    var(--weave-list-item-active-background);
}

:where(.weave-list-item[data-weave-list-item-selected="true"]) {
  --weave-component-background:
    var(--weave-list-item-selected-background);
  --weave-component-color:
    var(--weave-list-item-selected-color);
}

:where(
  .weave-list-item[
    data-weave-list-item-selected="true"
  ][
    data-weave-list-item-selectable="true"
  ]:not([aria-disabled="true"]):hover
) {
  --weave-component-background:
    var(--weave-list-item-selected-hover-background);
}

:where(
  .weave-list-item[
    data-weave-list-item-selected="true"
  ][
    data-weave-list-item-selectable="true"
  ]:not([aria-disabled="true"]):active
) {
  --weave-component-background:
    var(--weave-list-item-active-background);
}

:where(.weave-list-item:focus-visible) {
  --weave-component-outline-width:
    var(--weave-list-item-focus-outline-width);
  --weave-component-outline-color:
    var(--weave-list-item-focus-outline-color);
  --weave-component-outline-style:
    var(--weave-list-item-focus-outline-style);
  --weave-component-outline-offset:
    var(--weave-list-item-focus-outline-offset);
}

:where(.weave-list-item[aria-disabled="true"]) {
  --weave-component-opacity:
    var(--weave-list-item-disabled-opacity);
  --weave-component-cursor: default;
}

:where(.weave-list-item__icon) {
  --weave-component-width:
    var(--weave-list-item-icon-size);
  --weave-component-height:
    var(--weave-list-item-icon-size);
  --weave-component-flex-shrink: 0;
}

:where(.weave-list-item__text) {
  --weave-component-display: flex;
  --weave-component-flex-direction: column;
  --weave-component-gap: 0.125rem;
  --weave-component-flex-grow: 1;
  --weave-component-min-width: 0rem;
}

:where(.weave-list-item__secondary) {
  color: var(--weave-list-item-secondary-color);
}

:where(.weave-list-item__trailing) {
  --weave-component-display: flex;
  --weave-component-align-items: center;
  --weave-component-flex-shrink: 0;
  margin-inline-start: auto;
}

`

export function ensureListStylesheet(): void {
  ensureStaticStylesheet('list', stylesheet)
}
