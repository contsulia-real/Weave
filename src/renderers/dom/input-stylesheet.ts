import { ensureFieldControlStylesheet } from './field-control-stylesheet'
import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-input) {
  --weave-component-display: block;
}

:where(.weave-input--multiline) {
  --weave-component-padding-top:
    var(--weave-input-theme-padding-y);
  --weave-component-padding-bottom:
    var(--weave-input-theme-padding-y);
}

:where([data-weave-input-multiline]) {
  resize: none;
}
`

export function ensureInputStylesheet(): void {
  ensureFieldControlStylesheet()
  ensureStaticStylesheet(
    'input',
    stylesheet,
  )
}
