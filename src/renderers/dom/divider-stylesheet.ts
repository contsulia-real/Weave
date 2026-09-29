import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-divider) {
  --weave-divider-gap: 0rem;
  --weave-divider-thickness: 1px;
  --weave-divider-color: var(--weave-color-outline);

  --weave-component-position: relative;
  --weave-component-flex-shrink: 0;
  overflow: visible;
}

:where(.weave-divider)::before {
  content: '';
  position: absolute;
  background: var(--weave-divider-color);
  pointer-events: none;
}

:where(
  .weave-divider[
    data-weave-divider-direction="horizontal"
  ]
) {
  --weave-component-width: 100%;
  --weave-component-height:
    calc(var(--weave-divider-gap) * 2);
}

:where(
  .weave-divider[
    data-weave-divider-direction="horizontal"
  ]
)::before {
  top: 50%;
  left: 0;
  right: 0;
  height: var(--weave-divider-thickness);
  transform: translateY(-50%);
}

:where(
  .weave-divider[
    data-weave-divider-direction="vertical"
  ]
) {
  --weave-component-width:
    calc(var(--weave-divider-gap) * 2);
  --weave-component-align-self: stretch;
}

:where(
  .weave-divider[
    data-weave-divider-direction="vertical"
  ]
)::before {
  top: 0;
  bottom: 0;
  left: 50%;
  width: var(--weave-divider-thickness);
  transform: translateX(-50%);
}
`

export function ensureDividerStylesheet(): void {
  ensureStaticStylesheet('divider', stylesheet)
}
