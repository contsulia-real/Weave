import {
  useInsertionEffect,
} from 'react'
import type { ChangeEvent } from 'react'
import type {
  CheckboxProps,
  ChoiceControlKind,
  RadioProps,
} from '../../core/choice-types'
import type { ViewProps } from '../../core/view-types'
import { ensureChoiceControlStylesheet } from '../../renderers/dom/choice-control-stylesheet'
import { resolveChoiceControlTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { useTheme } from '../../theme/theme-context'
import { useViewHost } from './use-view-host'

type ChoiceControlProps =
  | ({ kind: 'radio' } & RadioProps)
  | ({ kind: 'checkbox' } & CheckboxProps)

export function ChoiceControl({
  kind,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  group,
  value,
  size = 'medium',
  viewProps = {},
}: ChoiceControlProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    `${kind}-theme`,
    resolveChoiceControlTheme(
      theme,
      kind as ChoiceControlKind,
      size,
    ),
  )
  const hostProps: ViewProps<HTMLInputElement> = {
    ...viewProps,
    disabled,
  }
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)

  useInsertionEffect(
    ensureChoiceControlStylesheet,
    [],
  )

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onChange?.(event.currentTarget.checked)
  }

  return (
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
        themeClassName,
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
  )
}
