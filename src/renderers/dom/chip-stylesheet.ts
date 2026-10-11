import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
.weave-chip > :where(.weave-button) {
  --weave-component-box-shadow: none;
  --weave-component-transform: none;
}

.weave-chip > :where(.weave-chip__label) {
  --weave-component-cursor: default;
  --weave-button-hover-background: var(--weave-button-background);
  --weave-button-active-background: var(--weave-button-background);
}

.weave-chip[data-weave-chip-pill="true"] > :where(.weave-button) {
  --weave-component-border-top-left-radius: var(--weave-radius-full);
  --weave-component-border-top-right-radius: var(--weave-radius-full);
  --weave-component-border-bottom-left-radius: var(--weave-radius-full);
  --weave-component-border-bottom-right-radius: var(--weave-radius-full);
}

.weave-chip[data-weave-chip-removable="true"] > :where(.weave-button:first-child) {
  --weave-component-border-top-right-radius: 0;
  --weave-component-border-bottom-right-radius: 0;
  --weave-component-border-right-width: 0;
}

.weave-chip[data-weave-chip-removable="true"] > :where(.weave-button:last-child) {
  --weave-component-border-top-left-radius: 0;
  --weave-component-border-bottom-left-radius: 0;
}
`

export function ensureChipStylesheet(): void {
  ensureStaticStylesheet('chip', stylesheet)
}
