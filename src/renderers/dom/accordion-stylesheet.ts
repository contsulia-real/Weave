import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-accordion) {
  --weave-component-background: transparent;
  min-width: 0;
}

:where(.weave-accordion-item) {
  --weave-component-display: grid;
  min-width: 0;
}


:where(.weave-accordion-trigger) {
  appearance: none;
  text-align: left;

  --weave-component-display: flex;
  --weave-component-width: 100%;
  --weave-component-border-top-width: 0;
  --weave-component-border-right-width: 0;
  --weave-component-border-bottom-width: 0;
  --weave-component-border-left-width: 0;
  --weave-component-align-items: center;
  --weave-component-justify-content: space-between;
  --weave-component-gap: var(--weave-spacing-small);
  --weave-component-background: var(--weave-accordion-trigger-background);
  --weave-component-color: var(--weave-accordion-trigger-color);
  --weave-component-border-top-left-radius: var(--weave-accordion-radius);
  --weave-component-border-top-right-radius: var(--weave-accordion-radius);
  --weave-component-border-bottom-right-radius: var(--weave-accordion-radius);
  --weave-component-border-bottom-left-radius: var(--weave-accordion-radius);
  --weave-component-padding-top: var(--weave-accordion-trigger-padding-y);
  --weave-component-padding-right: var(--weave-accordion-trigger-padding-x);
  --weave-component-padding-bottom: var(--weave-accordion-trigger-padding-y);
  --weave-component-padding-left: var(--weave-accordion-trigger-padding-x);
  --weave-component-cursor: pointer;
  --weave-component-outline-width: 0;
  font-size: var(--weave-accordion-font-size);
  font-weight: var(--weave-accordion-font-weight);
  line-height: var(--weave-accordion-line-height);
  letter-spacing: var(--weave-accordion-letter-spacing);
  --weave-component-transition-property: background-color;
  --weave-component-transition-duration: var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function: var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-accordion-trigger[data-weave-accordion-open="true"]) {
  --weave-component-background: var(--weave-accordion-trigger-open-background);
}

:where(.weave-accordion-trigger:hover:not(:disabled)) {
  --weave-component-background: var(--weave-accordion-trigger-hover-background);
}

:where(.weave-accordion-trigger:active:not(:disabled)) {
  --weave-component-background: var(--weave-accordion-trigger-pressed-background);
}

:where(.weave-accordion-trigger:focus-visible) {
  --weave-component-outline-width: var(--weave-accordion-focus-outline-width);
  --weave-component-outline-color: var(--weave-accordion-focus-outline-color);
  --weave-component-outline-style: var(--weave-accordion-focus-outline-style);
  --weave-component-outline-offset: var(--weave-accordion-focus-outline-offset);
}

:where(.weave-accordion-trigger:disabled) {
  --weave-component-cursor: not-allowed;
  opacity: var(--weave-accordion-disabled-opacity);
}

:where(.weave-accordion-trigger__content) {
  min-width: 0;
}

:where(.weave-accordion-trigger__indicator) {
  display: inline-flex;
  width: var(--weave-accordion-indicator-size);
  height: var(--weave-accordion-indicator-size);
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  transition: transform var(--weave-motion-duration-normal) var(--weave-motion-curve-spring);
}

:where(
  .weave-accordion-trigger[data-weave-accordion-default-icons="true"][data-weave-accordion-open="true"]
    .weave-accordion-trigger__indicator
) {
  transform: rotate(90deg);
}

:where(.weave-accordion-panel) {
  --weave-component-min-height: 0;
  --weave-component-overflow: hidden;
  min-width: 0;
}

:where(.weave-accordion-panel__content) {
  --weave-component-padding-top: var(--weave-accordion-panel-padding-y);
  --weave-component-padding-right: var(--weave-accordion-panel-padding-x);
  --weave-component-padding-bottom: var(--weave-accordion-panel-padding-y);
  --weave-component-padding-left: var(--weave-accordion-panel-padding-x);
}

:where(.weave-accordion[data-weave-accordion-disabled="true"] .weave-accordion-trigger__indicator) {
  opacity: var(--weave-accordion-disabled-opacity);
}


:where(.weave-accordion-trigger[data-weave-reduced-motion="reduce"] .weave-accordion-trigger__indicator) {
  transition: none;
}
`

export function ensureAccordionStylesheet(): void {
  ensureStaticStylesheet('accordion', stylesheet)
}
