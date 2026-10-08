import { type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import type { SelectIcon, SelectOptionViewProps } from '../../core/select-types'
import { useStaticStylesheet } from '../../renderers/dom/static-stylesheet'
import type { SelectThemeOption } from '../../theme/theme-types'
import { Icon } from '../Icon'
import { Text } from '../Text'
import { View } from '../View'
import { checkIcon } from './control-icons'
import type { OptionContextValue } from './option-context'
import { optionDomId } from './option-navigation'
import { renderIconSource } from './render-icon-source'

interface OptionItemProps {
  component: 'select' | 'combobox'
  value: string
  text: ReactNode
  secondaryText?: ReactNode
  icon?: SelectIcon
  disabled: boolean
  viewProps: SelectOptionViewProps
  context: OptionContextValue
  optionTheme: SelectThemeOption | undefined
  ensureStylesheet(): void
}

export function OptionItem({
  component,
  value,
  text,
  secondaryText,
  icon,
  disabled,
  viewProps,
  context,
  optionTheme,
  ensureStylesheet,
}: OptionItemProps) {
  useStaticStylesheet(ensureStylesheet)

  const selected = context.selectedValue === value
  const active = context.activeValue === value
  const prefix = 'weave-' + component + '-option'

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    viewProps.onPointerDown?.(event)

    if (!event.defaultPrevented && !disabled) {
      event.preventDefault()
    }
  }

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    viewProps.onPointerEnter?.(event)

    if (event.defaultPrevented || disabled) {
      return
    }

    context.setActiveValue(value)
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
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
      id={viewProps.id ?? optionDomId(context.listboxId, value)}
      role="option"
      selected={selected}
      disabled={disabled ? true : undefined}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onClick={handleClick}
      className={['weave-option', prefix, viewProps.className].filter(Boolean).join(' ')}
      data={{
        ...viewProps.data,
        'weave-option': '',
        'weave-option-value': value,
        'weave-option-active': active ? 'true' : 'false',
        [prefix]: '',
        [prefix + '-value']: value,
        [prefix + '-active']: active ? 'true' : 'false',
      }}
    >
      {icon === undefined
        ? null
        : renderIconSource(icon, {
            size: 'small',
            stroke: 'regular',
            viewProps: {
              className: ['weave-option__icon', prefix + '__icon'].join(' '),
              'aria-hidden': true,
            },
          })}

      <View className={['weave-option__text', prefix + '__text'].join(' ')}>
        <Text typo={optionTheme?.primaryTypo ?? 'body-medium'}>{text}</Text>

        {secondaryText === undefined ? null : (
          <Text
            typo={optionTheme?.secondaryTypo ?? 'body-small'}
            viewProps={{
              className: ['weave-option__secondary', prefix + '__secondary'].join(' '),
            }}
          >
            {secondaryText}
          </Text>
        )}
      </View>

      <Icon
        svg={checkIcon}
        size="small"
        stroke="regular"
        viewProps={{
          className: ['weave-option__check', prefix + '__check'].join(' '),
          'aria-hidden': true,
          pointerEvents: 'none',
        }}
      />
    </View>
  )
}
