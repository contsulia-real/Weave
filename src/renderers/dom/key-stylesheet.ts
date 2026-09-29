import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-key) {
  --weave-component-cursor: default;
  --weave-component-transition-property: none;
  --weave-component-transition-duration: 0ms;
  --weave-component-transition-delay: 0ms;
}

.weave-key.weave-button--small .weave-icon {
  --weave-component-width: 1.75rem;
  --weave-component-height: 1.75rem;
}

.weave-key.weave-button--medium .weave-icon {
  --weave-component-width: 2rem;
  --weave-component-height: 2rem;
}

.weave-key.weave-button--large .weave-icon {
  --weave-component-width: 2.25rem;
  --weave-component-height: 2.25rem;
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
