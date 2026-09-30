import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-avatar) {
  --weave-component-display: inline-flex;
  --weave-component-width: 2.5rem;
  --weave-component-aspect-ratio: 1 / 1;
  --weave-component-align-items: center;
  --weave-component-justify-content: center;
  --weave-component-overflow: hidden;
  --weave-component-background: var(--weave-avatar-theme-background);
  --weave-component-color: var(--weave-avatar-theme-color);
  --weave-component-border-top-width: var(--weave-avatar-theme-border-width);
  --weave-component-border-right-width: var(--weave-avatar-theme-border-width);
  --weave-component-border-bottom-width: var(--weave-avatar-theme-border-width);
  --weave-component-border-left-width: var(--weave-avatar-theme-border-width);
  --weave-component-border-top-color: var(--weave-avatar-theme-border-color);
  --weave-component-border-right-color: var(--weave-avatar-theme-border-color);
  --weave-component-border-bottom-color: var(--weave-avatar-theme-border-color);
  --weave-component-border-left-color: var(--weave-avatar-theme-border-color);
  --weave-component-border-style: solid;
  --weave-component-position: relative;
  border-radius: 50%;
}

:where(.weave-avatar[data-weave-avatar-size-mode="height"]) {
  --weave-component-width: initial;
}

:where(.weave-avatar-fallback) {
  position: absolute;
  inset: calc(-1 * var(--weave-avatar-theme-border-width));
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: inline-size;
  user-select: none;
}

:where(.weave-avatar-fallback-content) {
  font-size: 40cqi;
  line-height: 1;
  text-align: center;
}

:where(.weave-avatar [data-weave-avatar-content-image]) {
  display: block;
  flex: none;
}
`

export function ensureAvatarStylesheet(): void {
  ensureStaticStylesheet('avatar', stylesheet)
}
