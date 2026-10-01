import type { ButtonSize, ButtonVariant } from '../../core/button-types'

const variantDeclarations: Readonly<Record<ButtonVariant, string>> = {
  primary: `
    --weave-button-background: var(--weave-button-theme-primary-background);
    --weave-button-color: var(--weave-button-theme-primary-color);
    --weave-button-border-color: var(--weave-button-theme-primary-border-color);
    --weave-button-depth-color: var(--weave-button-theme-primary-depth-color);
    --weave-button-hover-background: var(--weave-button-theme-primary-hover-background);
    --weave-button-active-background: var(--weave-button-theme-primary-active-background);
  `,
  secondary: `
    --weave-button-background: var(--weave-button-theme-secondary-background);
    --weave-button-color: var(--weave-button-theme-secondary-color);
    --weave-button-border-color: var(--weave-button-theme-secondary-border-color);
    --weave-button-depth-color: var(--weave-button-theme-secondary-depth-color);
    --weave-button-hover-background: var(--weave-button-theme-secondary-hover-background);
    --weave-button-active-background: var(--weave-button-theme-secondary-active-background);
  `,
  tertiary: `
    --weave-button-background: var(--weave-button-theme-tertiary-background);
    --weave-button-color: var(--weave-button-theme-tertiary-color);
    --weave-button-border-color: var(--weave-button-theme-tertiary-border-color);
    --weave-button-depth-color: var(--weave-button-theme-tertiary-depth-color);
    --weave-button-hover-background: var(--weave-button-theme-tertiary-hover-background);
    --weave-button-active-background: var(--weave-button-theme-tertiary-active-background);
  `,
  ghost: `
    --weave-button-background: var(--weave-button-theme-ghost-background);
    --weave-button-color: var(--weave-button-theme-ghost-color);
    --weave-button-border-color: var(--weave-button-theme-ghost-border-color);
    --weave-button-depth-color: var(--weave-button-theme-ghost-depth-color);
    --weave-button-hover-background: var(--weave-button-theme-ghost-hover-background);
    --weave-button-active-background: var(--weave-button-theme-ghost-active-background);
  `,
  danger: `
    --weave-button-background: var(--weave-button-theme-danger-background);
    --weave-button-color: var(--weave-button-theme-danger-color);
    --weave-button-border-color: var(--weave-button-theme-danger-border-color);
    --weave-button-depth-color: var(--weave-button-theme-danger-depth-color);
    --weave-button-hover-background: var(--weave-button-theme-danger-hover-background);
    --weave-button-active-background: var(--weave-button-theme-danger-active-background);
  `,
}

const sizeDeclarations: Readonly<Record<ButtonSize, string>> = {
  small: `
    --weave-button-min-height: var(--weave-button-theme-small-min-height);
    --weave-component-min-height: var(--weave-button-min-height);
    --weave-component-padding-top: var(--weave-button-theme-small-padding-y);
    --weave-component-padding-bottom: calc(var(--weave-button-theme-small-padding-y) - var(--weave-feedback-rest-depth));
    --weave-component-padding-left: var(--weave-button-theme-small-padding-x);
    --weave-component-padding-right: var(--weave-button-theme-small-padding-x);
    --weave-button-gap: var(--weave-button-theme-small-gap);
    --weave-button-font-size: var(--weave-button-theme-small-font-size);
    --weave-button-font-weight: var(--weave-button-theme-small-font-weight);
    --weave-button-line-height: var(--weave-button-theme-small-line-height);
    --weave-button-letter-spacing: var(--weave-button-theme-small-letter-spacing);
  `,
  medium: `
    --weave-button-min-height: var(--weave-button-theme-medium-min-height);
    --weave-component-min-height: var(--weave-button-min-height);
    --weave-component-padding-top: var(--weave-button-theme-medium-padding-y);
    --weave-component-padding-bottom: calc(var(--weave-button-theme-medium-padding-y) - var(--weave-feedback-rest-depth));
    --weave-component-padding-left: var(--weave-button-theme-medium-padding-x);
    --weave-component-padding-right: var(--weave-button-theme-medium-padding-x);
    --weave-button-gap: var(--weave-button-theme-medium-gap);
    --weave-button-font-size: var(--weave-button-theme-medium-font-size);
    --weave-button-font-weight: var(--weave-button-theme-medium-font-weight);
    --weave-button-line-height: var(--weave-button-theme-medium-line-height);
    --weave-button-letter-spacing: var(--weave-button-theme-medium-letter-spacing);
  `,
  large: `
    --weave-button-min-height: var(--weave-button-theme-large-min-height);
    --weave-component-min-height: var(--weave-button-min-height);
    --weave-component-padding-top: var(--weave-button-theme-large-padding-y);
    --weave-component-padding-bottom: calc(var(--weave-button-theme-large-padding-y) - var(--weave-feedback-rest-depth));
    --weave-component-padding-left: var(--weave-button-theme-large-padding-x);
    --weave-component-padding-right: var(--weave-button-theme-large-padding-x);
    --weave-button-gap: var(--weave-button-theme-large-gap);
    --weave-button-font-size: var(--weave-button-theme-large-font-size);
    --weave-button-font-weight: var(--weave-button-theme-large-font-weight);
    --weave-button-line-height: var(--weave-button-theme-large-line-height);
    --weave-button-letter-spacing: var(--weave-button-theme-large-letter-spacing);
  `,
}

import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where(.weave-button) {
  --weave-component-display: inline-flex;
  --weave-component-align-items: center;
  --weave-component-justify-content: center;
  --weave-component-position: relative;
  --weave-component-background: var(--weave-button-background);
  --weave-component-color: var(--weave-button-color);
  --weave-component-border-top-width: var(--weave-button-theme-border-width);
  --weave-component-border-right-width: var(--weave-button-theme-border-width);
  --weave-component-border-bottom-width: var(--weave-button-theme-border-width);
  --weave-component-border-left-width: var(--weave-button-theme-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-color: var(--weave-button-border-color);
  --weave-component-border-right-color: var(--weave-button-border-color);
  --weave-component-border-bottom-color: var(--weave-button-border-color);
  --weave-component-border-left-color: var(--weave-button-border-color);
  --weave-component-border-top-left-radius: var(--weave-button-theme-radius);
  --weave-component-border-top-right-radius: var(--weave-button-theme-radius);
  --weave-component-border-bottom-right-radius: var(--weave-button-theme-radius);
  --weave-component-border-bottom-left-radius: var(--weave-button-theme-radius);
  --weave-component-cursor: var(--weave-button-theme-cursor);
  --weave-component-user-select: none;
  --weave-component-transform: translateY(0) scale(1);
  --weave-component-box-shadow:
    0 var(--weave-feedback-rest-depth) 0 var(--weave-button-depth-color);

  --weave-component-outline-width: 0;

  appearance: none;
  font: inherit;
  font-size: var(--weave-button-font-size);
  font-weight: var(--weave-button-font-weight);
  line-height: var(--weave-button-line-height);
  letter-spacing: var(--weave-button-letter-spacing);
  text-decoration: none;
  --weave-component-transition-property:
    background-color, border-color, color, opacity, transform, box-shadow;
  --weave-component-transition-duration:
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-duration-fast),
    var(--weave-motion-spring-snappy-duration),
    var(--weave-motion-duration-fast);
  --weave-component-transition-timing-function:
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-curve-standard),
    var(--weave-motion-spring-snappy-easing),
    var(--weave-motion-curve-standard);
  --weave-component-transition-delay: 0ms;
}

:where(
  .weave-button:hover:not([aria-disabled="true"]):not([aria-pressed="true"])
) {
  --weave-component-background: var(--weave-button-hover-background);
  --weave-component-transform:
    translateY(calc(-1 * var(--weave-feedback-hover-lift)))
    scale(var(--weave-feedback-hover-scale));
  --weave-component-box-shadow:
    0 var(--weave-feedback-hover-depth) 0 var(--weave-button-depth-color);
}

:where(.weave-button:active:not([aria-disabled="true"])),
:where(.weave-button[aria-pressed="true"]:not([aria-disabled="true"])) {
  --weave-component-background: var(--weave-button-active-background);
  --weave-component-transform:
    translateY(var(--weave-feedback-press-offset))
    scale(var(--weave-feedback-press-scale));
  --weave-component-box-shadow:
    0 var(--weave-feedback-press-depth) 0 var(--weave-button-depth-color);
}

:where(.weave-button:focus-visible) {
  --weave-component-outline-width: var(
    --weave-button-theme-focus-outline-width
  );
  --weave-component-outline-color: var(
    --weave-button-theme-focus-outline-color
  );
  --weave-component-outline-style: var(
    --weave-button-theme-focus-outline-style
  );
  --weave-component-outline-offset: var(
    --weave-button-theme-focus-outline-offset
  );
}

:where(.weave-button[aria-disabled="true"]) {
  --weave-component-opacity: var(--weave-button-theme-disabled-opacity);
  --weave-component-cursor: not-allowed;
}

:where(.weave-button--primary) {
  ${variantDeclarations.primary}
}

:where(.weave-button--secondary) {
  ${variantDeclarations.secondary}
}

:where(.weave-button--tertiary) {
  ${variantDeclarations.tertiary}
}

:where(.weave-button--ghost) {
  ${variantDeclarations.ghost}
}

:where(.weave-button--danger) {
  ${variantDeclarations.danger}
}

:where(.weave-button--small) {
  ${sizeDeclarations.small}
}

:where(.weave-button--medium) {
  ${sizeDeclarations.medium}
}

:where(.weave-button--large) {
  ${sizeDeclarations.large}
}

:where(.weave-button--icon-only) {
  --weave-component-min-width: var(--weave-button-min-height);
  --weave-component-padding-left: 0;
  --weave-component-padding-right: 0;
}

:where(.weave-button__content) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--weave-button-gap);
}

:where(
  .weave-button[data-weave-reduced-motion="reduce"]:hover:not([aria-disabled="true"])
),
:where(
  .weave-button[data-weave-reduced-motion="reduce"]:active:not([aria-disabled="true"])
),
:where(
  .weave-button[data-weave-reduced-motion="reduce"][aria-pressed="true"]:not([aria-disabled="true"])
) {
  --weave-component-transform: none;
}
`

export function buttonVariantDeclarations(variant: ButtonVariant): string {
  return variantDeclarations[variant]
}

export function buttonSizeDeclarations(size: ButtonSize): string {
  return sizeDeclarations[size]
}

export function ensureButtonStylesheet(): void {
  ensureStaticStylesheet('button', stylesheet)
}
