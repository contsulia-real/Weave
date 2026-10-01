import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-code) {
  min-width: 0;
  font-family: var(--weave-typography-family-mono);
}

:where(.weave-code .shiki) {
  margin: 0;
  overflow: auto;
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
  overflow: auto;
  font-family: inherit;
  white-space: pre;
}
`

export function ensureCodeStylesheet(): void {
  ensureStaticStylesheet('code', stylesheet)
}
