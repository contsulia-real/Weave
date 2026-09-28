import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-popover) {
  --weave-component-width: max-content;
  --weave-component-min-width: var(--weave-popover-min-width);
  --weave-component-max-width: var(--weave-popover-max-width);
  --weave-component-background: var(--weave-popover-background);
  --weave-component-color: var(--weave-popover-color);

  --weave-component-border-top-width: var(--weave-popover-border-width);
  --weave-component-border-right-width: var(--weave-popover-border-width);
  --weave-component-border-bottom-width: var(--weave-popover-border-width);
  --weave-component-border-left-width: var(--weave-popover-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-popover-border-color);
  --weave-component-border-right-color: var(--weave-popover-border-color);
  --weave-component-border-bottom-color: var(--weave-popover-border-color);
  --weave-component-border-left-color: var(--weave-popover-border-color);

  --weave-component-border-top-left-radius: var(--weave-popover-radius);
  --weave-component-border-top-right-radius: var(--weave-popover-radius);
  --weave-component-border-bottom-right-radius: var(--weave-popover-radius);
  --weave-component-border-bottom-left-radius: var(--weave-popover-radius);

  --weave-component-padding-top: var(--weave-popover-padding-y);
  --weave-component-padding-right: var(--weave-popover-padding-x);
  --weave-component-padding-bottom: var(--weave-popover-padding-y);
  --weave-component-padding-left: var(--weave-popover-padding-x);

  --weave-component-box-shadow: var(--weave-popover-shadow);

  --weave-popover-motion-x: 0rem;
  --weave-popover-motion-y: 0rem;

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
  :where(.weave-popover[data-weave-popover-state="open"]) {
    opacity: 0;
    translate:
      var(--weave-popover-motion-x)
      var(--weave-popover-motion-y);
    scale: 0.97;
  }
}

:where(.weave-popover[data-weave-popover-state="closing"]) {
  opacity: 0;
  translate:
    var(--weave-popover-motion-x)
    var(--weave-popover-motion-y);
  scale: 0.98;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit),
    var(--weave-motion-curve-exit);
}

:where(.weave-popover[data-placement^="top"]) {
  --weave-popover-motion-y: var(--weave-popover-motion-offset);
  transform-origin: center bottom;
}

:where(.weave-popover[data-placement^="bottom"]) {
  --weave-popover-motion-y:
    calc(-1 * var(--weave-popover-motion-offset));
  transform-origin: center top;
}

:where(.weave-popover[data-placement="left"]) {
  --weave-popover-motion-x: var(--weave-popover-motion-offset);
  transform-origin: right center;
}

:where(.weave-popover[data-placement="right"]) {
  --weave-popover-motion-x:
    calc(-1 * var(--weave-popover-motion-offset));
  transform-origin: left center;
}

:where(.weave-popover[data-placement="top-left"]) {
  transform-origin: left bottom;
}

:where(.weave-popover[data-placement="top-right"]) {
  transform-origin: right bottom;
}

:where(.weave-popover[data-placement="bottom-left"]) {
  transform-origin: left top;
}

:where(.weave-popover[data-placement="bottom-right"]) {
  transform-origin: right top;
}

:where(.weave-popover[data-weave-reduced-motion="reduce"]),
:where(
  .weave-popover[data-weave-reduced-motion="reduce"][data-weave-popover-state="closing"]
) {
  translate: 0 0;
  scale: 1;
  transition: none;
}
`

export function ensurePopoverStylesheet(): void {
  ensureStaticStylesheet(
    'popover',
    stylesheet,
  )
}
