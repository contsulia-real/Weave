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
  SelectOptionProps,
} from '../core/select-types'
import {
  ensureSelectStylesheet,
} from '../renderers/dom/select-stylesheet'
import {
  useTheme,
} from '../theme/theme-context'
import { Icon } from './Icon'
import {
  SelectContext,
} from './internal/select-context'
import { checkIcon } from './internal/control-icons'
import { renderIconSource } from './internal/render-icon-source'
import {
  selectOptionId,
} from './internal/select-navigation'
import { Text } from './Text'
import { View } from './View'

export function SelectOption({
  value,
  text,
  secondaryText,
  icon,
  disabled = false,
  viewProps = {},
}: SelectOptionProps) {
  const context =
    useContext(SelectContext)

  if (context === null) {
    throw new Error(
      'SelectOption must be rendered inside Select',
    )
  }

  const { theme } = useTheme()
  const optionTheme =
    theme.components.Select
      ?.option
  const selected =
    context.selectedValue ===
    value
  const active =
    context.activeValue ===
    value

  useInsertionEffect(
    ensureSelectStylesheet,
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

    context.setActiveValue(
      value,
    )
  }

  const handleClick = (
    event:
      MouseEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    viewProps.onClick?.(
      event,
    )

    if (
      event.defaultPrevented
    ) {
      return
    }

    context.selectValue(value)
  }

  return (
    <View
      {...viewProps}
      id={
        viewProps.id ??
        selectOptionId(
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
        'weave-select-option',
        viewProps.className,
      ].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-select-option':
          '',
        'weave-select-option-value':
          value,
        'weave-select-option-active':
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
                  'weave-select-option__icon',
                'aria-hidden': true,
              },
            },
          )}

      <View
        className="weave-select-option__text"
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
                    'weave-select-option__secondary',
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
            'weave-select-option__check',
          'aria-hidden': true,
          pointerEvents: 'none',
        }}
      />
    </View>
  )
}
