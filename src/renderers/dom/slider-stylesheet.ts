import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-slider-field) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  line-height: inherit;
}

:where(.weave-slider-field[data-weave-slider-disabled="true"]) {
  cursor: default;
}

:where(.weave-slider__label) {
  user-select: none;
}

:where(.weave-slider) {
  --weave-component-width: 16rem;
  --weave-component-height: var(--weave-slider-thumb-size);
  --weave-component-background: transparent;
  --weave-component-cursor: var(--weave-slider-cursor);
  --weave-component-outline-width: 0;

  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  background-image: linear-gradient(
    to right,
    var(--weave-slider-fill-color) 0,
    var(--weave-slider-fill-color) var(--weave-slider-progress),
    var(--weave-slider-track-color) var(--weave-slider-progress),
    var(--weave-slider-track-color) 100%
  );
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% var(--weave-slider-track-height);
}

:where(.weave-slider:focus-visible) {
  --weave-component-outline-width: var(--weave-slider-focus-outline-width);
  --weave-component-outline-color: var(--weave-slider-focus-outline-color);
  --weave-component-outline-style: var(--weave-slider-focus-outline-style);
  --weave-component-outline-offset: var(--weave-slider-focus-outline-offset);
}

:where(.weave-slider:disabled) {
  --weave-component-opacity: var(--weave-slider-disabled-opacity);
  --weave-component-cursor: var(--weave-slider-disabled-cursor);
}

.weave-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: var(--weave-slider-track-height);
  border: 0;
  border-radius: var(--weave-radius-full);
  background: transparent;
  box-shadow: var(--weave-slider-track-shadow);
}

.weave-slider::-moz-range-track {
  width: 100%;
  height: var(--weave-slider-track-height);
  border: 0;
  border-radius: var(--weave-radius-full);
  background: var(--weave-slider-track-color);
  box-shadow: var(--weave-slider-track-shadow);
}

.weave-slider::-moz-range-progress {
  height: var(--weave-slider-track-height);
  border: 0;
  border-radius: var(--weave-radius-full);
  background: var(--weave-slider-fill-color);
  box-shadow: var(--weave-slider-track-shadow);
}

.weave-slider::-webkit-slider-thumb {
  width: var(--weave-slider-thumb-size);
  height: var(--weave-slider-thumb-size);
  margin-top: calc((var(--weave-slider-track-height) - var(--weave-slider-thumb-size)) / 2);
  appearance: none;
  -webkit-appearance: none;
  border: var(--weave-slider-thumb-border-width) solid var(--weave-slider-thumb-border-color);
  border-radius: 50%;
  background: var(--weave-slider-thumb-background);
  box-shadow: var(--weave-slider-thumb-shadow);
  cursor: inherit;
  transition:
    box-shadow var(--weave-motion-duration-fast) var(--weave-motion-curve-standard),
    transform var(--weave-motion-duration-fast) var(--weave-motion-curve-standard);
}

.weave-slider::-moz-range-thumb {
  width: var(--weave-slider-thumb-size);
  height: var(--weave-slider-thumb-size);
  box-sizing: border-box;
  border: var(--weave-slider-thumb-border-width) solid var(--weave-slider-thumb-border-color);
  border-radius: 50%;
  background: var(--weave-slider-thumb-background);
  box-shadow: var(--weave-slider-thumb-shadow);
  cursor: inherit;
  transition:
    box-shadow var(--weave-motion-duration-fast) var(--weave-motion-curve-standard),
    transform var(--weave-motion-duration-fast) var(--weave-motion-curve-standard);
}

.weave-slider:hover:not(:disabled)::-webkit-slider-thumb {
  box-shadow: var(--weave-slider-thumb-hover-shadow);
}

.weave-slider:hover:not(:disabled)::-moz-range-thumb {
  box-shadow: var(--weave-slider-thumb-hover-shadow);
}

.weave-slider:active:not(:disabled)::-webkit-slider-thumb {
  box-shadow: var(--weave-slider-thumb-press-shadow);
  transform: scale(var(--weave-feedback-press-scale));
}

.weave-slider:active:not(:disabled)::-moz-range-thumb {
  box-shadow: var(--weave-slider-thumb-press-shadow);
  transform: scale(var(--weave-feedback-press-scale));
}
`

export function ensureSliderStylesheet(): void {
  ensureStaticStylesheet('slider', stylesheet)
}
