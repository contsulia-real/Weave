import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-tabs) {
  --weave-component-gap: var(--weave-tabs-gap);
  min-width: 0;
}

:where(.weave-tab-list) {
  --weave-component-position: relative;
  --weave-component-gap: var(--weave-tabs-list-gap);
  min-width: 0;
}

:where(
  .weave-tabs[data-weave-tabs-variant="underline"][data-weave-tabs-orientation="horizontal"]
    .weave-tab-list
) {
  --weave-component-padding-bottom:
    calc(var(--weave-tabs-list-gap) + var(--weave-tabs-indicator-thickness));
}

:where(
  .weave-tabs[data-weave-tabs-variant="underline"][data-weave-tabs-orientation="vertical"]
    .weave-tab-list
) {
  --weave-component-padding-left:
    calc(var(--weave-tabs-list-gap) + var(--weave-tabs-indicator-thickness));
}

:where(.weave-tab) {
  appearance: none;
  font: inherit;
  white-space: nowrap;
  --weave-component-position: relative;
  --weave-component-background: var(--weave-tabs-tab-background);
  --weave-component-color: var(--weave-tabs-tab-color);
  --weave-component-border-top-width: 0;
  --weave-component-border-right-width: 0;
  --weave-component-border-bottom-width: 0;
  --weave-component-border-left-width: 0;
  --weave-component-border-top-left-radius: var(--weave-tabs-tab-radius);
  --weave-component-border-top-right-radius: var(--weave-tabs-tab-radius);
  --weave-component-border-bottom-right-radius: var(--weave-tabs-tab-radius);
  --weave-component-border-bottom-left-radius: var(--weave-tabs-tab-radius);
  --weave-component-padding-top: var(--weave-tabs-tab-padding-y);
  --weave-component-padding-right: var(--weave-tabs-tab-padding-x);
  --weave-component-padding-bottom: var(--weave-tabs-tab-padding-y);
  --weave-component-padding-left: var(--weave-tabs-tab-padding-x);
  --weave-component-cursor: pointer;
  --weave-component-outline-width: 0;
  --weave-component-font-size: var(--weave-tabs-tab-font-size);
  --weave-component-font-weight: var(--weave-tabs-tab-font-weight);
  --weave-component-line-height: var(--weave-tabs-tab-line-height);
  --weave-component-letter-spacing: var(--weave-tabs-tab-letter-spacing);
  --weave-component-transition-property: background-color, color;
  --weave-component-transition-duration: var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function: var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
  z-index: 2;
}

:where(.weave-tab:hover:not(:disabled)) {
  --weave-component-background: var(--weave-tabs-tab-hover-background);
}

:where(.weave-tab[data-weave-tab-selected="true"]) {
  --weave-component-color: var(--weave-tabs-tab-selected-color);
}

:where(
  .weave-tabs[data-weave-tabs-variant="pill"]
    .weave-tab[data-weave-tab-selected="true"]
) {
  --weave-component-background: transparent;
  --weave-component-color: var(--weave-button-theme-primary-color);
  --weave-component-padding-bottom:
    calc(var(--weave-tabs-tab-padding-y) - var(--weave-feedback-rest-depth));
}

:where(
  .weave-tabs[data-weave-tabs-variant="pill"]
    .weave-tab[data-weave-tab-selected="true"]:hover
) {
  --weave-component-background: transparent;
}

:where(.weave-tab-indicator) {
  --weave-component-position: absolute;
  --weave-component-pointer-events: none;
  z-index: 1;
}

:where(.weave-tab-indicator--underline) {
  --weave-component-background: var(--weave-tabs-indicator-color);
  --weave-component-border-top-left-radius: 999px;
  --weave-component-border-top-right-radius: 999px;
  --weave-component-border-bottom-right-radius: 999px;
  --weave-component-border-bottom-left-radius: 999px;
}

:where(
  .weave-tabs[data-weave-tabs-orientation="horizontal"]
    .weave-tab-indicator--underline
) {
  height: var(--weave-tabs-indicator-thickness);
}

:where(
  .weave-tabs[data-weave-tabs-orientation="vertical"]
    .weave-tab-indicator--underline
) {
  width: var(--weave-tabs-indicator-thickness);
}

:where(.weave-tab-indicator--pill.weave-button) {
  --weave-component-min-width: 0;
  --weave-component-min-height: 0;
  --weave-component-padding-top: 0;
  --weave-component-padding-right: 0;
  --weave-component-padding-bottom: 0;
  --weave-component-padding-left: 0;
}

:where(.weave-tab:focus-visible) {
  --weave-component-outline-width: var(--weave-tabs-focus-outline-width);
  --weave-component-outline-color: var(--weave-tabs-focus-outline-color);
  --weave-component-outline-style: var(--weave-tabs-focus-outline-style);
  --weave-component-outline-offset: var(--weave-tabs-focus-outline-offset);
}

:where(.weave-tab:disabled) {
  --weave-component-cursor: not-allowed;
  opacity: var(--weave-tabs-disabled-opacity);
}

:where(.weave-tab-panel) {
  min-width: 0;
}

:where(.weave-tab-panel[hidden]) {
  display: none !important;
}

:where(.weave-tabs[data-weave-reduced-motion="reduce"] .weave-tab) {
  transition: none;
}
`

export function ensureTabsStylesheet(): void {
  ensureStaticStylesheet('tabs', stylesheet)
}
