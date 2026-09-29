import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
@property --weave-image-fit {
  syntax: "*";
  inherits: false;
}

@property --weave-image-position {
  syntax: "*";
  inherits: false;
}

:where([data-weave-image]) {
  object-fit: var(--weave-image-fit, fill);
  object-position: var(--weave-image-position, 50% 50%);
  overflow: var(
    --weave-container-responsive-overflow,
    var(
      --weave-viewport-responsive-overflow,
      var(--weave-overflow, clip)
    )
  );
}
`

export function ensureImageStylesheet(): void {
  ensureStaticStylesheet('image', stylesheet)
}
