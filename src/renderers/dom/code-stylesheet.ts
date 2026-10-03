import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-code) {
  min-width: 0;
  font-family: var(--weave-typography-family-mono);
  --weave-component-overflow: auto;
}

:where(.weave-code .shiki) {
  margin: 0;
  min-width: 0;
  max-width: 100%;
  overflow: visible;
  background: transparent !important;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

:where(.weave-code .shiki > code) {
  font-family: inherit;
}

:where(.weave-code__fallback) {
  margin: 0;
  min-width: 0;
  max-width: 100%;
  overflow: visible;
  font-family: inherit;
  white-space: pre;
}
`

export function ensureCodeStylesheet(): void {
  ensureStaticStylesheet('code', stylesheet)
}
