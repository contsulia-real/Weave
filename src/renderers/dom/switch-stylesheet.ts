import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-switch-field) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  line-height: 1.35;
}

:where(.weave-switch-field[data-weave-switch-disabled="true"]) {
  cursor: default;
}

:where(.weave-switch__label) {
  user-select: none;
}

:where(.weave-switch) {
  --weave-component-position: relative;
  --weave-component-width: var(--weave-switch-width);
  --weave-component-height: var(--weave-switch-height);
  --weave-component-background: var(--weave-switch-background);
  --weave-component-border-top-width: var(--weave-switch-border-width);
  --weave-component-border-right-width: var(--weave-switch-border-width);
  --weave-component-border-bottom-width: var(--weave-switch-border-width);
  --weave-component-border-left-width: var(--weave-switch-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-switch-border-color);
  --weave-component-border-right-color: var(--weave-switch-border-color);
  --weave-component-border-bottom-color: var(--weave-switch-border-color);
  --weave-component-border-left-color: var(--weave-switch-border-color);
  --weave-component-border-top-left-radius: var(--weave-switch-radius);
  --weave-component-border-top-right-radius: var(--weave-switch-radius);
  --weave-component-border-bottom-right-radius: var(--weave-switch-radius);
  --weave-component-border-bottom-left-radius: var(--weave-switch-radius);
  --weave-component-cursor: var(--weave-switch-cursor);
  --weave-component-outline-width: 0;
  --weave-component-box-shadow: var(--weave-switch-track-shadow);

  appearance: none;
  -webkit-appearance: none;
  padding: 0;
  font: inherit;
  text-align: inherit;

  --weave-component-transition-property: background-color;
  --weave-component-transition-duration: var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-switch:focus-visible) {
  --weave-component-outline-width: var(
    --weave-switch-focus-outline-width
  );
  --weave-component-outline-color: var(
    --weave-switch-focus-outline-color
  );
  --weave-component-outline-style: var(
    --weave-switch-focus-outline-style
  );
  --weave-component-outline-offset: var(
    --weave-switch-focus-outline-offset
  );
}

:where(.weave-switch[aria-checked="true"]) {
  --weave-component-background: var(
    --weave-switch-checked-background
  );
}

:where(.weave-switch[aria-disabled="true"]) {
  --weave-component-opacity: var(--weave-switch-disabled-opacity);
  --weave-component-cursor: var(--weave-switch-disabled-cursor);
}

:where(.weave-switch__thumb) {
  --weave-component-position: absolute;
  --weave-component-top: 50%;
  --weave-component-left: var(--weave-switch-thumb-inset);
  --weave-component-width: var(--weave-switch-thumb-size);
  --weave-component-height: var(--weave-switch-thumb-size);
  --weave-component-border-top-left-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-border-top-right-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-border-bottom-right-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-border-bottom-left-radius: var(
    --weave-switch-thumb-radius
  );
  --weave-component-background: var(
    --weave-switch-thumb-background
  );
  --weave-component-box-shadow: var(--weave-switch-thumb-shadow);
  --weave-component-pointer-events: auto;
  --weave-component-transform: translate(0, -50%);

  touch-action: none;
  will-change: transform, width, height;

  transition:
    transform var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(
  .weave-switch:hover:not([aria-disabled="true"]):not([
    data-weave-switch-dragging="true"
  ])
) > :where(.weave-switch__thumb) {
  --weave-component-box-shadow: var(
    --weave-switch-thumb-hover-shadow
  );
}

:where(.weave-switch[aria-checked="true"])
  > :where(.weave-switch__thumb) {
  --weave-component-transform: translate(var(--weave-switch-shift), -50%);
}

:where(.weave-switch[data-weave-switch-dragging="true"])
  > :where(.weave-switch__thumb) {
  --weave-component-cursor: grabbing;
  transition: none;
}

:where(.weave-switch[data-weave-reduced-motion="reduce"])
  > :where(.weave-switch__thumb) {
  transition: none;
}
`

export function ensureSwitchStylesheet(): void {
  ensureStaticStylesheet('switch', stylesheet)
}
