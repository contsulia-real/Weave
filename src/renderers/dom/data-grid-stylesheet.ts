import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
.weave-data-grid[data-weave-data-grid-tracks="fixed"] > :where(.weave-table__table) {
  width: max(100%, var(--weave-data-grid-table-width));
  min-width: max(100%, var(--weave-data-grid-table-width));
  table-layout: fixed;
}

:where(.weave-data-grid__head-cell) {
  position: relative;
}

.weave-data-grid.weave-table--sticky-header :where(.weave-data-grid__head-cell) {
  position: sticky;
}

:where(.weave-data-grid__head-cell[data-weave-data-grid-sortable="true"]) {
  cursor: pointer;
  user-select: none;
}

.weave-data-grid[data-weave-data-grid]
  :where(
    .weave-data-grid__head-cell[data-weave-data-grid-sortable="true"]:hover,
    .weave-data-grid__head-cell[data-weave-data-grid-sortable="true"]:focus-visible
  ) {
  background: var(--weave-table-row-hover-background);
}

:where(.weave-data-grid__sort-icon) {
  flex: 0 0 auto;
}

:where(.weave-data-grid__resize-handle) {
  position: absolute;
  inset-block: 0;
  inset-inline-end: -8px;
  width: 16px;
  cursor: col-resize;
  touch-action: none;
  z-index: 2;
}

:where(.weave-data-grid__head-cell[data-weave-data-grid-last-column="true"])
  > :where(.weave-data-grid__resize-handle) {
  inset-inline-end: 0;
}

:where(.weave-data-grid__spacer-row) {
  background: transparent !important;
}

:where(.weave-data-grid__spacer-cell) {
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  visibility: hidden;
  line-height: 0;
  pointer-events: none;
}
`

export function ensureDataGridStylesheet(): void {
  ensureStaticStylesheet('data-grid', stylesheet)
}
