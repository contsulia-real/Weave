import { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { SwitchProps } from '../core/switch-types'
import type { ViewProps } from '../core/view-types'
import { resolveSwitchTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { ensureSwitchStylesheet } from '../renderers/dom/switch-stylesheet'
import { useTheme } from '../theme/theme-context'
import { formFieldAssociationOverrides, useFormFieldContext } from './internal/form-field-context'
import { durationMilliseconds } from './internal/motion-duration'
import { useFormReset } from './internal/use-form-reset'
import { useSwitchInteraction } from './internal/use-switch-interaction'
import { useViewHost } from './internal/use-view-host'

const DEFAULT_AUTO_DRAG_DURATION = 200

export function Switch(props: SwitchProps): import('react').JSX.Element {
  const {
    checked,
    defaultChecked = false,
    onChange,
    name,
    value = 'on',
    disabled = false,
    label,
    size = 'medium',
    viewProps = {},
  } = props
  useStaticStylesheet(ensureSwitchStylesheet)

  const { theme, reducedMotion } = useTheme()
  const themeDeclarations = useMemo(() => resolveSwitchTheme(theme, size), [size, theme])
  const themeClassName = useRuntimeStyleClass('switch-theme', themeDeclarations)

  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const currentChecked = checked ?? uncontrolledChecked
  const generatedId = useId()
  const switchId = viewProps.id ?? `weave-switch-${generatedId}`
  const labelId = `${switchId}-label`
  const field = useFormFieldContext()
  const { labelledBy, ...remainingViewProps } = viewProps

  const hostProps: ViewProps<HTMLButtonElement> = {
    ...remainingViewProps,
    id: switchId,
    checked: currentChecked,
    disabled,
    required: field?.required === true ? true : viewProps.required,
    invalid: field?.invalid === true ? true : viewProps.invalid,
    focusable: disabled ? false : (viewProps.focusable ?? true),
    labelledBy: label === undefined && field === null ? labelledBy : undefined,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    hostProps,
    undefined,
    undefined,
    field === null && label === undefined
      ? undefined
      : {
          ...formFieldAssociationOverrides(field, labelledBy, viewProps.describedBy),
          labelledBy: [labelledBy, field?.labelId, label === undefined ? undefined : labelId],
        },
  )

  const switchBase = theme.components.Switch?.base
  const dragShrink = switchBase?.thumbDragShrink ?? 0.68
  const dragMaxWidth = switchBase?.thumbDragMaxWidth ?? 1.35
  const autoDragDuration = Math.max(
    1,
    durationMilliseconds(theme.tokens.motion?.duration?.normal, DEFAULT_AUTO_DRAG_DURATION),
  )

  const thumbRef = useRef<HTMLDivElement>(null)

  const commit = (nextChecked: boolean) => {
    if (!isControlled) {
      setUncontrolledChecked(nextChecked)
    }

    onChange?.(nextChecked)
  }

  const reset = useCallback(() => {
    if (!isControlled) {
      setUncontrolledChecked(defaultChecked)
    }
  }, [defaultChecked, isControlled])

  useFormReset(elementRef, reset)

  const interaction = useSwitchInteraction({
    rootRef: elementRef,
    thumbRef,
    checked: currentChecked,
    disabled,
    dragShrink,
    dragMaxWidth,
    autoDragDuration,
    reducedMotion,
    callbacks: {
      onClick: viewProps.onClick,
      onKeyDown: viewProps.onKeyDown,
      onPointerDown: viewProps.onPointerDown,
      onPointerMove: viewProps.onPointerMove,
      onPointerUp: viewProps.onPointerUp,
      onPointerCancel: viewProps.onPointerCancel,
    },
    onCommit: commit,
  })

  const control = (
    <button
      {...resolved.domProps}
      ref={elementRef}
      type="button"
      disabled={disabled}
      role="switch"
      data-weave-view=""
      data-weave-switch=""
      data-weave-switch-size={size}
      data-weave-layout={resolved.layout}
      className={['weave-switch', `weave-switch--${size}`, themeClassName, className]
        .filter(Boolean)
        .join(' ')}
      style={inlineStyle}
      onClick={interaction.handleClick}
      onKeyDown={interaction.handleKeyDown}
      onPointerDown={interaction.handlePointerDown}
      onPointerMove={interaction.handlePointerMove}
      onPointerUp={interaction.handlePointerUp}
      onPointerCancel={interaction.handlePointerCancel}
    >
      <div
        ref={thumbRef}
        data-weave-view=""
        data-weave-switch-thumb=""
        className="weave-view weave-switch__thumb"
      />
    </button>
  )

  const formValue =
    name !== undefined && currentChecked ? (
      <input type="hidden" name={name} value={value} disabled={disabled} />
    ) : null

  if (label === undefined) {
    return (
      <>
        {formValue}
        {control}
      </>
    )
  }

  return (
    <>
      {formValue}
      <label
        className={['weave-switch-field', themeClassName].filter(Boolean).join(' ')}
        data-weave-switch-field=""
        data-weave-switch-disabled={disabled ? 'true' : 'false'}
        htmlFor={switchId}
      >
        {control}
        <span id={labelId} className="weave-switch__label" data-weave-switch-label="">
          {label}
        </span>
      </label>
    </>
  )
}
