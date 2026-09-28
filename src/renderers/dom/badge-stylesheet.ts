import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-badge-anchor) {
  display: inline-flex;
  position: relative;
  width: fit-content;
  vertical-align: middle;
}

:where(.weave-badge) {
  position: absolute;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: var(--weave-badge-theme-min-height);
  height: var(--weave-badge-theme-min-height);
  padding-inline: var(--weave-badge-theme-padding-x);
  border: var(--weave-badge-theme-border-width) solid
    var(--weave-badge-theme-border-color);
  border-radius: var(--weave-badge-theme-radius);
  background: var(--weave-badge-theme-background);
  color: var(--weave-badge-theme-color);
  box-shadow: var(--weave-badge-theme-shadow);
  font-size: var(--weave-badge-theme-font-size);
  font-weight: var(--weave-badge-theme-font-weight);
  line-height: var(--weave-badge-theme-line-height);
  letter-spacing: var(--weave-badge-theme-letter-spacing);
  white-space: nowrap;
  pointer-events: none;
  --weave-badge-motion-distance: 0.5rem;
  --weave-badge-motion-diagonal: 0.35rem;
  --weave-badge-motion-x: 0px;
  --weave-badge-motion-y: 0px;
  opacity: 1;
  scale: 1;
  translate: 0 0;
  transform-origin: center;
  will-change: opacity, scale, translate;
}

:where(.weave-badge[data-weave-badge-state="open"]) {
  animation:
    weave-badge-pop
    var(--weave-motion-duration-normal)
    var(--weave-motion-curve-emphasized)
    both;
}

:where(.weave-badge[data-weave-badge-state="closing"]) {
  animation:
    weave-badge-dismiss
    var(--weave-motion-duration-fast)
    var(--weave-motion-curve-exit)
    both;
}

:where(.weave-badge[data-weave-reduced-motion="reduce"]) {
  animation: none;
}

@keyframes weave-badge-pop {
  0% {
    opacity: 0;
    scale: 0.65;
    translate:
      var(--weave-badge-motion-x)
      var(--weave-badge-motion-y);
  }

  72% {
    opacity: 1;
    scale: 1.08;
  }

  100% {
    opacity: 1;
    scale: 1;
    translate: 0 0;
  }
}

@keyframes weave-badge-dismiss {
  from {
    opacity: 1;
    scale: 1;
    translate: 0 0;
  }

  to {
    opacity: 0;
    scale: 0.72;
    translate:
      var(--weave-badge-motion-x)
      var(--weave-badge-motion-y);
  }
}

:where(.weave-badge--dot) {
  width: var(--weave-badge-theme-dot-size);
  min-width: var(--weave-badge-theme-dot-size);
  height: var(--weave-badge-theme-dot-size);
  padding: 0;
}

:where(.weave-badge-anchor[data-weave-badge-placement="top-left"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-top, 0px);
  left: var(--weave-badge-target-left, 0px);
  --weave-badge-motion-x: var(--weave-badge-motion-diagonal);
  --weave-badge-motion-y: var(--weave-badge-motion-diagonal);
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="top"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-top, 0px);
  left: var(--weave-badge-target-center-x, 50%);
  --weave-badge-motion-y: var(--weave-badge-motion-distance);
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="top-right"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-top, 0px);
  left: var(--weave-badge-target-right, 100%);
  --weave-badge-motion-x:
    calc(-1 * var(--weave-badge-motion-diagonal));
  --weave-badge-motion-y: var(--weave-badge-motion-diagonal);
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="right"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-center-y, 50%);
  left: var(--weave-badge-target-right, 100%);
  --weave-badge-motion-x:
    calc(-1 * var(--weave-badge-motion-distance));
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="bottom-right"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-bottom, 100%);
  left: var(--weave-badge-target-right, 100%);
  --weave-badge-motion-x:
    calc(-1 * var(--weave-badge-motion-diagonal));
  --weave-badge-motion-y:
    calc(-1 * var(--weave-badge-motion-diagonal));
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="bottom"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-bottom, 100%);
  left: var(--weave-badge-target-center-x, 50%);
  --weave-badge-motion-y:
    calc(-1 * var(--weave-badge-motion-distance));
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="bottom-left"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-bottom, 100%);
  left: var(--weave-badge-target-left, 0px);
  --weave-badge-motion-x: var(--weave-badge-motion-diagonal);
  --weave-badge-motion-y:
    calc(-1 * var(--weave-badge-motion-diagonal));
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="left"])
  > :where(.weave-badge) {
  top: var(--weave-badge-target-center-y, 50%);
  left: var(--weave-badge-target-left, 0px);
  --weave-badge-motion-x: var(--weave-badge-motion-distance);
  transform: translate(-50%, -50%);
}
`

export function ensureBadgeStylesheet(): void {
  ensureStaticStylesheet('badge', stylesheet)
}
