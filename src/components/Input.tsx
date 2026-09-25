import { useInsertionEffect } from 'react'
import type { ChangeEvent } from 'react'
import type {
  InputProps,
  InputType,
  MultilineInputViewProps,
  SingleLineInputViewProps,
} from '../core/input-types'
import type { ViewProps } from '../core/view-types'
import { ensureInputStylesheet } from '../renderers/dom/input-stylesheet'
import { useViewHost } from './internal/use-view-host'

interface SingleLineInputHostProps {
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  type?: InputType
  readOnly?: boolean
  required?: boolean
  name?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  viewProps?: SingleLineInputViewProps
}

function SingleLineInput({
  value,
  defaultValue,
  onChange,
  placeholder,
  type,
  readOnly,
  required,
  name,
  autoComplete,
  minLength,
  maxLength,
  pattern,
  viewProps = {},
}: SingleLineInputHostProps) {
  const hostProps: ViewProps<HTMLInputElement> = viewProps
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.currentTarget.value)
  }

  return (
    <input
      {...resolved.domProps}
      ref={elementRef}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder={placeholder}
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
      data-weave-layout={resolved.layout}
      className={['weave-input', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
  )
}

interface MultilineInputHostProps {
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string) => void
  placeholder?: string
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
  rows,
  readOnly,
  required,
  name,
  autoComplete,
  minLength,
  maxLength,
  viewProps = {},
}: MultilineInputHostProps) {
  const hostProps: ViewProps<HTMLTextAreaElement> = viewProps
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.currentTarget.value)
  }

  return (
    <textarea
      {...resolved.domProps}
      ref={elementRef}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder={placeholder}
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
      data-weave-layout={resolved.layout}
      className={[
        'weave-input',
        'weave-input--multiline',
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
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
      type={props.type}
      readOnly={props.readOnly}
      required={props.required}
      name={props.name}
      autoComplete={props.autoComplete}
      minLength={props.minLength}
      maxLength={props.maxLength}
      pattern={props.pattern}
      viewProps={props.viewProps}
    />
  )
}
