import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-slider-field) {
  display: inline-flex;
  align-items: center;
  gap: var(--weave-slider-field-gap);
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
  --weave-slider-track-half-height: calc(var(--weave-slider-track-height) / 2);
  --weave-slider-active-outer-extension: 0px;
  --weave-slider-inactive-outer-extension: 0px;

  display: inline-grid;
  position: relative;
  align-items: center;
  justify-content: start;
  cursor: var(--weave-slider-cursor);
  vertical-align: middle;
}

:where(.weave-slider-control[data-weave-slider-disabled="true"]) {
  cursor: not-allowed;
  opacity: var(--weave-slider-disabled-opacity);
}

:where(.weave-slider-control[data-weave-slider-points="true"]) {
  --weave-slider-active-outer-extension: min(
    var(--weave-slider-track-half-height),
    max(
      0px,
      calc(var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance))
    )
  );
  --weave-slider-inactive-outer-extension: min(
    var(--weave-slider-track-half-height),
    max(
      0px,
      calc(
        100% - var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance)
      )
    )
  );
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

:where(.weave-slider__track) {
  position: absolute;
  top: 50%;
  height: var(--weave-slider-track-height);
  transform: translateY(-50%);
}

:where(.weave-slider__track--active) {
  background: var(--weave-slider-fill-color);
  box-shadow:
    var(--weave-slider-thumb-shadow),
    var(--weave-slider-active-track-shadow);
}

:where(.weave-slider__track--inactive) {
  background: var(--weave-slider-track-color);
  box-shadow: var(--weave-slider-track-shadow);
}

:where(.weave-slider__active-track) {
  z-index: 1;
  left: calc(-1 * var(--weave-slider-active-outer-extension));
  width: max(
    0px,
    calc(
      var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-slider-active-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    0
    0
    var(--weave-radius-full);
  transition:
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-slider__inactive-track) {
  left: min(
    100%,
    calc(var(--weave-slider-progress) + var(--weave-slider-thumb-track-clearance))
  );
  right: calc(-1 * var(--weave-slider-inactive-outer-extension));
  border-radius:
    0
    var(--weave-radius-full)
    var(--weave-radius-full)
    0;
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

:where(.weave-mark-slider__labels) {
  grid-area: 2 / 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin-top: var(--weave-slider-field-gap);
  margin-right: var(--weave-slider-thumb-half-size);
  margin-left: var(--weave-slider-thumb-half-size);
  pointer-events: none;
}

:where(.weave-mark-slider__label) {
  position: relative;
  left: var(--weave-mark-slider-label-position);
  grid-area: 1 / 1;
  justify-self: start;
  white-space: nowrap;
  transform: translateX(-50%);
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
  --weave-component-width: var(--weave-slider-width);
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

:where(.weave-range-slider-control) {
  --weave-range-slider-start-outer-extension: 0px;
  --weave-range-slider-end-outer-extension: 0px;
}

:where(.weave-range-slider-control[data-weave-slider-stepped="true"]) {
  --weave-range-slider-start-outer-extension: min(
    var(--weave-slider-track-half-height),
    max(
      0px,
      calc(
        var(--weave-range-slider-start-progress) -
          var(--weave-slider-thumb-track-clearance)
      )
    )
  );
  --weave-range-slider-end-outer-extension: min(
    var(--weave-slider-track-half-height),
    max(
      0px,
      calc(
        100% - var(--weave-range-slider-end-progress) -
          var(--weave-slider-thumb-track-clearance)
      )
    )
  );
}

:where(.weave-range-slider__inactive-track--start) {
  z-index: 1;
  left: calc(-1 * var(--weave-range-slider-start-outer-extension));
  width: max(
    0px,
    calc(
      var(--weave-range-slider-start-progress) -
        var(--weave-slider-thumb-track-clearance) +
        var(--weave-range-slider-start-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    0
    0
    var(--weave-radius-full);
  transition:
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-range-slider__active-track) {
  z-index: 1;
  left: min(
    100%,
    calc(
      var(--weave-range-slider-start-progress) +
        var(--weave-slider-thumb-track-clearance)
    )
  );
  width: max(
    0px,
    calc(
      var(--weave-range-slider-end-progress) -
        var(--weave-range-slider-start-progress) -
        var(--weave-slider-thumb-track-clearance) -
        var(--weave-slider-thumb-track-clearance)
    )
  );
  border-radius: 0;
  transition:
    left var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-range-slider__inactive-track--end) {
  z-index: 1;
  left: min(
    100%,
    calc(
      var(--weave-range-slider-end-progress) +
        var(--weave-slider-thumb-track-clearance)
    )
  );
  right: calc(-1 * var(--weave-range-slider-end-outer-extension));
  border-radius:
    0
    var(--weave-radius-full)
    var(--weave-radius-full)
    0;
  transition:
    left var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-range-slider__thumb--start) {
  left: var(--weave-range-slider-start-progress);
  z-index: 4;
}

:where(.weave-range-slider__thumb--end) {
  left: var(--weave-range-slider-end-progress);
  z-index: 3;
}

:where(.weave-range-slider__input--start) {
  z-index: 5;
  clip-path: inset(0 calc(100% - var(--weave-range-slider-hit-split)) 0 0);
}

:where(.weave-range-slider__input--end) {
  z-index: 4;
  clip-path: inset(0 0 0 var(--weave-range-slider-hit-split));
}

:where(.weave-range-slider-control:hover:not([data-weave-slider-disabled="true"]))
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb) {
  box-shadow: var(--weave-slider-thumb-shadow);
}

:where(
    .weave-range-slider-control:has(.weave-range-slider__input--start:hover):not(
        [data-weave-slider-disabled="true"]
      )
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start),
:where(
    .weave-range-slider-control:has(.weave-range-slider__input--end:hover):not(
        [data-weave-slider-disabled="true"]
      )
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end) {
  box-shadow: var(--weave-slider-thumb-hover-shadow);
}

:where(.weave-range-slider-control[data-weave-slider-pointer-active="start"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start),
:where(.weave-range-slider-control[data-weave-slider-pointer-active="end"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end) {
  box-shadow: var(--weave-slider-thumb-press-shadow);
  transition:
    left var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(
    .weave-range-slider-control[data-weave-slider-stepped="false"][data-weave-slider-dragging="start"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start),
:where(
    .weave-range-slider-control[data-weave-slider-stepped="false"][data-weave-slider-dragging="end"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end),
:where(
    .weave-range-slider-control[data-weave-slider-stepped="false"][data-weave-slider-dragging]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track),
:where(
    .weave-range-slider-control[data-weave-slider-stepped="false"][data-weave-slider-dragging]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__active-track) {
  transition: none;
}

:where(.weave-range-slider-control[data-weave-slider-dragging]),
:where(.weave-range-slider-control[data-weave-slider-dragging]) > :where(.weave-slider) {
  cursor: grabbing;
}

:where(.weave-range-slider__input:focus-visible) {
  --weave-component-outline-width: 0;
}

:where(.weave-range-slider-control:has(.weave-range-slider__input--start:focus-visible))
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start),
:where(.weave-range-slider-control:has(.weave-range-slider__input--end:focus-visible))
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end) {
  outline: var(--weave-slider-focus-outline-width)
    var(--weave-slider-focus-outline-style)
    var(--weave-slider-focus-outline-color);
  outline-offset: var(--weave-slider-focus-outline-offset);
}

:where(.weave-range-slider__a11y-label) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}


/* vertical slider axis */

:where(.weave-slider[data-weave-slider-direction="vertical"]) {
  --weave-component-width: var(--weave-slider-thumb-size);
  --weave-component-height: var(--weave-slider-width);
}

:where(.weave-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual) {
  width: 100%;
  height: 100%;
}

:where(.weave-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range) {
  top: var(--weave-slider-thumb-half-size);
  right: 0;
  bottom: var(--weave-slider-thumb-half-size);
  left: 0;
}

:where(.weave-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__track) {
  top: auto;
  left: 50%;
  width: var(--weave-slider-track-height);
  height: auto;
  transform: translateX(-50%);
}

:where(.weave-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__active-track) {
  top: min(
    100%,
    calc(100% - var(--weave-slider-progress) + var(--weave-slider-thumb-track-clearance))
  );
  right: auto;
  bottom: calc(-1 * var(--weave-slider-active-outer-extension));
  left: 50%;
  width: var(--weave-slider-track-height);
  border-radius:
    0
    0
    var(--weave-radius-full)
    var(--weave-radius-full);
  transition:
    top var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__inactive-track) {
  top: calc(-1 * var(--weave-slider-inactive-outer-extension));
  right: auto;
  bottom: auto;
  left: 50%;
  width: var(--weave-slider-track-height);
  height: max(
    0px,
    calc(
      100% - var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-slider-inactive-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    var(--weave-radius-full)
    0
    0;
  transition:
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__steps)
  > :where(.weave-slider__step) {
  top: calc(100% - var(--weave-slider-step-position));
  left: 50%;
}

:where(.weave-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb) {
  top: calc(100% - var(--weave-slider-progress));
  left: 50%;
  will-change: top, width, height;
  transition:
    top var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-pointer-active="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb) {
  transition:
    top var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-mark-slider-control="true"]
  )
  > :where(.weave-mark-slider__labels) {
  grid-area: 1 / 2;
  grid-template-columns: auto;
  grid-template-rows: minmax(0, 1fr);
  align-self: stretch;
  margin-top: var(--weave-slider-thumb-half-size);
  margin-right: 0;
  margin-bottom: var(--weave-slider-thumb-half-size);
  margin-left: var(--weave-slider-field-gap);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-mark-slider-control="true"]
  )
  > :where(.weave-mark-slider__labels)
  > :where(.weave-mark-slider__label) {
  top: calc(100% - var(--weave-mark-slider-label-position));
  left: auto;
  align-self: start;
  justify-self: start;
  transform: translateY(-50%);
}

:where(.weave-range-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track--start) {
  top: min(
    100%,
    calc(
      100% - var(--weave-range-slider-start-progress) +
        var(--weave-slider-thumb-track-clearance)
    )
  );
  right: auto;
  bottom: calc(-1 * var(--weave-range-slider-start-outer-extension));
  left: 50%;
  width: var(--weave-slider-track-height);
  height: auto;
  border-radius:
    0
    0
    var(--weave-radius-full)
    var(--weave-radius-full);
  transition:
    top var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-range-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__active-track) {
  top: min(
    100%,
    calc(
      100% - var(--weave-range-slider-end-progress) +
        var(--weave-slider-thumb-track-clearance)
    )
  );
  right: auto;
  bottom: auto;
  left: 50%;
  width: var(--weave-slider-track-height);
  height: max(
    0px,
    calc(
      var(--weave-range-slider-end-progress) -
        var(--weave-range-slider-start-progress) -
        var(--weave-slider-thumb-track-clearance) -
        var(--weave-slider-thumb-track-clearance)
    )
  );
  border-radius: 0;
  transition:
    top var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-range-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track--end) {
  top: calc(-1 * var(--weave-range-slider-end-outer-extension));
  right: auto;
  bottom: auto;
  left: 50%;
  width: var(--weave-slider-track-height);
  height: max(
    0px,
    calc(
      100% - var(--weave-range-slider-end-progress) -
        var(--weave-slider-thumb-track-clearance) +
        var(--weave-range-slider-end-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    var(--weave-radius-full)
    0
    0;
  transition:
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(.weave-range-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start) {
  top: calc(100% - var(--weave-range-slider-start-progress));
  left: 50%;
}

:where(.weave-range-slider-control[data-weave-slider-direction="vertical"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end) {
  top: calc(100% - var(--weave-range-slider-end-progress));
  left: 50%;
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"]
      > .weave-range-slider__input--start
  ) {
  clip-path: inset(var(--weave-range-slider-hit-split) 0 0 0);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"]
      > .weave-range-slider__input--end
  ) {
  clip-path: inset(0 0 calc(100% - var(--weave-range-slider-hit-split)) 0);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-pointer-active="start"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start),
:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-pointer-active="end"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end) {
  transition:
    top var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing),
    box-shadow var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb),
:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__active-track),
:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__inactive-track),
:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-stepped="false"][data-weave-slider-dragging="start"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start),
:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-stepped="false"][data-weave-slider-dragging="end"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end),
:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-stepped="false"][data-weave-slider-dragging]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track),
:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-stepped="false"][data-weave-slider-dragging]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__active-track) {
  transition: none;
}


/* inverse slider axis */

:where(
    .weave-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__active-track) {
  left: auto;
  right: calc(-1 * var(--weave-slider-active-outer-extension));
  width: max(
    0px,
    calc(
      var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-slider-active-outer-extension)
    )
  );
  border-radius:
    0
    var(--weave-radius-full)
    var(--weave-radius-full)
    0;
}

:where(
    .weave-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__inactive-track) {
  left: calc(-1 * var(--weave-slider-inactive-outer-extension));
  right: auto;
  width: max(
    0px,
    calc(
      100% - var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-slider-inactive-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    0
    0
    var(--weave-radius-full);
  transition:
    width var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(
    .weave-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__steps)
  > :where(.weave-slider__step) {
  left: calc(100% - var(--weave-slider-step-position));
}

:where(
    .weave-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb) {
  left: calc(100% - var(--weave-slider-progress));
}

:where(
    .weave-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"][data-weave-mark-slider-control="true"]
  )
  > :where(.weave-mark-slider__labels)
  > :where(.weave-mark-slider__label) {
  left: calc(100% - var(--weave-mark-slider-label-position));
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track--start) {
  left: auto;
  right: calc(-1 * var(--weave-range-slider-start-outer-extension));
  width: max(
    0px,
    calc(
      var(--weave-range-slider-start-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-range-slider-start-outer-extension)
    )
  );
  border-radius:
    0
    var(--weave-radius-full)
    var(--weave-radius-full)
    0;
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__active-track) {
  left: min(
    100%,
    calc(
      100% - var(--weave-range-slider-end-progress) +
        var(--weave-slider-thumb-track-clearance)
    )
  );
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track--end) {
  left: calc(-1 * var(--weave-range-slider-end-outer-extension));
  right: auto;
  width: max(
    0px,
    calc(
      100% - var(--weave-range-slider-end-progress) -
        var(--weave-slider-thumb-track-clearance) +
        var(--weave-range-slider-end-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    0
    0
    var(--weave-radius-full);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start) {
  left: calc(100% - var(--weave-range-slider-start-progress));
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end) {
  left: calc(100% - var(--weave-range-slider-end-progress));
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
      > .weave-range-slider__input--start
  ) {
  clip-path: inset(0 0 0 var(--weave-range-slider-hit-split));
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="horizontal"][data-weave-slider-inverse="true"]
      > .weave-range-slider__input--end
  ) {
  clip-path: inset(0 calc(100% - var(--weave-range-slider-hit-split)) 0 0);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__active-track) {
  top: calc(-1 * var(--weave-slider-active-outer-extension));
  bottom: auto;
  height: max(
    0px,
    calc(
      var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-slider-active-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    var(--weave-radius-full)
    0
    0;
  transition:
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__inactive-track) {
  top: auto;
  bottom: calc(-1 * var(--weave-slider-inactive-outer-extension));
  height: max(
    0px,
    calc(
      100% - var(--weave-slider-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-slider-inactive-outer-extension)
    )
  );
  border-radius:
    0
    0
    var(--weave-radius-full)
    var(--weave-radius-full);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__steps)
  > :where(.weave-slider__step) {
  top: var(--weave-slider-step-position);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb) {
  top: var(--weave-slider-progress);
}

:where(
    .weave-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"][data-weave-mark-slider-control="true"]
  )
  > :where(.weave-mark-slider__labels)
  > :where(.weave-mark-slider__label) {
  top: var(--weave-mark-slider-label-position);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track--start) {
  top: calc(-1 * var(--weave-range-slider-start-outer-extension));
  bottom: auto;
  height: max(
    0px,
    calc(
      var(--weave-range-slider-start-progress) - var(--weave-slider-thumb-track-clearance) +
        var(--weave-range-slider-start-outer-extension)
    )
  );
  border-radius:
    var(--weave-radius-full)
    var(--weave-radius-full)
    0
    0;
  transition:
    height var(--weave-motion-spring-snappy-duration)
      var(--weave-motion-spring-snappy-easing);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__active-track) {
  top: min(
    100%,
    calc(
      var(--weave-range-slider-start-progress) +
        var(--weave-slider-thumb-track-clearance)
    )
  );
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track--end) {
  top: auto;
  bottom: calc(-1 * var(--weave-range-slider-end-outer-extension));
  height: max(
    0px,
    calc(
      100% - var(--weave-range-slider-end-progress) -
        var(--weave-slider-thumb-track-clearance) +
        var(--weave-range-slider-end-outer-extension)
    )
  );
  border-radius:
    0
    0
    var(--weave-radius-full)
    var(--weave-radius-full);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start) {
  top: var(--weave-range-slider-start-progress);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end) {
  top: var(--weave-range-slider-end-progress);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
      > .weave-range-slider__input--start
  ) {
  clip-path: inset(0 0 calc(100% - var(--weave-range-slider-hit-split)) 0);
}

:where(
    .weave-range-slider-control[data-weave-slider-direction="vertical"][data-weave-slider-inverse="true"]
      > .weave-range-slider__input--end
  ) {
  clip-path: inset(var(--weave-range-slider-hit-split) 0 0 0);
}

:where(
    .weave-slider-control[data-weave-slider-inverse="true"][data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__thumb),
:where(
    .weave-slider-control[data-weave-slider-inverse="true"][data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__active-track),
:where(
    .weave-slider-control[data-weave-slider-inverse="true"][data-weave-slider-dragging="true"][data-weave-slider-stepped="false"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-slider__inactive-track),
:where(
    .weave-range-slider-control[data-weave-slider-inverse="true"][data-weave-slider-stepped="false"][data-weave-slider-dragging="start"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--start),
:where(
    .weave-range-slider-control[data-weave-slider-inverse="true"][data-weave-slider-stepped="false"][data-weave-slider-dragging="end"]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__thumb--end),
:where(
    .weave-range-slider-control[data-weave-slider-inverse="true"][data-weave-slider-stepped="false"][data-weave-slider-dragging]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track),
:where(
    .weave-range-slider-control[data-weave-slider-inverse="true"][data-weave-slider-stepped="false"][data-weave-slider-dragging]
  )
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__active-track) {
  transition: none;
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
  > :where(.weave-slider__inactive-track),
:where(.weave-slider-control[data-weave-reduced-motion="reduce"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__active-track),
:where(.weave-slider-control[data-weave-reduced-motion="reduce"])
  > :where(.weave-slider__visual)
  > :where(.weave-slider__range)
  > :where(.weave-range-slider__inactive-track) {
  transition: none;
}
`

export function ensureSliderStylesheet(): void {
  ensureStaticStylesheet('slider', stylesheet)
}
