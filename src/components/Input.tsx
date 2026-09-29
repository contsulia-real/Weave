import type { ChangeEvent, CSSProperties } from 'react'
import { useInsertionEffect, useState } from 'react'
import type {
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
  viewProps = {},
}: SingleLineInputHostProps) {
  const hostProps: ViewProps<HTMLInputElement> = {
    ...viewProps,
    disabled,
  }
  const themeClassName = useInputThemeClassName()
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)
  const controlled = value !== undefined
  const [uncontrolledText, setUncontrolledText] = useState(String(defaultValue ?? ''))
  const currentText = controlled ? String(value ?? '') : uncontrolledText
  const hasClear = clearable && !disabled && !readOnly && currentText.length > 0

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
      required={required}
      name={name}
      autoComplete={autoComplete}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      data-weave-view=""
      data-weave-input=""
      data-weave-input-has-clear={hasClear ? 'true' : undefined}
      data-weave-layout={resolved.layout}
      className={['weave-input', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
  )

  if (!clearable) {
    return input
  }

  return (
    <span
      className={['weave-input-root', themeClassName].filter(Boolean).join(' ')}
      data-weave-input-root=""
      data-weave-input-root-fill={viewProps.width === 'fill' ? 'true' : undefined}
      data-weave-input-has-clear={hasClear ? 'true' : 'false'}
    >
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
  const hostProps: ViewProps<HTMLTextAreaElement> = {
    ...viewProps,
    disabled,
  }
  const themeClassName = useInputThemeClassName()
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

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
        required={required}
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
      viewProps={props.viewProps}
    />
  )
}
