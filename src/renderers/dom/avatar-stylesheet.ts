import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-avatar) {
  --weave-component-display: inline-flex;
  --weave-component-width: var(--weave-avatar-theme-default-size);
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
  user-select: none;
}

:where(.weave-avatar-fallback-content) {
  display: inline-block;
  text-align: center;
  transform: scale(var(--weave-avatar-fallback-scale, 1));
  transform-origin: center;
}

:where(.weave-avatar [data-weave-avatar-content-image]) {
  display: block;
  flex: none;
}
`

export function ensureAvatarStylesheet(): void {
  ensureStaticStylesheet('avatar', stylesheet)
}
