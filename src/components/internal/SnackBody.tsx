import {
  isValidElement,
  type ReactNode,
} from 'react'
import type {
  IconComponent,
  IconSvg,
} from '../../core/icon-types'
import type {
  SnackIcon,
} from '../../core/snack-types'
import type {
  TextTypo,
} from '../../core/text-types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Text } from '../Text'
import { View } from '../View'

function iconContent(
  icon: SnackIcon,
) {
  const renderedIcon =
    isValidElement(icon) ? (
      <Icon
        svg={icon as IconSvg}
        size="small"
        stroke="regular"
        viewProps={{
          className:
            'weave-snack__icon',
          'aria-hidden': true,
        }}
      />
    ) : (
      <Icon
        icon={icon as IconComponent}
        size="small"
        stroke="regular"
        viewProps={{
          className:
            'weave-snack__icon',
          'aria-hidden': true,
        }}
      />
    )

  return (
    <View
      className="weave-snack__icon-shell"
      aria-hidden="true"
    >
      {renderedIcon}
    </View>
  )
}

export interface SnackBodyProps {
  text: ReactNode
  icon?: SnackIcon
  action?: ReactNode
  onAction?: () => void
  typo?: TextTypo
  onRequestClose: () => void
}

export function SnackBody({
  text,
  icon,
  action,
  onAction,
  typo,
  onRequestClose,
}: SnackBodyProps) {
  return (
    <>
      {icon === undefined
        ? null
        : iconContent(icon)}

      <Text
        typo={typo ?? 'body-medium'}
        viewProps={{
          className:
            'weave-snack__message',
        }}
      >
        {text}
      </Text>

      {action === undefined ||
      onAction === undefined
        ? null
        : (
            <Button
              text={action}
              size="small"
              variant="ghost"
              viewProps={{
                className:
                  'weave-snack__action',
                color:
                  'var(--weave-snack-accent)',
                onClick: () => {
                  onAction()
                  onRequestClose()
                },
              }}
            />
          )}
    </>
  )
}
