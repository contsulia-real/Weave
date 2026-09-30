import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-form) {
  display: grid;
  gap: var(--weave-form-gap);
  min-width: 0;
  background: transparent;
}

:where(.weave-form-field) {
  display: grid;
  gap: var(--weave-form-field-gap);
  min-width: 0;
}

:where(.weave-form-label) {
  color: var(--weave-form-label-color);
  font-size: var(--weave-form-label-font-size);
  font-weight: var(--weave-form-label-font-weight);
  line-height: var(--weave-form-label-line-height);
  letter-spacing: var(--weave-form-label-letter-spacing);
}

:where(.weave-form-required) {
  color: var(--weave-form-error-color);
}

:where(.weave-form-description) {
  color: var(--weave-form-description-color);
  font-size: var(--weave-form-description-font-size);
  font-weight: var(--weave-form-description-font-weight);
  line-height: var(--weave-form-description-line-height);
  letter-spacing: var(--weave-form-description-letter-spacing);
}

:where(.weave-form-error) {
  color: var(--weave-form-error-color);
  font-size: var(--weave-form-error-font-size);
  font-weight: var(--weave-form-error-font-weight);
  line-height: var(--weave-form-error-line-height);
  letter-spacing: var(--weave-form-error-letter-spacing);
}

:where(.weave-form-fieldset) {
  display: grid;
  gap: var(--weave-form-fieldset-gap);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

:where(.weave-form-legend) {
  padding: 0;
  color: var(--weave-form-legend-color);
  font-size: var(--weave-form-legend-font-size);
  font-weight: var(--weave-form-legend-font-weight);
  line-height: var(--weave-form-legend-line-height);
  letter-spacing: var(--weave-form-legend-letter-spacing);
}
`

export function ensureFormStylesheet(): void {
  ensureStaticStylesheet('form', stylesheet)
}
