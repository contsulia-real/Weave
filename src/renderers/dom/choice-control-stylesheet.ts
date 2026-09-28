const stylesheet = `
:where(.weave-choice-field) {
  display: inline-flex;
  align-items: center;
  gap: 0;
  position: relative;
  cursor: pointer;
  line-height: 1.35;
}

:where(.weave-choice-field[data-weave-choice-disabled="true"]) {
  cursor: default;
}

:where(.weave-choice-label) {
  user-select: none;
}

:where(.weave-choice-shell) {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: var(--weave-choice-state-layer-size);
  height: var(--weave-choice-state-layer-size);
  flex: 0 0 auto;
  line-height: 0;
  vertical-align: middle;
  isolation: isolate;
}

:where(.weave-choice-control) {
  --weave-component-position: relative;
  --weave-component-display: inline-block;
  --weave-component-width: var(--weave-choice-size);
  --weave-component-height: var(--weave-choice-size);
  --weave-component-background: var(--weave-choice-background);
  --weave-component-border-top-width: var(--weave-choice-border-width);
  --weave-component-border-right-width: var(--weave-choice-border-width);
  --weave-component-border-bottom-width: var(--weave-choice-border-width);
  --weave-component-border-left-width: var(--weave-choice-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-choice-border-color);
  --weave-component-border-right-color: var(--weave-choice-border-color);
  --weave-component-border-bottom-color: var(--weave-choice-border-color);
  --weave-component-border-left-color: var(--weave-choice-border-color);
  --weave-component-border-top-left-radius: var(--weave-choice-radius);
  --weave-component-border-top-right-radius: var(--weave-choice-radius);
  --weave-component-border-bottom-right-radius: var(--weave-choice-radius);
  --weave-component-border-bottom-left-radius: var(--weave-choice-radius);
  --weave-component-box-shadow: var(--weave-choice-shadow);
  --weave-component-cursor: var(--weave-choice-cursor);
  --weave-component-outline-width: 0;

  grid-area: 1 / 1;
  z-index: 1;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  vertical-align: middle;
  transform: translateY(0) scale(1);
  transform-origin: center;
  --weave-component-transition-property:
    background-color, border-color, box-shadow, opacity, transform;
  --weave-component-transition-duration:
    var(--weave-motion-duration-normal),
    var(--weave-motion-duration-normal),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-spring);
  --weave-component-transition-delay: 0ms;
}

:where(.weave-choice-control:hover:not([aria-disabled="true"])) {
  --weave-component-box-shadow: var(--weave-choice-hover-shadow);
}

:where(.weave-choice-control:active:not([aria-disabled="true"])) {
  --weave-component-box-shadow: var(--weave-choice-press-shadow);
  transform: translateY(0.03125rem) scale(0.94);
}

:where(.weave-choice-control:checked) {
  --weave-component-background: var(--weave-choice-checked-background);
  --weave-component-border-top-color: var(--weave-choice-checked-border-color);
  --weave-component-border-right-color: var(--weave-choice-checked-border-color);
  --weave-component-border-bottom-color: var(--weave-choice-checked-border-color);
  --weave-component-border-left-color: var(--weave-choice-checked-border-color);
  --weave-component-box-shadow: var(--weave-choice-checked-shadow);
}

:where(.weave-choice-control:checked:hover:not([aria-disabled="true"])) {
  --weave-component-box-shadow: var(--weave-choice-checked-shadow);
}

:where(.weave-choice-control:checked:active:not([aria-disabled="true"])) {
  --weave-component-box-shadow: var(--weave-choice-press-shadow);
}

:where(.weave-choice-control:focus-visible) {
  --weave-component-outline-width: var(--weave-choice-focus-outline-width);
  --weave-component-outline-color: var(--weave-choice-focus-outline-color);
  --weave-component-outline-style: var(--weave-choice-focus-outline-style);
  --weave-component-outline-offset: var(--weave-choice-focus-outline-offset);
}

:where(.weave-choice-control[aria-disabled="true"]) {
  --weave-component-opacity: var(--weave-choice-disabled-opacity);
  --weave-component-cursor: var(--weave-choice-disabled-cursor);
}

:where(.weave-choice-state-layer) {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  width: var(--weave-choice-state-layer-size);
  height: var(--weave-choice-state-layer-size);
  border-radius: 9999px;
  background: var(--weave-choice-state-layer-color);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.72);
  transition:
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    transform var(--weave-motion-duration-fast)
      var(--weave-motion-curve-spring),
    background-color var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard);
}

:where(.weave-choice-control:checked)
  ~ :where(.weave-choice-state-layer) {
  background: var(--weave-choice-checked-state-layer-color);
}

:where(.weave-choice-field:hover)
  :where(.weave-choice-control:not([aria-disabled="true"]))
  ~ :where(.weave-choice-state-layer) {
  opacity: var(--weave-choice-state-layer-hover-opacity);
  transform: translate(-50%, -50%) scale(1);
}

:where(.weave-choice-control:focus-visible)
  ~ :where(.weave-choice-state-layer) {
  opacity: var(--weave-choice-state-layer-focus-opacity);
  transform: translate(-50%, -50%) scale(1);
}

:where(.weave-choice-control:active:not([aria-disabled="true"]))
  ~ :where(.weave-choice-state-layer) {
  opacity: var(--weave-choice-state-layer-press-opacity);
  transform: translate(-50%, -50%) scale(1);
}

:where(.weave-choice-visual) {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  pointer-events: none;
  transform: scale(1);
  transition:
    opacity var(--weave-motion-duration-fast)
      var(--weave-motion-curve-standard),
    transform var(--weave-motion-duration-fast)
      var(--weave-motion-curve-spring);
}

:where(.weave-choice-control[aria-disabled="true"])
  ~ :where(.weave-choice-visual) {
  opacity: var(--weave-choice-disabled-opacity);
}

:where(.weave-choice-control:active:not([aria-disabled="true"]))
  ~ :where(.weave-choice-visual) {
  transform: translateY(0.03125rem) scale(0.94);
}

:where(.weave-radio__dot) {
  width: var(--weave-choice-indicator-size);
  height: var(--weave-choice-indicator-size);
  border-radius: 9999px;
  background: var(--weave-choice-checked-indicator-background);
  box-shadow: var(--weave-choice-indicator-shadow);
  opacity: 0;
  transform: scale(0);
  transition:
    opacity var(--weave-motion-duration-slow)
      var(--weave-motion-curve-standard),
    transform var(--weave-motion-duration-slow)
      var(--weave-motion-curve-spring);
}

:where(.weave-radio:checked)
  ~ :where(.weave-choice-visual)
  > :where(.weave-radio__dot) {
  opacity: 1;
  transform: scale(1);
}

:where(.weave-checkbox__mark) {
  width: var(--weave-choice-mark-size);
  height: var(--weave-choice-mark-size);
  overflow: visible;
}

:where(.weave-checkbox__mark-path) {
  fill: none;
  stroke: var(--weave-choice-checked-indicator-color);
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition:
    stroke-dashoffset var(--weave-motion-duration-slow)
      var(--weave-motion-curve-standard);
}

:where(.weave-checkbox:checked)
  ~ :where(.weave-choice-visual)
  :where(.weave-checkbox__mark-path) {
  stroke-dashoffset: 0;
  transition-delay: calc(var(--weave-motion-duration-fast) * 0.18);
}

:where(.weave-choice-field[data-weave-reduced-motion="reduce"])
  :where(.weave-choice-state-layer),
:where(.weave-choice-field[data-weave-reduced-motion="reduce"])
  :where(.weave-choice-visual),
:where(.weave-choice-field[data-weave-reduced-motion="reduce"])
  :where(.weave-radio__dot),
:where(.weave-choice-field[data-weave-reduced-motion="reduce"])
  :where(.weave-checkbox__mark-path) {
  transition: none;
}
`

export function ensureChoiceControlStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-choice-control-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveChoiceControlStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
