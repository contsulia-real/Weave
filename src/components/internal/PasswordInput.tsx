import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useCallback, useRef, useState } from 'react'
import type { InputProps } from '../../core/input-types'
import { resolveSelectTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { useTheme } from '../../theme/theme-context'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { assignRef } from './assign-ref'
import { useFormReset } from './use-form-reset'

type SingleLineProps = Extract<InputProps, { multiline?: false }>
type PasswordInputProps = SingleLineProps & {
  InputHost: (props: SingleLineProps) => import('react').JSX.Element
}

export function PasswordInput({
  InputHost,
  disabled,
  mask,
  ...props
}: PasswordInputProps): import('react').JSX.Element {
  const [revealed, setRevealed] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState(String(props.defaultValue ?? ''))
  const inputRef = useRef<HTMLInputElement>(null)
  const resetDisplay = useCallback(
    () => setUncontrolledValue(String(props.defaultValue ?? '')),
    [props.defaultValue],
  )
  useFormReset(inputRef, resetDisplay)
  const customMask = mask !== undefined && mask.length > 0 && !revealed
  const actualValue = props.value === undefined ? uncontrolledValue : String(props.value ?? '')

  const { theme } = useTheme()
  const selectThemeClassName = useRuntimeStyleClass('select-theme', resolveSelectTheme(theme))

  return (
    <InputHost
      {...props}
      type={revealed ? 'text' : 'password'}
      disabled={disabled}
      onChange={(next) => {
        setUncontrolledValue(next)
        props.onChange?.(next)
      }}
      trailingAction={
        <>
          {customMask ? (
            <span className="weave-password-input__mask" aria-hidden="true">
              {mask.repeat(Array.from(actualValue).length)}
            </span>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="small"
            disabled={disabled}
            viewProps={{
              className: ['weave-password-input__toggle', selectThemeClassName]
                .filter(Boolean)
                .join(' '),
              label: revealed ? 'Hide password' : 'Show password',
              onPointerDown: (event) => event.preventDefault(),
              onClick: () => setRevealed((current) => !current),
            }}
          >
            <Icon
              icon={revealed ? IconEyeOff : IconEye}
              size="small"
              stroke="regular"
              viewProps={{
                className: 'weave-password-input__icon',
                'aria-hidden': true,
              }}
            />
          </Button>
        </>
      }
      viewProps={{
        ...props.viewProps,
        className: [
          'weave-password-input',
          customMask ? 'weave-password-input--masked' : undefined,
          props.viewProps?.className,
        ]
          .filter(Boolean)
          .join(' '),
        ref: (node) => {
          inputRef.current = node
          assignRef(props.viewProps?.ref, node)
        },
      }}
    />
  )
}
