import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useState } from 'react'
import type { InputProps } from '../../core/input-types'
import { resolveSelectTheme } from '../../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../../renderers/dom/runtime-class'
import { useTheme } from '../../theme/theme-context'
import { Button } from '../Button'
import { Icon } from '../Icon'

type SingleLineProps = Extract<InputProps, { multiline?: false }>
type PasswordInputProps = SingleLineProps & {
  InputHost: (props: SingleLineProps) => import('react').JSX.Element
}

export function PasswordInput({
  InputHost,
  disabled,
  ...props
}: PasswordInputProps): import('react').JSX.Element {
  const [revealed, setRevealed] = useState(false)
  const { theme } = useTheme()
  const selectThemeClassName = useRuntimeStyleClass('select-theme', resolveSelectTheme(theme))

  return (
    <InputHost
      {...props}
      type={revealed ? 'text' : 'password'}
      disabled={disabled}
      trailingAction={
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
      }
      viewProps={{
        ...props.viewProps,
        className: ['weave-password-input', props.viewProps?.className].filter(Boolean).join(' '),
      }}
    />
  )
}
