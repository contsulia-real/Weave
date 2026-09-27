const stylesheet = `
:where(.weave-tooltip) {
  --weave-component-width: max-content;
  --weave-component-max-width: var(--weave-tooltip-max-width);
  --weave-component-background: var(--weave-tooltip-background);
  --weave-component-color: var(--weave-tooltip-color);

  --weave-component-border-top-width: var(--weave-tooltip-border-width);
  --weave-component-border-right-width: var(--weave-tooltip-border-width);
  --weave-component-border-bottom-width: var(--weave-tooltip-border-width);
  --weave-component-border-left-width: var(--weave-tooltip-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-tooltip-border-color);
  --weave-component-border-right-color: var(--weave-tooltip-border-color);
  --weave-component-border-bottom-color: var(--weave-tooltip-border-color);
  --weave-component-border-left-color: var(--weave-tooltip-border-color);

  --weave-component-border-top-left-radius: var(--weave-tooltip-radius);
  --weave-component-border-top-right-radius: var(--weave-tooltip-radius);
  --weave-component-border-bottom-right-radius: var(--weave-tooltip-radius);
  --weave-component-border-bottom-left-radius: var(--weave-tooltip-radius);

  --weave-component-padding-top: var(--weave-tooltip-padding-y);
  --weave-component-padding-right: var(--weave-tooltip-padding-x);
  --weave-component-padding-bottom: var(--weave-tooltip-padding-y);
  --weave-component-padding-left: var(--weave-tooltip-padding-x);

  --weave-component-box-shadow:
    0 var(--weave-tooltip-depth) 0 var(--weave-tooltip-depth-color),
    var(--weave-tooltip-shadow);

  isolation: isolate;
  scale: 1;
  transition:
    scale var(--weave-motion-duration-fast)
      var(--weave-motion-curve-enter);
}

@starting-style {
  :where(.weave-tooltip) {
    scale: 0.94;
  }
}

:where(.weave-tooltip)::before {
  content: "";
  position: absolute;
  width: var(--weave-tooltip-arrow-size);
  height: var(--weave-tooltip-arrow-size);
  box-sizing: border-box;
  background: inherit;
  border: inherit;
  z-index: -1;
}

:where(.weave-tooltip[data-placement="top"]) {
  transform-origin: center bottom;
}

:where(.weave-tooltip[data-placement="top"])::before {
  left: 50%;
  bottom: calc(-0.5 * var(--weave-tooltip-arrow-size));
  transform: translateX(-50%) rotate(45deg);
}

:where(.weave-tooltip[data-placement="bottom"]) {
  transform-origin: center top;
}

:where(.weave-tooltip[data-placement="bottom"])::before {
  left: 50%;
  top: calc(-0.5 * var(--weave-tooltip-arrow-size));
  transform: translateX(-50%) rotate(45deg);
}

:where(.weave-tooltip[data-placement="left"]) {
  transform-origin: right center;
}

:where(.weave-tooltip[data-placement="left"])::before {
  top: 50%;
  right: calc(-0.5 * var(--weave-tooltip-arrow-size));
  transform: translateY(-50%) rotate(45deg);
}

:where(.weave-tooltip[data-placement="right"]) {
  transform-origin: left center;
}

:where(.weave-tooltip[data-placement="right"])::before {
  top: 50%;
  left: calc(-0.5 * var(--weave-tooltip-arrow-size));
  transform: translateY(-50%) rotate(45deg);
}
@media (prefers-reduced-motion: reduce) {
  :where(.weave-tooltip) {
    transition: none;
  }
}

`

export function ensureToolTipStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing =
    document.querySelector<HTMLStyleElement>(
      'style[data-weave-tooltip-styles]',
    )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element =
    document.createElement('style')
  element.dataset.weaveTooltipStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
