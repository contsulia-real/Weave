import {
  createElement,
  useInsertionEffect,
  useState,
} from 'react'
import type {
  ChangeEvent,
  CSSProperties,
} from 'react'
import { resolveInput } from '../core/resolved-input'
import { resolveView } from '../core/resolved-view'
import type {
  InputProps,
  InputType,
  MultilineInputViewProps,
  SingleLineInputViewProps,
} from '../core/input-types'
import type { ViewProps } from '../core/view-types'
import { assertDiCViewPropsSupported } from '../renderers/dic/react-compat'
import { DIC_INPUT_HOST } from '../renderers/dic/react-host-types'
import { useWeaveRenderer } from '../renderers/renderer-context'
import { ensureInputStylesheet } from '../renderers/dom/input-stylesheet'
import { resolveInputTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { AutoScrollbar } from './internal/AutoScrollbar'
import { useViewHost } from './internal/use-view-host'

function cssString(
  value: CSSProperties['overflow'] | undefined,
): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function inputOverflowIntent(
  style: CSSProperties | undefined,
) {
  return {
    styleOverflow: cssString(style?.overflow),
    styleOverflowX: cssString(style?.overflowX),
    styleOverflowY: cssString(style?.overflowY),
  }
}

function useInputThemeClassName(): string | undefined {
  const { theme } = useTheme()

  return useRuntimeStyleClass(
    'input-theme',
    resolveInputTheme(theme),
  )
}

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
  const themeClassName = useInputThemeClassName()
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
      className={[
        'weave-input',
        themeClassName,
        className,
      ].filter(Boolean).join(' ')}
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
  const themeClassName = useInputThemeClassName()
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
    <>
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
        data-weave-scroll-host=""
        data-weave-layout={resolved.layout}
        className={[
          'weave-input',
          'weave-input--multiline',
          'weave-scroll-host',
          themeClassName,
          className,
        ].filter(Boolean).join(' ')}
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

function DOMInput(
  props: InputProps,
) {
  useInsertionEffect(
    ensureInputStylesheet,
    [],
  )

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

function stringValue(
  value: string | number | undefined,
): string {
  return value === undefined
    ? ''
    : String(value)
}

function DiCInput(
  props: InputProps,
) {
  const { theme } = useTheme()
  const input = resolveInput(props)
  const [uncontrolledValue, setUncontrolledValue] =
    useState(
      stringValue(
        props.defaultValue,
      ),
    )
  const controlled =
    props.value !== undefined
  const value =
    controlled
      ? stringValue(props.value)
      : uncontrolledValue

  const sourceView =
    props.viewProps ?? {}
  const hostProps:
    ViewProps<HTMLElement> = {
      ...sourceView,
      disabled: input.disabled,
      readOnly: input.readOnly,
      required: input.required,
    } as unknown as ViewProps<HTMLElement>

  assertDiCViewPropsSupported(
    hostProps,
    theme.breakpoints,
    'Input.viewProps',
  )

  const view = resolveView(
    hostProps,
    theme.breakpoints,
  )

  const commit = (
    nextValue: string,
  ) => {
    if (!controlled) {
      setUncontrolledValue(
        nextValue,
      )
    }

    props.onChange?.(
      nextValue,
    )
  }

  return createElement(
    DIC_INPUT_HOST,
    {
      view,
      input,
      theme,
      value,
      onChange: commit,
    },
  )
}

export function Input(
  props: InputProps,
) {
  const renderer = useWeaveRenderer()

  return renderer === 'dic'
    ? <DiCInput {...props} />
    : <DOMInput {...props} />
}
