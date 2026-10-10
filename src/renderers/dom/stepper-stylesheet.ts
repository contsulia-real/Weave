import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where([data-weave-stepper]) :where(.weave-progress__value) {
  transition-delay: var(--weave-stepper-segment-delay, 0ms);
}
`

export function ensureStepperStylesheet(): void {
  ensureStaticStylesheet('stepper', stylesheet)
}
