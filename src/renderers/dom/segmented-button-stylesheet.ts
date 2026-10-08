import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
.weave-segmented-button > :where(.weave-button:not(:first-child)) {
  margin-inline-start: calc(-1 * var(--weave-button-theme-border-width));
  --weave-component-border-top-left-radius: 0;
  --weave-component-border-bottom-left-radius: 0;
}

.weave-segmented-button > :where(.weave-button:not(:last-child)) {
  --weave-component-border-top-right-radius: 0;
  --weave-component-border-bottom-right-radius: 0;
}

.weave-segmented-button > :where(.weave-button[aria-pressed="true"]:not([aria-disabled="true"])) {
  --weave-component-box-shadow:
    0 var(--weave-feedback-press-depth) 0 var(--weave-button-depth-color),
    inset 2px 0 3px
      color-mix(in srgb, var(--weave-button-depth-color) 58%, transparent),
    inset -1px 0 0
      color-mix(in srgb, white 12%, transparent);
}

.weave-segmented-button > :where(.weave-button:hover),
.weave-segmented-button > :where(.weave-button:focus-visible),
.weave-segmented-button > :where(.weave-button[aria-pressed="true"]) {
  z-index: 1;
}
`

export function ensureSegmentedButtonStylesheet(): void {
  ensureStaticStylesheet('segmented-button', stylesheet)
}
