import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-key) {
  --weave-component-cursor: default;
  --weave-component-transition-property: none;
  --weave-component-transition-duration: 0ms;
  --weave-component-transition-delay: 0ms;
}

:where(.weave-key:hover),
:where(.weave-key:active),
:where(.weave-key:focus-visible) {
  --weave-component-background: var(--weave-button-background);
  --weave-component-transform: translateY(0) scale(1);
  --weave-component-box-shadow:
    0 var(--weave-feedback-rest-depth) 0 var(--weave-button-depth-color);
  --weave-component-outline-width: 0;
}
`

export function ensureKeyStylesheet(): void {
  ensureStaticStylesheet('key', stylesheet)
}
