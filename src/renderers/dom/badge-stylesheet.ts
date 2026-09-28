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
}

:where(.weave-badge--dot) {
  width: var(--weave-badge-theme-dot-size);
  min-width: var(--weave-badge-theme-dot-size);
  height: var(--weave-badge-theme-dot-size);
  padding: 0;
}

:where(.weave-badge-anchor[data-weave-badge-placement="top-left"])
  > :where(.weave-badge) {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="top"])
  > :where(.weave-badge) {
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="top-right"])
  > :where(.weave-badge) {
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="right"])
  > :where(.weave-badge) {
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="bottom-right"])
  > :where(.weave-badge) {
  right: 0;
  bottom: 0;
  transform: translate(50%, 50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="bottom"])
  > :where(.weave-badge) {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="bottom-left"])
  > :where(.weave-badge) {
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
}

:where(.weave-badge-anchor[data-weave-badge-placement="left"])
  > :where(.weave-badge) {
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
}
`

export function ensureBadgeStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-badge-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveBadgeStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
