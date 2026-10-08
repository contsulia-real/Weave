import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-scroll-host),
:where([data-weave-global-scroll-host]) {
  scrollbar-width: none;
}

:where(.weave-scroll-host)::-webkit-scrollbar,
:where([data-weave-global-scroll-host])::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

:where(.weave-scrollbar) {
  --weave-component-pointer-events: auto;
  --weave-component-display: none;
  --weave-component-position: fixed;
  --weave-component-z-index: 0;
  --weave-component-background: transparent;
  --weave-component-border-top-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-top-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-opacity: var(--weave-scrollbar-opacity);
  --weave-component-user-select: none;

  touch-action: none;
}

:where(.weave-scrollbar[data-weave-scrollbar-visible="true"]) {
  --weave-component-display: block;
}

:where(.weave-scrollbar--vertical) {
  --weave-component-width: var(--weave-scrollbar-hit-size);
  --weave-component-transform: translateX(-100%);
}

:where(.weave-scrollbar--horizontal) {
  --weave-component-height: var(--weave-scrollbar-hit-size);
  --weave-component-transform: translateY(-100%);
}

:where(.weave-scrollbar--vertical.weave-scrollbar--outside),
:where(.weave-scrollbar--horizontal.weave-scrollbar--outside) {
  --weave-component-transform: none;
}

:where(.weave-scrollbar__thumb) {
  --weave-component-position: absolute;
  --weave-component-background: var(--weave-scrollbar-color);
  --weave-component-border-top-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-top-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-right-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-border-bottom-left-radius: var(
    --weave-scrollbar-radius
  );
  --weave-component-cursor: var(--weave-scrollbar-thumb-cursor);
  --weave-component-user-select: none;

  will-change: transform, scale;
  scale: 1;
  transform-origin: center;
  transition:
    scale var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    background-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-scrollbar--vertical) > :where(.weave-scrollbar__thumb) {
  --weave-component-width: var(--weave-scrollbar-thickness);
  --weave-component-right: var(--weave-scrollbar-edge-inset, 4px);
}

:where(.weave-scrollbar--vertical.weave-scrollbar--outside)
  > :where(.weave-scrollbar__thumb) {
  --weave-component-right: auto;
  --weave-component-left: var(--weave-scrollbar-edge-inset, 4px);
}

:where(.weave-scrollbar--vertical:hover)
  > :where(.weave-scrollbar__thumb) {
  --weave-component-background: var(--weave-scrollbar-hover-color);
  scale: var(--weave-scrollbar-hover-scale) 1;
}

:where(.weave-scrollbar--vertical[data-weave-scrollbar-dragging="true"])
  > :where(.weave-scrollbar__thumb) {
  --weave-component-background: var(--weave-scrollbar-drag-color);
  scale: var(--weave-feedback-drag-scale) 1;
}

:where(.weave-scrollbar--horizontal) > :where(.weave-scrollbar__thumb) {
  --weave-component-height: var(--weave-scrollbar-thickness);
  --weave-component-bottom: var(--weave-scrollbar-edge-inset, 4px);
}

:where(.weave-scrollbar--horizontal.weave-scrollbar--outside)
  > :where(.weave-scrollbar__thumb) {
  --weave-component-bottom: auto;
  --weave-component-top: var(--weave-scrollbar-edge-inset, 4px);
}

:where(.weave-scrollbar--horizontal:hover)
  > :where(.weave-scrollbar__thumb) {
  --weave-component-background: var(--weave-scrollbar-hover-color);
  scale: 1 var(--weave-scrollbar-hover-scale);
}

:where(.weave-scrollbar--horizontal[data-weave-scrollbar-dragging="true"])
  > :where(.weave-scrollbar__thumb) {
  --weave-component-background: var(--weave-scrollbar-drag-color);
  scale: 1 var(--weave-feedback-drag-scale);
}

:where(.weave-scrollbar[data-weave-reduced-motion="reduce"])
  > :where(.weave-scrollbar__thumb) {
  transition:
    background-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-scrollbar[data-weave-reduced-motion="reduce"].weave-scrollbar--vertical:hover)
  > :where(.weave-scrollbar__thumb),
:where(.weave-scrollbar[data-weave-reduced-motion="reduce"].weave-scrollbar--vertical[data-weave-scrollbar-dragging="true"])
  > :where(.weave-scrollbar__thumb),
:where(.weave-scrollbar[data-weave-reduced-motion="reduce"].weave-scrollbar--horizontal:hover)
  > :where(.weave-scrollbar__thumb),
:where(.weave-scrollbar[data-weave-reduced-motion="reduce"].weave-scrollbar--horizontal[data-weave-scrollbar-dragging="true"])
  > :where(.weave-scrollbar__thumb) {
  scale: 1;
}
`

export function ensureScrollbarStylesheet(): void {
  ensureStaticStylesheet('scrollbar', stylesheet)
}
