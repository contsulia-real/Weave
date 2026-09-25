import {
  useInsertionEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { SwitchProps } from '../core/switch-types'
import { ensureSwitchStylesheet } from '../renderers/dom/switch-stylesheet'
import { View } from './View'

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  size = 'medium',
  viewProps = {},
}: SwitchProps) {
  useInsertionEffect(ensureSwitchStylesheet, [])

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

  const toggle = () => commit(!currentChecked)

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
      role="switch"
      checked={currentChecked}
      focusable={viewProps.focusable ?? true}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data={{
        ...viewProps.data,
        weaveSwitch: '',
        weaveSwitchSize: size,
      }}
    >
      <View
        data={{
          weaveSwitchThumb: '',
        }}
      />
    </View>
  )
}
