import type { ChangeEvent, CSSProperties, DragEvent, ReactNode } from 'react'
import { useCallback, useState } from 'react'
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
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { Button } from './Button'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { ColorInput } from './internal/ColorInput'
import { closeIcon } from './internal/control-icons'
import { DateInput } from './internal/DateInput'
import { FileInput } from './internal/FileInput'
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

function acceptsDroppedFile(file: File, accept?: string): boolean {
  if (!accept?.trim()) return true
  const rules = accept
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
  if (rules.length === 0) return true
  return rules.some((rule) => {
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
    return file.type.toLowerCase() === rule
  })
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
  min?: string
  max?: string
  step?: number | 'any'
  accept?: string
  multiple?: boolean
  dropzone?: boolean
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
  trailingAction?: ReactNode
  viewProps?: SingleLineInputViewProps
}

function SingleLineInput({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  type,
  min,
  max,
  step,
  accept,
  multiple,
  dropzone,
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
  trailingAction,
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
  const [draggingFile, setDraggingFile] = useState(false)
  const acceptsDrop = type === 'file' && dropzone === true && !disabled && !readOnly
  const currentText = controlled ? String(value ?? '') : uncontrolledText
  const hasClear = type !== 'file' && clearable && !disabled && !readOnly && currentText.length > 0
  const hasLeadingIcon = leadingIcon !== undefined
  const hasTrailingIcon = trailingIcon !== undefined
  const hasTrailingAction = trailingAction !== undefined
  const usesAdornmentRoot =
    (type !== 'file' && clearable) || hasLeadingIcon || hasTrailingIcon || hasTrailingAction
  const reset = useCallback(() => {
    const next = type === 'file' ? '' : String(controlled ? (value ?? '') : (defaultValue ?? ''))

    if (!controlled) {
      setUncontrolledText(next)
    }

    if (elementRef.current !== null) {
      elementRef.current.value = next
    }
  }, [controlled, defaultValue, elementRef, type, value])

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

  const handleFileDragOver = (event: DragEvent<HTMLElement>) => {
    if (!acceptsDrop || !event.dataTransfer.types.includes('Files')) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setDraggingFile(true)
  }

  const handleFileDrop = (event: DragEvent<HTMLElement>) => {
    if (!acceptsDrop || !event.dataTransfer.types.includes('Files')) return
    const input = elementRef.current
    if (input === null) return
    event.preventDefault()
    setDraggingFile(false)
    const incoming = Array.from(event.dataTransfer.files).filter((file) =>
      acceptsDroppedFile(file, accept),
    )
    if (incoming.length === 0) return
    const data = new DataTransfer()
    for (const file of multiple ? incoming : incoming.slice(0, 1)) data.items.add(file)
    input.files = data.files
    const ChangeEvent = input.ownerDocument.defaultView?.Event ?? Event
    input.dispatchEvent(new ChangeEvent('change', { bubbles: true }))
  }

  const input = (
    <input
      {...resolved.domProps}
      ref={elementRef}
      value={type === 'file' ? undefined : value}
      defaultValue={type === 'file' ? undefined : defaultValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
      min={min}
      max={max}
      step={step}
      accept={accept}
      multiple={multiple}
      readOnly={readOnly}
      required={nativeRequired}
      name={name}
      data-weave-file-drop-active={acceptsDrop && draggingFile ? 'true' : undefined}
      autoComplete={autoComplete}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      data-weave-view=""
      data-weave-input=""
      data-weave-input-has-clear={hasClear ? 'true' : undefined}
      data-weave-input-has-leading-icon={hasLeadingIcon ? 'true' : undefined}
      data-weave-input-has-trailing-icon={hasTrailingIcon ? 'true' : undefined}
      data-weave-input-has-trailing-action={hasTrailingAction ? 'true' : undefined}
      data-weave-layout={resolved.layout}
      className={['weave-input', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    />
  )

  if (!usesAdornmentRoot) {
    return input
  }

  const AdornmentRoot = hasTrailingAction ? 'div' : 'span'

  return (
    <AdornmentRoot
      className={['weave-input-root', themeClassName].filter(Boolean).join(' ')}
      onDragOver={acceptsDrop ? handleFileDragOver : undefined}
      onDragLeave={acceptsDrop ? () => setDraggingFile(false) : undefined}
      onDrop={acceptsDrop ? handleFileDrop : undefined}
      data-weave-input-root=""
      data-weave-input-root-fill={viewProps.width === 'fill' ? 'true' : undefined}
      data-weave-input-has-clear={hasClear ? 'true' : 'false'}
      data-weave-input-has-leading-icon={hasLeadingIcon ? 'true' : 'false'}
      data-weave-input-has-trailing-icon={hasTrailingIcon ? 'true' : 'false'}
      data-weave-input-has-trailing-action={hasTrailingAction ? 'true' : 'false'}
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

      {trailingAction === undefined ? null : (
        <div className="weave-input__trailing-action">{trailingAction}</div>
      )}

      {trailingIcon === undefined ? null : (
        <span className="weave-input__trailing-icon" aria-hidden="true">
          {renderIconSource(trailingIcon, { size: 'small' })}
        </span>
      )}
    </AdornmentRoot>
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

export function Input(props: InputProps): import('react').JSX.Element {
  useStaticStylesheet(ensureInputStylesheet)

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

  if (
    props.type === 'date' ||
    props.type === 'time' ||
    props.type === 'datetime-local' ||
    props.type === 'month' ||
    props.type === 'week'
  ) {
    return <DateInput {...props} type={props.type} InputHost={SingleLineInput} />
  }

  if (props.type === 'color') {
    return <ColorInput {...props} InputHost={SingleLineInput} />
  }

  if (props.type === 'file') {
    return <FileInput {...props} InputHost={SingleLineInput} />
  }

  return (
    <SingleLineInput
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      placeholder={props.placeholder}
      disabled={props.disabled}
      type={props.type}
      min={props.min}
      max={props.max}
      step={props.step}
      accept={props.accept}
      multiple={props.multiple}
      dropzone={props.dropzone}
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
      trailingAction={props.trailingAction}
      viewProps={props.viewProps}
    />
  )
}
