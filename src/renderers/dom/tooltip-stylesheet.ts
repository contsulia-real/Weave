import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-tooltip) {
  --weave-component-width: max-content;
  --weave-component-max-width: var(--weave-tooltip-max-width);
  --weave-component-background: var(--weave-tooltip-background);
  --weave-component-color: var(--weave-tooltip-color);

  --weave-component-border-top-width: var(--weave-tooltip-border-width);
  --weave-component-border-right-width: var(--weave-tooltip-border-width);
  --weave-component-border-bottom-width: var(--weave-tooltip-border-width);
  --weave-component-border-left-width: var(--weave-tooltip-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-tooltip-border-color);
  --weave-component-border-right-color: var(--weave-tooltip-border-color);
  --weave-component-border-bottom-color: var(--weave-tooltip-border-color);
  --weave-component-border-left-color: var(--weave-tooltip-border-color);

  --weave-component-border-top-left-radius: var(--weave-tooltip-radius);
  --weave-component-border-top-right-radius: var(--weave-tooltip-radius);
  --weave-component-border-bottom-right-radius: var(--weave-tooltip-radius);
  --weave-component-border-bottom-left-radius: var(--weave-tooltip-radius);

  --weave-component-padding-top: var(--weave-tooltip-padding-y);
  --weave-component-padding-right: var(--weave-tooltip-padding-x);
  --weave-component-padding-bottom: var(--weave-tooltip-padding-y);
  --weave-component-padding-left: var(--weave-tooltip-padding-x);

  --weave-component-box-shadow: var(--weave-tooltip-shadow);

  --weave-tooltip-motion-x: 0rem;
  --weave-tooltip-motion-y: 0rem;

  isolation: isolate;
  opacity: 1;
  translate: 0 0;
  scale: 1;
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
  :where(.weave-tooltip[data-weave-tooltip-state="open"]) {
    opacity: 0;
    translate:
      var(--weave-tooltip-motion-x)
      var(--weave-tooltip-motion-y);
    scale: 0.985;
  }
}

:where(.weave-tooltip[data-weave-tooltip-state="closing"]) {
  opacity: 0;
  translate:
    var(--weave-tooltip-motion-x)
    var(--weave-tooltip-motion-y);
  scale: 0.99;
  --weave-component-transition-property: opacity, translate, scale;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-tooltip)::before {
  content: "";
  position: absolute;
  width: var(--weave-tooltip-arrow-size);
  height: var(--weave-tooltip-arrow-size);
  box-sizing: border-box;
  background: inherit;
  border-style: solid;
  border-color: var(--weave-tooltip-border-color);
  border-width: 0;
  z-index: -1;
}

:where(.weave-tooltip[data-placement="top"]) {
  --weave-tooltip-motion-y: var(--weave-tooltip-motion-offset);
  transform-origin: center bottom;
}

:where(.weave-tooltip[data-placement="top"])::before {
  left: 50%;
  bottom: calc(-0.5 * var(--weave-tooltip-arrow-size));
  border-right-width: var(--weave-tooltip-border-width);
  border-bottom-width: var(--weave-tooltip-border-width);
  transform: translateX(-50%) rotate(45deg);
}

:where(.weave-tooltip[data-placement="bottom"]) {
  --weave-tooltip-motion-y:
    calc(-1 * var(--weave-tooltip-motion-offset));
  transform-origin: center top;
}

:where(.weave-tooltip[data-placement="bottom"])::before {
  left: 50%;
  top: calc(-0.5 * var(--weave-tooltip-arrow-size));
  border-left-width: var(--weave-tooltip-border-width);
  border-top-width: var(--weave-tooltip-border-width);
  transform: translateX(-50%) rotate(45deg);
}

:where(.weave-tooltip[data-placement="left"]) {
  --weave-tooltip-motion-x: var(--weave-tooltip-motion-offset);
  transform-origin: right center;
}

:where(.weave-tooltip[data-placement="left"])::before {
  top: 50%;
  right: calc(-0.5 * var(--weave-tooltip-arrow-size));
  border-top-width: var(--weave-tooltip-border-width);
  border-right-width: var(--weave-tooltip-border-width);
  transform: translateY(-50%) rotate(45deg);
}

:where(.weave-tooltip[data-placement="right"]) {
  --weave-tooltip-motion-x:
    calc(-1 * var(--weave-tooltip-motion-offset));
  transform-origin: left center;
}

:where(.weave-tooltip[data-placement="right"])::before {
  top: 50%;
  left: calc(-0.5 * var(--weave-tooltip-arrow-size));
  border-left-width: var(--weave-tooltip-border-width);
  border-bottom-width: var(--weave-tooltip-border-width);
  transform: translateY(-50%) rotate(45deg);
}
:where(.weave-tooltip[data-weave-reduced-motion="reduce"]),
:where(
  .weave-tooltip[data-weave-reduced-motion="reduce"][data-weave-tooltip-state="closing"]
) {
  translate: 0 0;
  scale: 1;
}

`

export function ensureToolTipStylesheet(): void {
  ensureStaticStylesheet('tooltip', stylesheet)
}
