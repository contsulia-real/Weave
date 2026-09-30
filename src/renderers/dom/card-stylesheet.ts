import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-card) {
  --weave-component-background: var(--weave-card-theme-background);
  --weave-component-border-top-width: var(--weave-card-theme-border-width);
  --weave-component-border-right-width: var(--weave-card-theme-border-width);
  --weave-component-border-bottom-width: var(--weave-card-theme-border-width);
  --weave-component-border-left-width: var(--weave-card-theme-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-card-theme-border-color);
  --weave-component-border-right-color: var(--weave-card-theme-border-color);
  --weave-component-border-bottom-color: var(--weave-card-theme-border-color);
  --weave-component-border-left-color: var(--weave-card-theme-border-color);
  --weave-component-border-top-left-radius: var(--weave-card-theme-radius);
  --weave-component-border-top-right-radius: var(--weave-card-theme-radius);
  --weave-component-border-bottom-right-radius: var(--weave-card-theme-radius);
  --weave-component-border-bottom-left-radius: var(--weave-card-theme-radius);
  --weave-component-padding-top: var(--weave-card-theme-padding);
  --weave-component-padding-right: var(--weave-card-theme-padding);
  --weave-component-padding-bottom: var(--weave-card-theme-padding);
  --weave-component-padding-left: var(--weave-card-theme-padding);
  --weave-component-box-shadow:
    0 var(--weave-card-theme-rest-depth) 0 var(--weave-card-theme-depth-color);
  --weave-component-outline-width: 0;
  --weave-component-transform: translateY(0) scale(1);
  --weave-component-transition-property:
    background-color, border-color, transform, box-shadow;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-spring-snappy-duration),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-spring-snappy-easing),
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-card[data-weave-card-interactive="true"]) {
  --weave-component-cursor: var(--weave-card-theme-cursor);
}

:where(.weave-card[aria-pressed="true"]) {
  --weave-component-background: var(--weave-card-theme-selected-background);
  --weave-component-border-top-color: var(--weave-card-theme-selected-border-color);
  --weave-component-border-right-color: var(--weave-card-theme-selected-border-color);
  --weave-component-border-bottom-color: var(--weave-card-theme-selected-border-color);
  --weave-component-border-left-color: var(--weave-card-theme-selected-border-color);
}

:where(.weave-card[data-weave-card-interactive="true"]:hover:not([aria-disabled="true"])) {
  --weave-component-transform:
    translateY(calc(-1 * var(--weave-feedback-hover-lift)))
    scale(var(--weave-feedback-hover-scale));
  --weave-component-box-shadow:
    0 var(--weave-card-theme-hover-depth) 0 var(--weave-card-theme-depth-color);
}

:where(
  .weave-card[data-weave-card-interactive="true"]:not([aria-pressed="true"]):hover:not([aria-disabled="true"])
) {
  --weave-component-background: var(--weave-card-theme-hover-background);
}

:where(.weave-card[data-weave-card-interactive="true"]:active:not([aria-disabled="true"])) {
  --weave-component-transform:
    translateY(var(--weave-feedback-press-offset))
    scale(var(--weave-feedback-press-scale));
  --weave-component-box-shadow:
    0 var(--weave-card-theme-press-depth) 0 var(--weave-card-theme-depth-color);
}

:where(
  .weave-card[data-weave-card-interactive="true"]:not([aria-pressed="true"]):active:not([aria-disabled="true"])
) {
  --weave-component-background: var(--weave-card-theme-active-background);
}

:where(.weave-card[data-weave-card-interactive="true"]:focus-visible) {
  --weave-component-outline-width: var(--weave-card-theme-focus-outline-width);
  --weave-component-outline-color: var(--weave-card-theme-focus-outline-color);
  --weave-component-outline-style: var(--weave-card-theme-focus-outline-style);
  --weave-component-outline-offset: var(--weave-card-theme-focus-outline-offset);
}

:where(.weave-card[data-weave-card-interactive="true"][aria-disabled="true"]) {
  --weave-component-cursor: default;
}
`

export function ensureCardStylesheet(): void {
  ensureStaticStylesheet('card', stylesheet)
}
