import type {
  ButtonSize,
  ButtonVariant,
} from '../../core/button-types'

const variantDeclarations: Readonly<
  Record<ButtonVariant, string>
> = {
  primary: `
    --weave-button-background: var(--weave-button-theme-primary-background);
    --weave-button-color: var(--weave-button-theme-primary-color);
    --weave-button-border-color: var(--weave-button-theme-primary-border-color);
    --weave-button-hover-background: var(--weave-button-theme-primary-hover-background);
    --weave-button-active-background: var(--weave-button-theme-primary-active-background);
  `,
  secondary: `
    --weave-button-background: var(--weave-button-theme-secondary-background);
    --weave-button-color: var(--weave-button-theme-secondary-color);
    --weave-button-border-color: var(--weave-button-theme-secondary-border-color);
    --weave-button-hover-background: var(--weave-button-theme-secondary-hover-background);
    --weave-button-active-background: var(--weave-button-theme-secondary-active-background);
  `,
  tertiary: `
    --weave-button-background: var(--weave-button-theme-tertiary-background);
    --weave-button-color: var(--weave-button-theme-tertiary-color);
    --weave-button-border-color: var(--weave-button-theme-tertiary-border-color);
    --weave-button-hover-background: var(--weave-button-theme-tertiary-hover-background);
    --weave-button-active-background: var(--weave-button-theme-tertiary-active-background);
  `,
  ghost: `
    --weave-button-background: var(--weave-button-theme-ghost-background);
    --weave-button-color: var(--weave-button-theme-ghost-color);
    --weave-button-border-color: var(--weave-button-theme-ghost-border-color);
    --weave-button-hover-background: var(--weave-button-theme-ghost-hover-background);
    --weave-button-active-background: var(--weave-button-theme-ghost-active-background);
  `,
  danger: `
    --weave-button-background: var(--weave-button-theme-danger-background);
    --weave-button-color: var(--weave-button-theme-danger-color);
    --weave-button-border-color: var(--weave-button-theme-danger-border-color);
    --weave-button-hover-background: var(--weave-button-theme-danger-hover-background);
    --weave-button-active-background: var(--weave-button-theme-danger-active-background);
  `,
}

const sizeDeclarations: Readonly<Record<ButtonSize, string>> = {
  small: `
    --weave-component-min-height: var(--weave-button-theme-small-min-height);
    --weave-component-padding-top: var(--weave-button-theme-small-padding-y);
    --weave-component-padding-bottom: var(--weave-button-theme-small-padding-y);
    --weave-component-padding-left: var(--weave-button-theme-small-padding-x);
    --weave-component-padding-right: var(--weave-button-theme-small-padding-x);
    --weave-button-gap: var(--weave-button-theme-small-gap);
    --weave-button-font-size: var(--weave-button-theme-small-font-size);
  `,
  medium: `
    --weave-component-min-height: var(--weave-button-theme-medium-min-height);
    --weave-component-padding-top: var(--weave-button-theme-medium-padding-y);
    --weave-component-padding-bottom: var(--weave-button-theme-medium-padding-y);
    --weave-component-padding-left: var(--weave-button-theme-medium-padding-x);
    --weave-component-padding-right: var(--weave-button-theme-medium-padding-x);
    --weave-button-gap: var(--weave-button-theme-medium-gap);
    --weave-button-font-size: var(--weave-button-theme-medium-font-size);
  `,
  large: `
    --weave-component-min-height: var(--weave-button-theme-large-min-height);
    --weave-component-padding-top: var(--weave-button-theme-large-padding-y);
    --weave-component-padding-bottom: var(--weave-button-theme-large-padding-y);
    --weave-component-padding-left: var(--weave-button-theme-large-padding-x);
    --weave-component-padding-right: var(--weave-button-theme-large-padding-x);
    --weave-button-gap: var(--weave-button-theme-large-gap);
    --weave-button-font-size: var(--weave-button-theme-large-font-size);
  `,
}

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

  --weave-component-outline-width: 0;

  appearance: none;
  font: inherit;
  font-size: var(--weave-button-font-size);
  font-weight: var(--weave-button-theme-font-weight);
  line-height: 1;
  text-decoration: none;
}

:where(.weave-button:hover) {
  --weave-component-background: var(--weave-button-hover-background);
}

:where(.weave-button:active) {
  --weave-component-background: var(--weave-button-active-background);
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
  --weave-component-cursor: var(--weave-button-theme-disabled-cursor);
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

:where(.weave-button__content) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--weave-button-gap);
}

:where(.weave-button--loading) > :where(.weave-button__content) {
  opacity: 0;
}

:where(.weave-button__loader) {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

:where(.weave-button__spinner) {
  width: 1em;
  height: 1em;
  border: 0.125em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: weave-button-spin 700ms linear infinite;
}

@keyframes weave-button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.weave-button__spinner) {
    animation: none;
  }
}
`

export function buttonVariantDeclarations(
  variant: ButtonVariant,
): string {
  return variantDeclarations[variant]
}

export function buttonSizeDeclarations(size: ButtonSize): string {
  return sizeDeclarations[size]
}

export function ensureButtonStylesheet(): void {
  if (typeof document === 'undefined') return

  const existing = document.querySelector<HTMLStyleElement>(
    'style[data-weave-button-styles]',
  )

  if (existing !== null) {
    if (existing.textContent !== stylesheet) {
      existing.textContent = stylesheet
    }
    return
  }

  const element = document.createElement('style')
  element.dataset.weaveButtonStyles = ''
  element.textContent = stylesheet
  document.head.append(element)
}
