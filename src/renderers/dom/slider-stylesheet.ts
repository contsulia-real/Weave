import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-slider-field) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: inherit;
}

:where(.weave-slider__label) {
  cursor: text;
}

:where(.weave-slider-control) {
  --weave-slider-thumb-half-size: calc(var(--weave-slider-thumb-size) / 2);
  --weave-slider-thumb-track-clearance:
    calc(var(--weave-slider-thumb-half-size) + var(--weave-slider-thumb-track-gap));
  --weave-slider-tick-size: calc(var(--weave-slider-track-height) / 4);

  display: inline-grid;
  position: relative;
  align-items: center;
  cursor: var(--weave-slider-cursor);
  vertical-align: middle;
}

:where(.weave-slider-control[data-weave-slider-disabled="true"]) {
  cursor: not-allowed;
  opacity: var(--weave-slider-disabled-opacity);
}

:where(.weave-slider__visual),
:where(.weave-slider) {
  grid-area: 1 / 1;
}

:where(.weave-slider__visual) {
  position: relative;
  width: 100%;
  height: var(--weave-slider-thumb-size);
  pointer-events: none;
}

:where(.weave-slider__range) {
  position: absolute;
  top: 0;
  right: var(--weave-slider-thumb-half-size);
  bottom: 0;
  left: var(--weave-slider-thumb-half-size);
}

:where(.weave-slider__active-track),
:where(.weave-slider__inactive-track) {
  position: absolute;
  top: 50%;
  height: var(--weave-slider-track-height);
  transform: translateY(-50%);
}

:where(.weave-slider__active-track) {
  z-index: 1;
  left: 0;
  width: max(
    0px,
    calc(var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance))
  );
  border-radius:
    var(--weave-radius-full)
    0
    0
    var(--weave-radius-full);
  background: var(--weave-slider-fill-color);
  box-shadow:
    var(--weave-slider-thumb-shadow),
    0 0.125rem 0 color-mix(in srgb, var(--weave-slider-fill-color) 72%, black);
  transition:
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-slider__inactive-track) {
  left: min(
    100%,
    calc(var(--weave-slider-progress) + var(--weave-slider-thumb-track-clearance))
  );
  right: 0;
  border-radius:
    0
    var(--weave-radius-full)
    var(--weave-radius-full)
    0;
  background: var(--weave-slider-track-color);
  box-shadow: var(--weave-slider-track-shadow);
  transition:
    left var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-slider__steps) {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

:where(.weave-slider__dot) {
  width: var(--weave-slider-tick-size);
  height: var(--weave-slider-tick-size);
  border-radius: var(--weave-radius-full);
}

:where(.weave-slider__step) {
  position: absolute;
  top: 50%;
  left: var(--weave-slider-step-position);
  background: var(--weave-slider-fill-color);
  transform: translate(-50%, -50%);
}

:where(.weave-slider__step[data-weave-slider-step-active="true"]),
:where(.weave-slider__thumb-dot) {
  background: var(--weave-slider-active-dot-color);
}

:where(.weave-slider__thumb) {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: var(--weave-slider-progress);
  width: var(--weave-slider-thumb-size);
  height: var(--weave-slider-thumb-size);
  border: var(--weave-slider-thumb-border-width) solid var(--weave-slider-thumb-border-color);
  border-radius: var(--weave-radius-full);
  background: var(--weave-slider-thumb-background);
  box-shadow: var(--weave-slider-thumb-shadow);
  transform: translate(-50%, -50%);
  will-change: left, width, height;
  transition:
    left var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-slider__thumb-dot) {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

:where(.weave-slider-control:hover:not([data-weave-slider-disabled="true"]))
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb) {
  box-shadow: var(--weave-slider-thumb-hover-shadow);
}

:where(.weave-slider-control[data-weave-slider-pointer-active="true"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb) {
  box-shadow: var(--weave-slider-thumb-press-shadow);
  transition:
    left var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(
    .weave-slider-control[data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb),
:where(
    .weave-slider-control[data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__active-track),
:where(
    .weave-slider-control[data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__inactive-track) {
  transition: none;
}

:where(.weave-slider-control[data-weave-slider-dragging="true"]),
:where(.weave-slider-control[data-weave-slider-dragging="true"]) > :where(.weave-slider) {
  cursor: grabbing;
}

:where(.weave-slider) {
  --weave-component-width: 16rem;
  --weave-component-height: var(--weave-slider-thumb-size);
  --weave-component-background: transparent;
  --weave-component-cursor: var(--weave-slider-cursor);
  --weave-component-outline-width: 0;
  --weave-component-border-top-left-radius: var(--weave-radius-full);
  --weave-component-border-top-right-radius: var(--weave-radius-full);
  --weave-component-border-bottom-right-radius: var(--weave-radius-full);
  --weave-component-border-bottom-left-radius: var(--weave-radius-full);

  position: relative;
  z-index: 4;
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
}

:where(.weave-slider:focus-visible) {
  --weave-component-outline-width: var(--weave-slider-focus-outline-width);
  --weave-component-outline-color: var(--weave-slider-focus-outline-color);
  --weave-component-outline-style: var(--weave-slider-focus-outline-style);
  --weave-component-outline-offset: var(--weave-slider-focus-outline-offset);
}

:where(.weave-slider:disabled) {
  --weave-component-opacity: 1;
  --weave-component-cursor: not-allowed;
}

.weave-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: var(--weave-slider-thumb-size);
  border: 0;
  background: transparent;
  box-shadow: none;
}

.weave-slider::-moz-range-track,
.weave-slider::-moz-range-progress {
  width: 100%;
  height: var(--weave-slider-thumb-size);
  border: 0;
  background: transparent;
  box-shadow: none;
}

.weave-slider::-webkit-slider-thumb {
  width: var(--weave-slider-thumb-size);
  height: var(--weave-slider-thumb-size);
  margin-top: 0;
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  background: transparent;
  box-shadow: none;
  opacity: 0;
  cursor: inherit;
}

.weave-slider::-moz-range-thumb {
  width: var(--weave-slider-thumb-size);
  height: var(--weave-slider-thumb-size);
  box-sizing: border-box;
  border: 0;
  background: transparent;
  box-shadow: none;
  opacity: 0;
  cursor: inherit;
}

:where(.weave-slider-control[data-weave-reduced-motion="reduce"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb),
:where(.weave-slider-control[data-weave-reduced-motion="reduce"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__active-track),
:where(.weave-slider-control[data-weave-reduced-motion="reduce"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__inactive-track) {
  transition: none;
}
`

export function ensureSliderStylesheet(): void {
  ensureStaticStylesheet('slider', stylesheet)
}
