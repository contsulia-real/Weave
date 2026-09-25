import type {
  ButtonSize,
  ButtonVariant,
} from '../../core/button-types'

const variantDeclarations: Readonly<
  Record<ButtonVariant, string>
> = {
  primary: `
    --weave-component-background: var(--weave-button-theme-primary-background);
    --weave-component-color: var(--weave-button-theme-primary-color);
    --weave-component-border-top-color: var(--weave-button-theme-primary-border-color);
    --weave-component-border-right-color: var(--weave-button-theme-primary-border-color);
    --weave-component-border-bottom-color: var(--weave-button-theme-primary-border-color);
    --weave-component-border-left-color: var(--weave-button-theme-primary-border-color);
    --weave-hover-background: var(--weave-button-theme-primary-hover-background);
    --weave-active-background: var(--weave-button-theme-primary-active-background);
  `,
  secondary: `
    --weave-component-background: var(--weave-button-theme-secondary-background);
    --weave-component-color: var(--weave-button-theme-secondary-color);
    --weave-component-border-top-color: var(--weave-button-theme-secondary-border-color);
    --weave-component-border-right-color: var(--weave-button-theme-secondary-border-color);
    --weave-component-border-bottom-color: var(--weave-button-theme-secondary-border-color);
    --weave-component-border-left-color: var(--weave-button-theme-secondary-border-color);
    --weave-hover-background: var(--weave-button-theme-secondary-hover-background);
    --weave-active-background: var(--weave-button-theme-secondary-active-background);
  `,
  tertiary: `
    --weave-component-background: var(--weave-button-theme-tertiary-background);
    --weave-component-color: var(--weave-button-theme-tertiary-color);
    --weave-component-border-top-color: var(--weave-button-theme-tertiary-border-color);
    --weave-component-border-right-color: var(--weave-button-theme-tertiary-border-color);
    --weave-component-border-bottom-color: var(--weave-button-theme-tertiary-border-color);
    --weave-component-border-left-color: var(--weave-button-theme-tertiary-border-color);
    --weave-hover-background: var(--weave-button-theme-tertiary-hover-background);
    --weave-active-background: var(--weave-button-theme-tertiary-active-background);
  `,
  ghost: `
    --weave-component-background: var(--weave-button-theme-ghost-background);
    --weave-component-color: var(--weave-button-theme-ghost-color);
    --weave-component-border-top-color: var(--weave-button-theme-ghost-border-color);
    --weave-component-border-right-color: var(--weave-button-theme-ghost-border-color);
    --weave-component-border-bottom-color: var(--weave-button-theme-ghost-border-color);
    --weave-component-border-left-color: var(--weave-button-theme-ghost-border-color);
    --weave-hover-background: var(--weave-button-theme-ghost-hover-background);
    --weave-active-background: var(--weave-button-theme-ghost-active-background);
  `,
  danger: `
    --weave-component-background: var(--weave-button-theme-danger-background);
    --weave-component-color: var(--weave-button-theme-danger-color);
    --weave-component-border-top-color: var(--weave-button-theme-danger-border-color);
    --weave-component-border-right-color: var(--weave-button-theme-danger-border-color);
    --weave-component-border-bottom-color: var(--weave-button-theme-danger-border-color);
    --weave-component-border-left-color: var(--weave-button-theme-danger-border-color);
    --weave-hover-background: var(--weave-button-theme-danger-hover-background);
    --weave-active-background: var(--weave-button-theme-danger-active-background);
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
  --weave-component-border-top-width: var(--weave-button-theme-border-width);
  --weave-component-border-right-width: var(--weave-button-theme-border-width);
  --weave-component-border-bottom-width: var(--weave-button-theme-border-width);
  --weave-component-border-left-width: var(--weave-button-theme-border-width);
  --weave-component-border-style: solid;
  --weave-component-border-top-left-radius: var(--weave-button-theme-radius);
  --weave-component-border-top-right-radius: var(--weave-button-theme-radius);
  --weave-component-border-bottom-right-radius: var(--weave-button-theme-radius);
  --weave-component-border-bottom-left-radius: var(--weave-button-theme-radius);
  --weave-component-cursor: var(--weave-button-theme-cursor);
  --weave-component-user-select: none;

  --weave-focus-visible-outline-width: var(--weave-button-theme-focus-outline-width);
  --weave-focus-visible-outline-color: var(--weave-button-theme-focus-outline-color);
  --weave-focus-visible-outline-style: var(--weave-button-theme-focus-outline-style);
  --weave-focus-visible-outline-offset: var(--weave-button-theme-focus-outline-offset);
  --weave-disabled-opacity: var(--weave-button-theme-disabled-opacity);
  --weave-disabled-cursor: var(--weave-button-theme-disabled-cursor);

  appearance: none;
  font: inherit;
  font-size: var(--weave-button-font-size);
  font-weight: var(--weave-button-theme-font-weight);
  line-height: 1;
  text-decoration: none;
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
  --weave-component-display: flex;
  --weave-component-direction: row;
  --weave-component-align-items: center;
  --weave-component-justify-content: center;
  --weave-component-gap: var(--weave-button-gap);
}

:where(.weave-button--loading) > :where(.weave-button__content) {
  opacity: 0;
}

:where(.weave-button__loader) {
  --weave-component-position: absolute;
  --weave-component-inset: 0;
  --weave-component-display: flex;
  --weave-component-align-items: center;
  --weave-component-justify-content: center;
  --weave-component-pointer-events: none;
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
