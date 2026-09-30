import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-skeleton) {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  --weave-component-background: var(--weave-skeleton-background);
  --weave-component-border-top-left-radius: var(--weave-skeleton-radius);
  --weave-component-border-top-right-radius: var(--weave-skeleton-radius);
  --weave-component-border-bottom-right-radius: var(--weave-skeleton-radius);
  --weave-component-border-bottom-left-radius: var(--weave-skeleton-radius);
}

:where(.weave-skeleton)::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--weave-skeleton-highlight) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: weave-skeleton-shimmer var(--weave-skeleton-shimmer-duration) linear infinite;
}

:where(.weave-skeleton[data-weave-skeleton-shape="circle"]) {
  aspect-ratio: 1 / 1;
  --weave-component-border-top-left-radius: var(--weave-radius-full);
  --weave-component-border-top-right-radius: var(--weave-radius-full);
  --weave-component-border-bottom-right-radius: var(--weave-radius-full);
  --weave-component-border-bottom-left-radius: var(--weave-radius-full);
}

:where(.weave-skeleton[data-weave-skeleton-shape="text"]) {
  --weave-component-width: 100%;
  --weave-component-height: 1lh;
  --weave-component-border-top-left-radius: var(--weave-skeleton-text-radius);
  --weave-component-border-top-right-radius: var(--weave-skeleton-text-radius);
  --weave-component-border-bottom-right-radius: var(--weave-skeleton-text-radius);
  --weave-component-border-bottom-left-radius: var(--weave-skeleton-text-radius);
}

:where(.weave-skeleton[data-weave-reduced-motion="reduce"])::after {
  animation: none;
  opacity: 0;
}

@keyframes weave-skeleton-shimmer {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}
`

export function ensureSkeletonStylesheet(): void {
  ensureStaticStylesheet('skeleton', stylesheet)
}
