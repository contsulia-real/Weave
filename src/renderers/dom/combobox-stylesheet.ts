import { ensureOptionListboxStylesheet } from './option-listbox-stylesheet'
import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-combobox-root) {
  position: relative;
  display: inline-block;
  min-width: 0;
}

:where(.weave-combobox) {
  --weave-component-padding-right:
    calc(
      var(--weave-combobox-action-inset) +
      var(--weave-combobox-icon-size) +
      var(--weave-combobox-action-gap)
    );
}

:where(
  .weave-combobox-root[
    data-weave-combobox-has-clear="true"
  ] .weave-combobox
) {
  --weave-component-padding-right:
    calc(
      var(--weave-combobox-action-inset) +
      var(--weave-combobox-action-size) +
      var(--weave-combobox-icon-size) +
      var(--weave-combobox-action-gap) * 2
    );
}

:where(.weave-combobox__actions) {
  position: absolute;
  top: 50%;
  right: var(--weave-combobox-action-inset);
  translate: 0 -50%;
  display: inline-flex;
  align-items: center;
  gap: var(--weave-combobox-action-gap);
  pointer-events: none;
}

:where(.weave-combobox__action) {
  width: var(--weave-combobox-action-size);
  height: var(--weave-combobox-action-size);
  pointer-events: auto;
}

:where(.weave-combobox__chevron) {
  width: var(--weave-combobox-icon-size);
  height: var(--weave-combobox-icon-size);
  pointer-events: none;
  transition:
    transform
    var(--weave-motion-duration-fast)
    var(--weave-motion-curve-standard);
}

:where(
  .weave-combobox-root[
    data-weave-combobox-open="true"
  ] .weave-combobox__chevron
) {
  transform: rotate(180deg);
}

:where(.weave-combobox-empty) {
  --weave-component-padding-top: 0.625rem;
  --weave-component-padding-right: 0.75rem;
  --weave-component-padding-bottom: 0.625rem;
  --weave-component-padding-left: 0.75rem;
  --weave-component-color: var(--weave-option-secondary-color);
}
`

export function ensureComboboxStylesheet(): void {
  ensureOptionListboxStylesheet()
  ensureStaticStylesheet('combobox', stylesheet)
}
