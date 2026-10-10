import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-table) {
  --weave-component-background: var(--weave-table-background);
  --weave-component-border-top-width: var(--weave-table-border-width);
  --weave-component-border-right-width: var(--weave-table-border-width);
  --weave-component-border-bottom-width: var(--weave-table-border-width);
  --weave-component-border-left-width: var(--weave-table-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-table-border-color);
  --weave-component-border-right-color: var(--weave-table-border-color);
  --weave-component-border-bottom-color: var(--weave-table-border-color);
  --weave-component-border-left-color: var(--weave-table-border-color);
  --weave-component-border-top-left-radius: var(--weave-table-radius);
  --weave-component-border-top-right-radius: var(--weave-table-radius);
  --weave-component-border-bottom-right-radius: var(--weave-table-radius);
  --weave-component-border-bottom-left-radius: var(--weave-table-radius);
  --weave-component-box-shadow:
    0 var(--weave-table-rest-depth) 0 var(--weave-table-depth-color);
}

:where(.weave-table[data-weave-depth-compensation="true"]) {
  --weave-component-margin-bottom: var(--weave-table-rest-depth);
}

:where(.weave-table__table) {
  width: max-content;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--weave-table-color);
}

:where(.weave-table__head) {
  --weave-component-display: table-header-group;
  background: var(--weave-table-header-background);
}

:where(.weave-table__body) {
  --weave-component-display: table-row-group;
}

:where(.weave-table__row) {
  --weave-component-display: table-row;
}

:where(.weave-table__head) :where(.weave-table__head-cell) {
  color: var(--weave-table-header-color);
  font-size: var(--weave-table-header-font-size);
  font-weight: var(--weave-table-header-font-weight);
  line-height: var(--weave-table-header-line-height);
  letter-spacing: var(--weave-table-header-letter-spacing);
}

:where(.weave-table__cell) {
  color: var(--weave-table-color);
  font-size: var(--weave-table-cell-font-size);
  font-weight: var(--weave-table-cell-font-weight);
  line-height: var(--weave-table-cell-line-height);
  letter-spacing: var(--weave-table-cell-letter-spacing);
}

:where(.weave-table__head-cell),
:where(.weave-table__cell) {
  --weave-component-display: table-cell;
  padding:
    var(--weave-table-normal-padding-y)
    var(--weave-table-normal-padding-x);
  background-clip: padding-box;
  vertical-align: middle;
}

:where(.weave-table--dense) :where(.weave-table__head-cell),
:where(.weave-table--dense) :where(.weave-table__cell) {
  padding:
    var(--weave-table-dense-padding-y)
    var(--weave-table-dense-padding-x);
}

:where(.weave-table__row) > :where(.weave-table__head-cell),
:where(.weave-table__row) > :where(.weave-table__cell) {
  border-bottom:
    var(--weave-table-divider-width)
    solid
    var(--weave-table-divider-color);
}

:where(.weave-table__body) :where(.weave-table__row:last-child)
  > :where(.weave-table__cell) {
  border-bottom: 0;
}

:where(.weave-table--vertical-borders)
  :where(.weave-table__row)
  > :where(.weave-table__head-cell, .weave-table__cell)
  + :where(.weave-table__head-cell, .weave-table__cell) {
  border-left:
    var(--weave-table-divider-width)
    solid
    var(--weave-table-divider-color);
}

:where(.weave-table__body) :where(.weave-table__row:hover)
  > :where(.weave-table__cell) {
  background: var(--weave-table-row-hover-background);
}

:where(.weave-table__body)
  :where(.weave-table__cell[data-weave-table-cell-selected="true"]) {
  background: var(--weave-table-cell-selected-background);
}

:where(.weave-table__body)
  :where(.weave-table__row[data-weave-table-row-selected="true"])
  > :where(.weave-table__cell) {
  background: var(--weave-table-row-selected-background);
}

:where(.weave-table--selectable)
  :where(.weave-table__body)
  :where(.weave-table__cell:not(.weave-table__selection-cell)) {
  cursor: pointer;
}

:where(.weave-table__selection-cell) {
  width: 1%;
  white-space: nowrap;
}

:where(.weave-table--sticky-header)
  :where(.weave-table__head-cell) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--weave-table-header-background);
}

/* A sticky table has one horizontal viewport and an independent tbody vertical viewport.
   Subgrid keeps every header/body cell on the same column tracks. */
.weave-table.weave-table--sticky-header[data-weave-table-grid-ready="true"] {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] > .weave-table__table {
  display: grid;
  flex: 1 1 auto;
  min-height: 0;
  grid-template-columns:
    var(--weave-table-track-template, var(--weave-table-initial-track-template, 1fr));
  grid-template-rows: auto minmax(0, 1fr);
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__table > colgroup {
  display: none;
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__head,
.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__body,
.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__row {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__head {
  grid-row: 1;
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__body {
  grid-row: 2;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 0;
  align-content: start;
  overflow-anchor: none;
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__head-cell,
.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__cell {
  display: block;
  box-sizing: border-box;
  min-width: 100%;
  max-width: 100%;
  position: relative;
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__head-cell {
  position: relative;
}

.weave-table--sticky-header[data-weave-table-grid-ready="true"] .weave-table__cell[colspan] {
  grid-column: 1 / -1;
}

`

export function ensureTableStylesheet(): void {
  ensureStaticStylesheet('table', stylesheet)
}
