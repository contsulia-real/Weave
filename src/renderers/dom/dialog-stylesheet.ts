import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-dialog) {
  --weave-component-display: block;
  --weave-component-position: fixed;
  --weave-component-top: 0;
  --weave-component-right: 0;
  --weave-component-bottom: 0;
  --weave-component-left: 0;
  --weave-component-margin-top: auto;
  --weave-component-margin-right: auto;
  --weave-component-margin-bottom: auto;
  --weave-component-margin-left: auto;

  --weave-component-width: var(--weave-dialog-width);
  --weave-component-height: fit-content;
  --weave-component-max-width: var(--weave-dialog-max-width);
  --weave-component-max-height: var(--weave-dialog-max-height);
  --weave-component-background: var(--weave-dialog-background);
  --weave-component-color: var(--weave-dialog-color);

  --weave-component-border-top-width: var(--weave-dialog-border-width);
  --weave-component-border-right-width: var(--weave-dialog-border-width);
  --weave-component-border-bottom-width: var(--weave-dialog-border-width);
  --weave-component-border-left-width: var(--weave-dialog-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-dialog-border-color);
  --weave-component-border-right-color: var(--weave-dialog-border-color);
  --weave-component-border-bottom-color: var(--weave-dialog-border-color);
  --weave-component-border-left-color: var(--weave-dialog-border-color);

  --weave-component-border-top-left-radius: var(--weave-dialog-radius);
  --weave-component-border-top-right-radius: var(--weave-dialog-radius);
  --weave-component-border-bottom-right-radius: var(--weave-dialog-radius);
  --weave-component-border-bottom-left-radius: var(--weave-dialog-radius);

  --weave-component-padding-top: var(--weave-dialog-padding-y);
  --weave-component-padding-right: var(--weave-dialog-padding-x);
  --weave-component-padding-bottom: var(--weave-dialog-padding-y);
  --weave-component-padding-left: var(--weave-dialog-padding-x);

  --weave-component-transform: translateY(0) scale(1);
  --weave-component-box-shadow:
    var(--weave-dialog-shadow),
    0 var(--weave-feedback-rest-depth) 0 var(--weave-dialog-depth-color);

  opacity: 1;
  translate: 0 0;
  scale: 1;
  isolation: isolate;
  overflow: auto;
  will-change: opacity, translate, scale, transform;
  --weave-component-transition-property:
    opacity, translate, scale, transform, box-shadow;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-normal),
    var(--weave-motion-duration-normal),
    var(--weave-motion-spring-snappy-duration),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-enter),
    var(--weave-motion-curve-emphasized),
    var(--weave-motion-curve-emphasized),
    var(--weave-motion-spring-snappy-easing),
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-dialog[data-weave-dialog-state="open"]:hover) {
  --weave-component-transform:
    translateY(calc(-1 * var(--weave-feedback-hover-lift)))
    scale(var(--weave-feedback-hover-scale));
  --weave-component-box-shadow:
    var(--weave-dialog-shadow),
    0 var(--weave-feedback-hover-depth) 0 var(--weave-dialog-depth-color);
}

:where(.weave-dialog)::backdrop {
  background: var(--weave-dialog-backdrop-color);
  opacity: 1;
  transition:
    opacity
    var(--weave-motion-duration-fast)
    var(--weave-motion-curve-enter);
}

@starting-style {
  :where(.weave-dialog[data-weave-dialog-state="open"]) {
    opacity: 0;
    translate: 0 var(--weave-dialog-motion-offset);
    scale: 0.97;
  }

  :where(.weave-dialog[data-weave-dialog-modal="true"][open])::backdrop {
    opacity: 0;
  }
}

:where(.weave-dialog[data-weave-dialog-state="closing"]) {
  opacity: 0;
  translate: 0 var(--weave-dialog-motion-offset);
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

:where(.weave-dialog[data-weave-dialog-state="closing"])::backdrop {
  opacity: 0;
  transition-timing-function: var(--weave-motion-curve-exit);
}

:where(.weave-dialog[data-weave-reduced-motion="reduce"]),
:where(.weave-dialog[data-weave-reduced-motion="reduce"][data-weave-dialog-state="closing"]) {
  --weave-component-transform: none;
  translate: 0 0;
  scale: 1;
  transition: none;
}

:where(.weave-dialog[data-weave-reduced-motion="reduce"])::backdrop {
  transition: none;
}
`

export function ensureDialogStylesheet(): void {
  ensureStaticStylesheet('dialog', stylesheet)
}
