import { ensureInputStylesheet } from './input-stylesheet'
import { ensureOptionListboxStylesheet } from './option-listbox-stylesheet'
import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-select) {
  --weave-component-display: inline-flex;
  --weave-component-align-items: center;
  --weave-component-justify-content: space-between;
  --weave-component-gap: var(--weave-select-gap);
  --weave-component-cursor: pointer;
  --weave-component-user-select: none;
  text-align: start;
}

:where(.weave-select__value) {
  --weave-component-display: flex;
  --weave-component-align-items: center;
  --weave-component-gap: var(--weave-select-gap);
  --weave-component-flex-grow: 1;
  --weave-component-min-width: 0rem;
}

:where(.weave-select__placeholder) {
  color: var(--weave-input-placeholder-color);
}

:where(.weave-select__value-icon),
:where(.weave-select__chevron) {
  --weave-component-width: var(--weave-select-icon-size);
  --weave-component-height: var(--weave-select-icon-size);
  --weave-component-flex-shrink: 0;
}

:where(.weave-select__chevron) {
  transition:
    transform
    var(--weave-motion-duration-fast)
    var(--weave-motion-curve-standard);
}

:where(.weave-select[data-weave-select-open="true"] .weave-select__chevron) {
  transform: rotate(180deg);
}
`

export function ensureSelectStylesheet(): void {
  ensureInputStylesheet()
  ensureOptionListboxStylesheet()
  ensureStaticStylesheet(
    'select',
    stylesheet,
  )
}
