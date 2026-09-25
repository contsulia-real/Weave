import {
  useInsertionEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { SwitchProps } from '../core/switch-types'
import { resolveSwitchTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { ensureSwitchStylesheet } from '../renderers/dom/switch-stylesheet'
import { useTheme } from '../theme/theme-context'
import { View } from './View'

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  size = 'medium',
  viewProps = {},
}: SwitchProps) {
  useInsertionEffect(ensureSwitchStylesheet, [])

  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'switch-theme',
    resolveSwitchTheme(theme, size),
  )

  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked)
  const isControlled = checked !== undefined
  const currentChecked = checked ?? uncontrolledChecked

  const commit = (nextChecked: boolean) => {
    if (!isControlled) {
      setUncontrolledChecked(nextChecked)
    }
    onChange?.(nextChecked)
  }

  const toggle = () => {
    if (viewProps.disabled) return
    commit(!currentChecked)
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    viewProps.onClick?.(event)
    if (!event.defaultPrevented) toggle()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    viewProps.onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <View
      {...viewProps}
      className={[
        'weave-switch',
        `weave-switch--${size}`,
        themeClassName,
        viewProps.className,
      ].filter(Boolean).join(' ')}
      role="switch"
      checked={currentChecked}
      focusable={viewProps.focusable ?? true}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data={{
        ...viewProps.data,
        'weave-switch': '',
        'weave-switch-size': size,
      }}
    >
      <View
        className="weave-switch__thumb"
        data={{
          'weave-switch-thumb': '',
        }}
      />
    </View>
  )
}
