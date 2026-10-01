import type { ChangeEvent, CSSProperties } from 'react'
import { useCallback, useInsertionEffect, useState } from 'react'
import type {
  InputIcon,
  InputProps,
  InputType,
  MultilineInputViewProps,
  SingleLineInputViewProps,
} from '../core/input-types'
import type { ViewProps } from '../core/view-types'
import { ensureInputStylesheet } from '../renderers/dom/input-stylesheet'
import { resolveInputTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { Button } from './Button'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { closeIcon } from './internal/control-icons'
import { formFieldAssociationOverrides, useFormFieldContext } from './internal/form-field-context'
import { renderIconSource } from './internal/render-icon-source'
import { useFormReset } from './internal/use-form-reset'
import { useViewHost } from './internal/use-view-host'

function cssString(value: CSSProperties['overflow'] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function inputOverflowIntent(style: CSSProperties | undefined) {
  return {
    styleOverflow: cssString(style?.overflow),
    styleOverflowX: cssString(style?.overflowX),
    styleOverflowY: cssString(style?.overflowY),
  }
}

function useInputThemeClassName(): string | undefined {
  const { theme } = useTheme()

  return useRuntimeStyleClass('input-theme', resolveInputTheme(theme))
}

interface SingleLineInputHostProps {
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: InputType
  readOnly?: boolean
  required?: boolean
  name?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  clearable?: boolean
  clearLabel?: string
  leadingIcon?: InputIcon
  trailingIcon?: InputIcon
  viewProps?: SingleLineInputViewProps
}

function SingleLineInput({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  type,
  readOnly,
  required,
  name,
  autoComplete,
  minLength,
  maxLength,
  pattern,
  clearable = true,
  clearLabel = 'Clear input',
  leadingIcon,
  trailingIcon,
  viewProps = {},
}: SingleLineInputHostProps) {
  const field = useFormFieldContext()
  const fieldRequired = field?.required === true
  const nativeRequired = required === true || (fieldRequired && viewProps.role !== 'combobox')
  const hostProps: ViewProps<HTMLInputElement> = {
    ...viewProps,
    disabled,
    required: fieldRequired ? true : undefined,
    invalid: field?.invalid === true ? true : viewProps.invalid,
  }
  const themeClassName = useInputThemeClassName()
  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    hostProps,
    undefined,
    undefined,
    formFieldAssociationOverrides(field, viewProps.labelledBy, viewProps.describedBy),
  )
  const controlled = value !== undefined
  const [uncontrolledText, setUncontrolledText] = useState(String(defaultValue ?? ''))
  const currentText = controlled ? String(value ?? '') : uncontrolledText
  const hasClear = clearable && !disabled && !readOnly && currentText.length > 0
  const hasLeadingIcon = leadingIcon !== undefined
  const hasTrailingIcon = trailingIcon !== undefined
  const usesAdornmentRoot = clearable || hasLeadingIcon || hasTrailingIcon
  const reset = useCallback(() => {
    const next = String(controlled ? (value ?? '') : (defaultValue ?? ''))

    if (!controlled) {
      setUncontrolledText(next)
    }

    if (elementRef.current !== null) {
      elementRef.current.value = next
    }
  }, [controlled, defaultValue, elementRef, value])

  useFormReset(elementRef, reset)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value

    if (!controlled) {
      setUncontrolledText(next)
    }

    onChange?.(next)
  }

  const clear = () => {
    if (!controlled) {
      setUncontrolledText('')

      if (elementRef.current !== null) {
        elementRef.current.value = ''
      }
    }

    onChange?.('')
    elementRef.current?.focus()
  }

  const input = (
    <input
      {...resolved.domProps}
      ref={elementRef}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
      readOnly={readOnly}
      required={nativeRequired}
      name={name}
      autoComplete={autoComplete}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      data-weave-view=""
      data-weave-input=""
      data-weave-input-has-clear={hasClear ? 'true' : undefined}
      data-weave-input-has-leading-icon={hasLeadingIcon ? 'true' : undefined}
      data-weave-input-has-trailing-icon={hasTrailingIcon ? 'true' : undefined}
      data-weave-layout={resolved.layout}
      className={['weave-input', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
  )

  if (!usesAdornmentRoot) {
    return input
  }

  return (
    <span
      className={['weave-input-root', themeClassName].filter(Boolean).join(' ')}
      data-weave-input-root=""
      data-weave-input-root-fill={viewProps.width === 'fill' ? 'true' : undefined}
      data-weave-input-has-clear={hasClear ? 'true' : 'false'}
      data-weave-input-has-leading-icon={hasLeadingIcon ? 'true' : 'false'}
      data-weave-input-has-trailing-icon={hasTrailingIcon ? 'true' : 'false'}
    >
      {leadingIcon === undefined ? null : (
        <span className="weave-input__leading-icon" aria-hidden="true">
          {renderIconSource(leadingIcon, { size: 'small' })}
        </span>
      )}

      {input}

      {hasClear ? (
        <Button
          icon={closeIcon}
          variant="ghost"
          size="small"
          viewProps={{
            className: 'weave-input__clear',
            label: clearLabel,
            onPointerDown: (event) => {
              event.preventDefault()
            },
            onClick: clear,
          }}
        />
      ) : null}

      {trailingIcon === undefined ? null : (
        <span className="weave-input__trailing-icon" aria-hidden="true">
          {renderIconSource(trailingIcon, { size: 'small' })}
        </span>
      )}
    </span>
  )
}

interface MultilineInputHostProps {
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
  readOnly?: boolean
  required?: boolean
  name?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  viewProps?: MultilineInputViewProps
}

function MultilineInput({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  rows,
  readOnly,
  required,
  name,
  autoComplete,
  minLength,
  maxLength,
  viewProps = {},
}: MultilineInputHostProps) {
  const field = useFormFieldContext()
  const fieldRequired = field?.required === true
  const hostProps: ViewProps<HTMLTextAreaElement> = {
    ...viewProps,
    disabled,
    required: fieldRequired ? true : undefined,
    invalid: field?.invalid === true ? true : viewProps.invalid,
  }
  const themeClassName = useInputThemeClassName()
  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    hostProps,
    undefined,
    undefined,
    formFieldAssociationOverrides(field, viewProps.labelledBy, viewProps.describedBy),
  )
  const reset = useCallback(() => {
    if (value !== undefined && elementRef.current !== null) {
      elementRef.current.value = String(value ?? '')
    }
  }, [elementRef, value])

  useFormReset(elementRef, reset)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.currentTarget.value)
  }

  return (
    <>
      <textarea
        {...resolved.domProps}
        ref={elementRef}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        readOnly={readOnly}
        required={required === true || fieldRequired}
        name={name}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        data-weave-view=""
        data-weave-input=""
        data-weave-input-multiline=""
        data-weave-scroll-host=""
        data-weave-layout={resolved.layout}
        className={[
          'weave-input',
          'weave-input--multiline',
          'weave-scroll-host',
          themeClassName,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={inlineStyle}
      />

      <AutoScrollbar
        targetRef={elementRef}
        config={viewProps.scrollbar}
        overflowIntent={inputOverflowIntent(viewProps.style)}
      />
    </>
  )
}

export function Input(props: InputProps) {
  useInsertionEffect(ensureInputStylesheet, [])

  if (props.multiline) {
    return (
      <MultilineInput
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        rows={props.rows}
        readOnly={props.readOnly}
        required={props.required}
        name={props.name}
        autoComplete={props.autoComplete}
        minLength={props.minLength}
        maxLength={props.maxLength}
        viewProps={props.viewProps}
      />
    )
  }

  return (
    <SingleLineInput
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      placeholder={props.placeholder}
      disabled={props.disabled}
      type={props.type}
      readOnly={props.readOnly}
      required={props.required}
      name={props.name}
      autoComplete={props.autoComplete}
      minLength={props.minLength}
      maxLength={props.maxLength}
      pattern={props.pattern}
      clearable={props.clearable}
      clearLabel={props.clearLabel}
      leadingIcon={props.leadingIcon}
      trailingIcon={props.trailingIcon}
      viewProps={props.viewProps}
    />
  )
}
