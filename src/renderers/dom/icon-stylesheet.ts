import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-icon) {
  --weave-component-display: inline-flex;
  --weave-component-align-items: center;
  --weave-component-justify-content: center;
  --weave-component-flex-shrink: 0;
  line-height: 0;
  vertical-align: middle;
}

:where(.weave-icon--small) {
  --weave-component-width: var(--weave-icon-theme-size);
  --weave-component-height: var(--weave-icon-theme-size);
}

:where(.weave-icon--medium) {
  --weave-component-width: var(--weave-icon-theme-size);
  --weave-component-height: var(--weave-icon-theme-size);
}

:where(.weave-icon--large) {
  --weave-component-width: var(--weave-icon-theme-size);
  --weave-component-height: var(--weave-icon-theme-size);
}

:where(.weave-icon--xlarge) {
  --weave-component-width: var(--weave-icon-theme-size);
  --weave-component-height: var(--weave-icon-theme-size);
}

:where(.weave-icon) > :where(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
`

export function ensureIconStylesheet(): void {
  ensureStaticStylesheet('icon', stylesheet)
}
