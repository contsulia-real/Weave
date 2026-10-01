import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-splitbox) {
  display: grid;
  min-width: 0;
  min-height: 0;
}

:where(.weave-splitbox[data-weave-splitbox-direction="horizontal"]) {
  grid-template-columns:
    clamp(
      max(
        var(--weave-splitbox-min-start),
        calc(100% - var(--weave-splitbox-thickness) - var(--weave-splitbox-max-end))
      ),
      var(--weave-splitbox-size),
      min(
        var(--weave-splitbox-max-start),
        calc(100% - var(--weave-splitbox-thickness) - var(--weave-splitbox-min-end))
      )
    )
    var(--weave-splitbox-thickness)
    minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
}

:where(.weave-splitbox[data-weave-splitbox-direction="vertical"]) {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows:
    clamp(
      max(
        var(--weave-splitbox-min-start),
        calc(100% - var(--weave-splitbox-thickness) - var(--weave-splitbox-max-end))
      ),
      var(--weave-splitbox-size),
      min(
        var(--weave-splitbox-max-start),
        calc(100% - var(--weave-splitbox-thickness) - var(--weave-splitbox-min-end))
      )
    )
    var(--weave-splitbox-thickness)
    minmax(0, 1fr);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"][data-weave-splitbox-dragging="true"]
) {
  grid-template-columns:
    minmax(0, var(--weave-splitbox-drag-size))
    var(--weave-splitbox-thickness)
    minmax(0, 1fr);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"][data-weave-splitbox-dragging="true"]
) {
  grid-template-rows:
    minmax(0, var(--weave-splitbox-drag-size))
    var(--weave-splitbox-thickness)
    minmax(0, 1fr);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"][data-weave-splitbox-collapsed="start"]
) {
  grid-template-columns: 0 var(--weave-splitbox-thickness) minmax(0, 1fr);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"][data-weave-splitbox-collapsed="start"]
) {
  grid-template-rows: 0 var(--weave-splitbox-thickness) minmax(0, 1fr);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"][data-weave-splitbox-collapsed="end"]
) {
  grid-template-columns: minmax(0, 1fr) var(--weave-splitbox-thickness) 0;
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"][data-weave-splitbox-collapsed="end"]
) {
  grid-template-rows: minmax(0, 1fr) var(--weave-splitbox-thickness) 0;
}

:where(.weave-splitbox-pane) {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"]
    > .weave-splitbox-pane[data-weave-splitbox-pane-position="start"]
) {
  grid-column: 1;
  grid-row: 1;
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"]
    > .weave-splitbox-pane[data-weave-splitbox-pane-position="end"]
) {
  grid-column: 3;
  grid-row: 1;
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"]
    > .weave-splitbox-pane[data-weave-splitbox-pane-position="start"]
) {
  grid-column: 1;
  grid-row: 1;
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"]
    > .weave-splitbox-pane[data-weave-splitbox-pane-position="end"]
) {
  grid-column: 1;
  grid-row: 3;
}

:where(.weave-splitbox-pane[data-weave-splitbox-pane-collapsed="true"]) {
  overflow: hidden;
}

:where(.weave-splitbox-splitter) {
  position: relative;
  z-index: 1;
  align-self: stretch;
  justify-self: stretch;
  touch-action: none;
  outline: none;
}

:where(.weave-splitbox[data-weave-splitbox-direction="horizontal"] > .weave-splitbox-splitter) {
  grid-column: 2;
  grid-row: 1;
  width: var(--weave-splitbox-hit-size);
  justify-self: center;
  cursor: col-resize;
}

:where(.weave-splitbox[data-weave-splitbox-direction="vertical"] > .weave-splitbox-splitter) {
  grid-column: 1;
  grid-row: 2;
  height: var(--weave-splitbox-hit-size);
  align-self: center;
  cursor: row-resize;
}

:where(.weave-splitbox-splitter)::before {
  content: '';
  position: absolute;
  background: var(--weave-splitbox-color);
  transition:
    background-color var(--weave-motion-duration-fast) var(--weave-motion-curve-standard),
    width var(--weave-motion-duration-fast) var(--weave-motion-curve-standard),
    height var(--weave-motion-duration-fast) var(--weave-motion-curve-standard);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"] > .weave-splitbox-splitter
)::before {
  inset-block: 0;
  left: 50%;
  width: var(--weave-splitbox-thickness);
  transform: translateX(-50%);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"] > .weave-splitbox-splitter
)::before {
  inset-inline: 0;
  top: 50%;
  height: var(--weave-splitbox-thickness);
  transform: translateY(-50%);
}

:where(.weave-splitbox-splitter:hover)::before {
  background: var(--weave-splitbox-hover-color);
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"]
    > .weave-splitbox-splitter:hover
)::before,
:where(
  .weave-splitbox[data-weave-splitbox-direction="horizontal"]
    > .weave-splitbox-splitter[data-weave-splitbox-splitter-active="true"]
)::before {
  width: max(var(--weave-splitbox-thickness), var(--weave-splitbox-theme-thickness));
}

:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"]
    > .weave-splitbox-splitter:hover
)::before,
:where(
  .weave-splitbox[data-weave-splitbox-direction="vertical"]
    > .weave-splitbox-splitter[data-weave-splitbox-splitter-active="true"]
)::before {
  height: max(var(--weave-splitbox-thickness), var(--weave-splitbox-theme-thickness));
}

:where(.weave-splitbox-splitter[data-weave-splitbox-splitter-active="true"])::before {
  background: var(--weave-splitbox-active-color);
}

:where(.weave-splitbox-splitter:focus-visible) {
  outline-width: var(--weave-splitbox-focus-outline-width);
  outline-color: var(--weave-splitbox-focus-outline-color);
  outline-style: var(--weave-splitbox-focus-outline-style);
  outline-offset: var(--weave-splitbox-focus-outline-offset);
}

:where(.weave-splitbox-splitter[data-weave-reduced-motion="reduce"])::before {
  transition: none;
}
`

export function ensureSplitBoxStylesheet(): void {
  ensureStaticStylesheet('splitbox', stylesheet)
}
