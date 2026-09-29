import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-snack-region) {
  position: fixed;
  display: flex;
  gap: 0.5rem;
  pointer-events: none;
  z-index: var(--weave-layer-snack);
}

:where(.weave-snack-region[data-weave-snack-scope="container"]) {
  position: absolute;
}

:where(.weave-snack-region[data-weave-snack-region^="top-"]) {
  top: 1rem;
  flex-direction: column;
}

:where(.weave-snack-region[data-weave-snack-region^="bottom-"]) {
  bottom: 1rem;
  flex-direction: column-reverse;
}

:where(.weave-snack-region[data-weave-snack-region$="-left"]) {
  left: 1rem;
  align-items: flex-start;
}

:where(.weave-snack-region[data-weave-snack-region$="-right"]) {
  right: 1rem;
  align-items: flex-end;
}

:where(.weave-snack-region[data-weave-snack-region$="-center"]) {
  left: 50%;
  align-items: center;
  transform: translateX(-50%);
}

:where(.weave-snack) {
  --weave-component-display: flex;
  --weave-component-flex-direction: row;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-snack-gap);

  --weave-component-background: var(--weave-snack-background);
  --weave-component-color: var(--weave-snack-color);

  --weave-component-border-top-width: var(--weave-snack-border-width);
  --weave-component-border-right-width: var(--weave-snack-border-width);
  --weave-component-border-bottom-width: var(--weave-snack-border-width);
  --weave-component-border-left-width: var(--weave-snack-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-snack-border-color);
  --weave-component-border-right-color: var(--weave-snack-border-color);
  --weave-component-border-bottom-color: var(--weave-snack-border-color);
  --weave-component-border-left-color: var(--weave-snack-border-color);

  --weave-component-border-top-left-radius: var(--weave-snack-radius);
  --weave-component-border-top-right-radius: var(--weave-snack-radius);
  --weave-component-border-bottom-right-radius: var(--weave-snack-radius);
  --weave-component-border-bottom-left-radius: var(--weave-snack-radius);

  --weave-component-padding-top: var(--weave-snack-padding-y);
  --weave-component-padding-right: var(--weave-snack-padding-x);
  --weave-component-padding-bottom: var(--weave-snack-padding-y);
  --weave-component-padding-left: var(--weave-snack-padding-x);

  --weave-component-box-shadow: var(--weave-snack-shadow);
  --weave-component-pointer-events: auto;
  --weave-component-position: relative;
  --weave-component-overflow: hidden;

  --weave-snack-enter-y: 0rem;
  --weave-snack-exit-y: 0rem;

  opacity: 1;
  --weave-component-transform: translateY(0);
  will-change: opacity, transform;

  --weave-component-transition-property: opacity, transform;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-normal);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-enter),
    var(--weave-motion-curve-emphasized);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-snack[data-weave-snack-placement^="top-"]) {
  --weave-snack-enter-y:
    var(--weave-snack-motion-offset);
  --weave-snack-exit-y:
    calc(-1 * var(--weave-snack-motion-offset));
}

:where(.weave-snack[data-weave-snack-placement^="bottom-"]) {
  --weave-snack-enter-y:
    calc(-1 * var(--weave-snack-motion-offset));
  --weave-snack-exit-y:
    var(--weave-snack-motion-offset);
}

@starting-style {
  :where(.weave-snack[data-weave-snack-state="open"]) {
    opacity: 0;
    --weave-component-transform: translateY(var(--weave-snack-enter-y));
  }
}

:where(.weave-snack[data-weave-snack-state="closing"]) {
  opacity: 0;
  --weave-component-transform: translateY(var(--weave-snack-exit-y));
  --weave-component-transition-property: opacity, transform;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-snack__lifetime) {
  --weave-motion-curve-standard: linear;
  z-index: 1;
}

:where(.weave-snack--default) {
  --weave-snack-accent: var(--weave-snack-default-accent);
}

:where(.weave-snack--success) {
  --weave-snack-accent: var(--weave-snack-success-accent);
}

:where(.weave-snack--warning) {
  --weave-snack-accent: var(--weave-snack-warning-accent);
}

:where(.weave-snack--danger) {
  --weave-snack-accent: var(--weave-snack-danger-accent);
}

:where(.weave-snack--info) {
  --weave-snack-accent: var(--weave-snack-info-accent);
}

:where(.weave-snack__icon-shell) {
  --weave-component-display: grid;
  --weave-component-align-items: center;
  --weave-component-justify-content: center;
  --weave-component-width: var(--weave-snack-icon-size);
  --weave-component-height: var(--weave-snack-icon-size);
  --weave-component-flex-shrink: 0;
  --weave-component-background:
    color-mix(
      in srgb,
      var(--weave-snack-accent) 12%,
      var(--weave-color-surface)
    );
  --weave-component-border-top-width: var(--weave-snack-border-width);
  --weave-component-border-right-width: var(--weave-snack-border-width);
  --weave-component-border-bottom-width: var(--weave-snack-border-width);
  --weave-component-border-left-width: var(--weave-snack-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color:
    color-mix(in srgb, var(--weave-snack-accent) 30%, var(--weave-color-outline));
  --weave-component-border-right-color:
    color-mix(in srgb, var(--weave-snack-accent) 30%, var(--weave-color-outline));
  --weave-component-border-bottom-color:
    color-mix(in srgb, var(--weave-snack-accent) 30%, var(--weave-color-outline));
  --weave-component-border-left-color:
    color-mix(in srgb, var(--weave-snack-accent) 30%, var(--weave-color-outline));
  --weave-component-border-top-left-radius: 9999px;
  --weave-component-border-top-right-radius: 9999px;
  --weave-component-border-bottom-right-radius: 9999px;
  --weave-component-border-bottom-left-radius: 9999px;
  color: var(--weave-snack-accent);
}

:where(.weave-snack__icon) {
  color: inherit;
}

:where(.weave-snack__message) {
  flex: 1 1 auto;
  min-width: 0;
}

:where(.weave-snack__action) {
  flex: 0 0 auto;
}

:where(.weave-snack[data-weave-reduced-motion="reduce"]),
:where(
  .weave-snack[data-weave-reduced-motion="reduce"][data-weave-snack-state="closing"]
) {
  --weave-component-transform: translateY(0);
}
`

export function ensureSnackStylesheet(): void {
  ensureStaticStylesheet('snack', stylesheet)
}
