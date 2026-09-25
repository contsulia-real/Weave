import type {
  ChangeEvent,
  InputHTMLAttributes,
} from 'react'
import type {
  InputProps,
  MultilineInputViewProps,
  SingleLineInputViewProps,
} from '../core/input-types'
import type { ViewProps } from '../core/view-types'
import { useViewHost } from './internal/use-view-host'

interface SingleLineInputHostProps {
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
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
    mergedStyle,
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
      className={className}
      style={mergedStyle}
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
    mergedStyle,
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
      className={className}
      style={mergedStyle}
    />
  )
}

export function Input(props: InputProps) {
  if (props.multiline) {
    const {
      multiline: _multiline,
      pattern: _pattern,
      ...rest
    } = props

    return <MultilineInput {...rest} />
  }

  const {
    multiline: _multiline,
    rows: _rows,
    ...rest
  } = props

  return <SingleLineInput {...rest} />
}
