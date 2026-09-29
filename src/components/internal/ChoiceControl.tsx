import type { ChangeEvent } from 'react'
import { useInsertionEffect } from 'react'
import type { CheckboxProps, ChoiceControlKind, RadioProps } from '../../core/choice-types'
import type { ViewProps } from '../../core/view-types'
import { ensureChoiceControlStylesheet } from '../../renderers/dom/choice-control-stylesheet'
import { resolveChoiceControlTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { useTheme } from '../../theme/theme-context'
import { useViewHost } from './use-view-host'

type ChoiceControlProps = ({ kind: 'radio' } & RadioProps) | ({ kind: 'checkbox' } & CheckboxProps)

export function ChoiceControl({
  kind,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  group,
  value,
  size = 'medium',
  viewProps = {},
}: ChoiceControlProps) {
  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    `${kind}-theme`,
    resolveChoiceControlTheme(theme, kind as ChoiceControlKind, size),
  )
  const hostProps: ViewProps<HTMLInputElement> = {
    ...viewProps,
    disabled,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(ensureChoiceControlStylesheet, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.currentTarget.checked)
  }

  return (
    <label
      data-weave-choice-field=""
      data-weave-choice-disabled={disabled ? 'true' : 'false'}
      data-weave-reduced-motion={reducedMotion ? 'reduce' : 'no-preference'}
      className={[
        'weave-choice-field',
        `weave-choice-field--${kind}`,
        `weave-choice-field--${size}`,
        themeClassName,
      ].join(' ')}
    >
      <span
        data-weave-choice-shell=""
        className={[
          'weave-choice-shell',
          `weave-choice-shell--${kind}`,
          `weave-choice-shell--${size}`,
        ].join(' ')}
      >
        <input
          {...resolved.domProps}
          ref={elementRef}
          type={kind}
          name={group}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          disabled={disabled}
          data-weave-view=""
          data-weave-choice-control=""
          data-weave-choice-kind={kind}
          data-weave-choice-group={group}
          data-weave-layout={resolved.layout}
          className={[
            'weave-choice-control',
            `weave-${kind}`,
            `weave-choice-control--${size}`,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={inlineStyle}
        />

        <span className="weave-choice-state-layer" aria-hidden="true" />

        <span className="weave-choice-visual" aria-hidden="true">
          {kind === 'radio' ? (
            <span className="weave-radio__dot" />
          ) : (
            <svg className="weave-checkbox__mark" viewBox="0 0 24 24" aria-hidden="true">
              <path
                className="weave-checkbox__mark-path"
                data-weave-checkbox-check=""
                pathLength="1"
                d="M4.5 12.5 9.5 17.5 19.5 6.5"
              />
            </svg>
          )}
        </span>
      </span>

      {label !== undefined ? (
        <span className="weave-choice-label" data-weave-choice-label="">
          {label}
        </span>
      ) : null}
    </label>
  )
}
