import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-appbar) {
  --weave-component-display: grid;
  --weave-component-grid-template-columns: max-content minmax(0, 1fr) max-content;
  --weave-component-align-items: center;
  --weave-component-width: 100%;
  --weave-component-min-height: var(--weave-appbar-theme-medium-height);
  --weave-component-padding-left: var(--weave-appbar-theme-medium-padding-x);
  --weave-component-padding-right: var(--weave-appbar-theme-medium-padding-x);
  --weave-component-background: var(--weave-appbar-theme-background);
  --weave-component-border-top-width: var(--weave-appbar-theme-border-width);
  --weave-component-border-right-width: var(--weave-appbar-theme-border-width);
  --weave-component-border-bottom-width: var(--weave-appbar-theme-border-width);
  --weave-component-border-left-width: var(--weave-appbar-theme-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-appbar-theme-border-color);
  --weave-component-border-right-color: var(--weave-appbar-theme-border-color);
  --weave-component-border-bottom-color: var(--weave-appbar-theme-border-color);
  --weave-component-border-left-color: var(--weave-appbar-theme-border-color);
  --weave-component-border-top-left-radius: 0;
  --weave-component-border-top-right-radius: 0;
  --weave-component-border-bottom-right-radius: 0;
  --weave-component-border-bottom-left-radius: 0;
  --weave-component-box-shadow:
    0 var(--weave-appbar-theme-rest-depth) 0 var(--weave-appbar-theme-depth-color);
}

:where(.weave-appbar[data-weave-appbar-size="small"]) {
  --weave-component-min-height: var(--weave-appbar-theme-small-height);
  --weave-component-padding-left: var(--weave-appbar-theme-small-padding-x);
  --weave-component-padding-right: var(--weave-appbar-theme-small-padding-x);
}

:where(.weave-appbar[data-weave-appbar-size="large"]) {
  --weave-component-min-height: var(--weave-appbar-theme-large-height);
  --weave-component-padding-left: var(--weave-appbar-theme-large-padding-x);
  --weave-component-padding-right: var(--weave-appbar-theme-large-padding-x);
}

:where(.weave-appbar[data-weave-appbar-mode="floating"]) {
  --weave-component-width:
    calc(100% - var(--weave-appbar-theme-floating-margin) - var(--weave-appbar-theme-floating-margin));
  --weave-component-margin-top: var(--weave-appbar-theme-floating-margin);
  --weave-component-margin-right: var(--weave-appbar-theme-floating-margin);
  --weave-component-margin-bottom: var(--weave-appbar-theme-floating-margin);
  --weave-component-margin-left: var(--weave-appbar-theme-floating-margin);
  --weave-component-border-top-left-radius: var(--weave-appbar-theme-radius);
  --weave-component-border-top-right-radius: var(--weave-appbar-theme-radius);
  --weave-component-border-bottom-right-radius: var(--weave-appbar-theme-radius);
  --weave-component-border-bottom-left-radius: var(--weave-appbar-theme-radius);
}

:where(.weave-appbar[data-weave-appbar-sticky="true"]) {
  --weave-component-position: sticky;
  --weave-component-top: 0;
}

:where(.weave-appbar__leading),
:where(.weave-appbar__trailing) {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: var(--weave-appbar-theme-medium-gap);
}

:where(.weave-appbar[data-weave-appbar-size="small"]) :where(.weave-appbar__leading),
:where(.weave-appbar[data-weave-appbar-size="small"]) :where(.weave-appbar__trailing) {
  gap: var(--weave-appbar-theme-small-gap);
}

:where(.weave-appbar[data-weave-appbar-size="large"]) :where(.weave-appbar__leading),
:where(.weave-appbar[data-weave-appbar-size="large"]) :where(.weave-appbar__trailing) {
  gap: var(--weave-appbar-theme-large-gap);
}

:where(.weave-appbar__leading) {
  justify-self: start;
}

:where(.weave-appbar__trailing) {
  justify-self: end;
}

:where(.weave-appbar__title) {
  min-width: 0;
  justify-self: start;
}

:where(.weave-appbar[data-weave-appbar-title-align="center"]) :where(.weave-appbar__title) {
  justify-self: center;
}

:where(.weave-appbar[data-weave-appbar-title-align="end"]) :where(.weave-appbar__title) {
  justify-self: end;
}
`

export function ensureAppBarStylesheet(): void {
  ensureStaticStylesheet('appbar', stylesheet)
}
