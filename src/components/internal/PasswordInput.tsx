import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useCallback, useRef, useState } from 'react'
import type { InputProps } from '../../core/input-types'
import { Button } from '../Button'
import { assignRef } from './assign-ref'
import { useDateLocalization } from './date-localization'
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
  const { messages } = useDateLocalization()
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
            icon={revealed ? IconEyeOff : IconEye}
            variant="ghost"
            size="small"
            disabled={disabled}
            viewProps={{
              className: 'weave-password-input__toggle',
              label: revealed ? messages.hidePassword : messages.showPassword,
              onPointerDown: (event) => event.preventDefault(),
              onClick: () => setRevealed((current) => !current),
            }}
          />
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
