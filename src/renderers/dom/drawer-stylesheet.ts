import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-drawer-content-host),
:where(.weave-drawer-content-mount) {
  display: contents;
}

.weave-splitbox-pane.weave-drawer-pane {
  overflow: hidden;
}

.weave-drawer-surface {
  --weave-component-background: var(--weave-drawer-background);
  --weave-component-color: var(--weave-drawer-color);
  --weave-component-border-top-width: var(--weave-drawer-border-width);
  --weave-component-border-right-width: var(--weave-drawer-border-width);
  --weave-component-border-bottom-width: var(--weave-drawer-border-width);
  --weave-component-border-left-width: var(--weave-drawer-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-drawer-border-color);
  --weave-component-border-right-color: var(--weave-drawer-border-color);
  --weave-component-border-bottom-color: var(--weave-drawer-border-color);
  --weave-component-border-left-color: var(--weave-drawer-border-color);
  --weave-component-padding-top: var(--weave-drawer-padding-y);
  --weave-component-padding-right: var(--weave-drawer-padding-x);
  --weave-component-padding-bottom: var(--weave-drawer-padding-y);
  --weave-component-padding-left: var(--weave-drawer-padding-x);
  min-width: 0;
  min-height: 0;
}

.weave-drawer-surface--non-modal {
  --weave-component-border-top-left-radius: 0;
  --weave-component-border-top-right-radius: 0;
  --weave-component-border-bottom-right-radius: 0;
  --weave-component-border-bottom-left-radius: 0;
  --weave-component-box-shadow: none;
}

.weave-drawer-surface--modal {
  --weave-component-box-shadow: var(--weave-drawer-shadow);
}

.weave-drawer-surface--modal[data-weave-drawer-side="left"] {
  --weave-component-border-top-left-radius: 0;
  --weave-component-border-bottom-left-radius: 0;
  --weave-component-border-top-right-radius: var(--weave-drawer-radius);
  --weave-component-border-bottom-right-radius: var(--weave-drawer-radius);
}

.weave-drawer-surface--modal[data-weave-drawer-side="right"] {
  --weave-component-border-top-right-radius: 0;
  --weave-component-border-bottom-right-radius: 0;
  --weave-component-border-top-left-radius: var(--weave-drawer-radius);
  --weave-component-border-bottom-left-radius: var(--weave-drawer-radius);
}

.weave-drawer-surface--modal[data-weave-drawer-side="top"] {
  --weave-component-border-top-left-radius: 0;
  --weave-component-border-top-right-radius: 0;
  --weave-component-border-bottom-left-radius: var(--weave-drawer-radius);
  --weave-component-border-bottom-right-radius: var(--weave-drawer-radius);
}

.weave-drawer-surface--modal[data-weave-drawer-side="bottom"] {
  --weave-component-border-bottom-left-radius: 0;
  --weave-component-border-bottom-right-radius: 0;
  --weave-component-border-top-left-radius: var(--weave-drawer-radius);
  --weave-component-border-top-right-radius: var(--weave-drawer-radius);
}

.weave-dialog.weave-drawer-surface--modal {
  margin: 0;
  scale: 1;
  opacity: 1;
  isolation: isolate;
  overscroll-behavior: contain;
  scrollbar-width: none;
  transition:
    translate var(--weave-motion-duration-normal) var(--weave-motion-curve-emphasized),
    opacity var(--weave-motion-duration-fast) var(--weave-motion-curve-enter);
}

.weave-dialog.weave-drawer-surface--modal::-webkit-scrollbar {
  display: none;
}

.weave-dialog.weave-drawer-surface--modal[data-weave-drawer-dragging="true"] {
  transition: none;
}

.weave-dialog.weave-drawer-surface--modal[data-weave-drawer-side="left"] {
  translate: calc(-1 * var(--weave-drawer-drag-offset, 0px)) 0;
}

.weave-dialog.weave-drawer-surface--modal[data-weave-drawer-side="right"] {
  translate: var(--weave-drawer-drag-offset, 0px) 0;
}

.weave-dialog.weave-drawer-surface--modal[data-weave-drawer-side="top"] {
  translate: 0 calc(-1 * var(--weave-drawer-drag-offset, 0px));
}

.weave-dialog.weave-drawer-surface--modal[data-weave-drawer-side="bottom"] {
  translate: 0 var(--weave-drawer-drag-offset, 0px);
}

.weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="closing"][data-weave-drawer-side="left"] {
  translate: -100% 0;
}

.weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="closing"][data-weave-drawer-side="right"] {
  translate: 100% 0;
}

.weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="closing"][data-weave-drawer-side="top"] {
  translate: 0 -100%;
}

.weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="closing"][data-weave-drawer-side="bottom"] {
  translate: 0 100%;
}

.weave-dialog.weave-drawer-surface--modal::backdrop {
  background: var(--weave-drawer-backdrop-color);
}

@starting-style {
  .weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="open"][data-weave-drawer-side="left"] {
    translate: -100% 0;
  }

  .weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="open"][data-weave-drawer-side="right"] {
    translate: 100% 0;
  }

  .weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="open"][data-weave-drawer-side="top"] {
    translate: 0 -100%;
  }

  .weave-dialog.weave-drawer-surface--modal[data-weave-dialog-state="open"][data-weave-drawer-side="bottom"] {
    translate: 0 100%;
  }
}

.weave-dialog.weave-drawer-surface--modal[data-weave-reduced-motion="reduce"],
.weave-dialog.weave-drawer-surface--modal[data-weave-reduced-motion="reduce"][data-weave-dialog-state="closing"] {
  transition: none;
}

:where(.weave-drawer-handle) {
  --weave-component-display: block;
  --weave-component-background: var(--weave-drawer-handle-color);
  --weave-component-border-top-left-radius: var(--weave-drawer-handle-radius);
  --weave-component-border-top-right-radius: var(--weave-drawer-handle-radius);
  --weave-component-border-bottom-right-radius: var(--weave-drawer-handle-radius);
  --weave-component-border-bottom-left-radius: var(--weave-drawer-handle-radius);
  --weave-component-cursor: grab;
  --weave-component-user-select: none;
  touch-action: none;
}

:where(.weave-drawer-handle[data-weave-drawer-side="left"]),
:where(.weave-drawer-handle[data-weave-drawer-side="right"]) {
  --weave-component-width: var(--weave-drawer-handle-thickness);
  --weave-component-height: var(--weave-drawer-handle-length);
}

:where(.weave-drawer-handle[data-weave-drawer-side="top"]),
:where(.weave-drawer-handle[data-weave-drawer-side="bottom"]) {
  --weave-component-width: var(--weave-drawer-handle-length);
  --weave-component-height: var(--weave-drawer-handle-thickness);
}

:where(.weave-drawer-handle[data-weave-drawer-handle-active="false"]) {
  --weave-component-display: none;
}

:where(.weave-drawer-handle[data-weave-drawer-handle-dragging="true"]) {
  --weave-component-cursor: grabbing;
}
`

export function ensureDrawerStylesheet(): void {
  ensureStaticStylesheet('drawer', stylesheet)
}
