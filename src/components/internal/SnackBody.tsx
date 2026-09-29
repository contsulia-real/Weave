import type { ReactNode } from 'react'
import type { SnackIcon } from '../../core/snack-types'
import type { TextTypo } from '../../core/text-types'
import { Button } from '../Button'
import { Text } from '../Text'
import { View } from '../View'
import { renderIconSource } from './render-icon-source'

function iconContent(icon: SnackIcon) {
  return (
    <View className="weave-snack__icon-shell" aria-hidden="true">
      {renderIconSource(icon, {
        size: 'small',
        stroke: 'regular',
        viewProps: {
          className: 'weave-snack__icon',
          'aria-hidden': true,
        },
      })}
    </View>
  )
}

interface SnackBodyProps {
  text: ReactNode
  icon?: SnackIcon
  action?: ReactNode
  onAction?: () => void
  typo?: TextTypo
  onRequestClose: () => void
}

export function SnackBody({ text, icon, action, onAction, typo, onRequestClose }: SnackBodyProps) {
  return (
    <>
      {icon === undefined ? null : iconContent(icon)}

      <Text
        typo={typo ?? 'body-medium'}
        viewProps={{
          className: 'weave-snack__message',
        }}
      >
        {text}
      </Text>

      {action === undefined || onAction === undefined ? null : (
        <Button
          text={action}
          size="small"
          variant="ghost"
          viewProps={{
            className: 'weave-snack__action',
            color: 'var(--weave-snack-accent)',
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
