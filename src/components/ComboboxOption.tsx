import {
  useContext,
  useInsertionEffect,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import type {
  IconSvg,
} from '../core/icon-types'
import type {
  ComboboxOptionProps,
} from '../core/combobox-types'
import {
  ensureComboboxStylesheet,
} from '../renderers/dom/combobox-stylesheet'
import {
  useTheme,
} from '../theme/theme-context'
import { Icon } from './Icon'
import {
  ComboboxContext,
} from './internal/combobox-context'
import { checkIcon } from './internal/control-icons'
import { renderIconSource } from './internal/render-icon-source'
import {
  optionDomId,
} from './internal/option-navigation'
import { Text } from './Text'
import { View } from './View'

export function ComboboxOption({
  value,
  text,
  secondaryText,
  icon,
  disabled = false,
  viewProps = {},
}: ComboboxOptionProps) {
  const context =
    useContext(ComboboxContext)

  if (context === null) {
    throw new Error(
      'ComboboxOption must be rendered inside Combobox',
    )
  }

  const { theme } = useTheme()
  const optionTheme =
    theme.components.Combobox
      ?.option
  const selected =
    context.selectedValue ===
    value
  const active =
    context.activeValue ===
    value

  useInsertionEffect(
    ensureComboboxStylesheet,
    [],
  )

  const handlePointerDown = (
    event:
      PointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerDown?.(
      event,
    )

    if (
      !event.defaultPrevented &&
      !disabled
    ) {
      event.preventDefault()
    }
  }

  const handlePointerEnter = (
    event:
      PointerEvent<HTMLDivElement>,
  ) => {
    viewProps.onPointerEnter?.(
      event,
    )

    if (
      event.defaultPrevented ||
      disabled
    ) {
      return
    }

    context.setActiveValue(value)
  }

  const handleClick = (
    event:
      MouseEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    viewProps.onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    context.selectValue(value)
  }

  return (
    <View
      {...viewProps}
      id={
        viewProps.id ??
        optionDomId(
          context.listboxId,
          value,
        )
      }
      role="option"
      selected={selected}
      disabled={
        disabled
          ? true
          : undefined
      }
      onPointerDown={
        handlePointerDown
      }
      onPointerEnter={
        handlePointerEnter
      }
      onClick={handleClick}
      className={[
        'weave-combobox-option',
        viewProps.className,
      ].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-combobox-option':
          '',
        'weave-combobox-option-value':
          value,
        'weave-combobox-option-active':
          active
            ? 'true'
            : 'false',
      }}
    >
      {icon === undefined
        ? null
        : renderIconSource(
            icon,
            {
              size: 'small',
              stroke: 'regular',
              viewProps: {
                className:
                  'weave-combobox-option__icon',
                'aria-hidden': true,
              },
            },
          )}

      <View
        className="weave-combobox-option__text"
      >
        <Text
          typo={
            optionTheme
              ?.primaryTypo ??
            'body-medium'
          }
        >
          {text}
        </Text>

        {secondaryText ===
        undefined
          ? null
          : (
              <Text
                typo={
                  optionTheme
                    ?.secondaryTypo ??
                  'body-small'
                }
                viewProps={{
                  className:
                    'weave-combobox-option__secondary',
                }}
              >
                {secondaryText}
              </Text>
            )}
      </View>

      <Icon
        svg={checkIcon as IconSvg}
        size="small"
        stroke="regular"
        viewProps={{
          className:
            'weave-combobox-option__check',
          'aria-hidden': true,
          pointerEvents: 'none',
        }}
      />
    </View>
  )
}
