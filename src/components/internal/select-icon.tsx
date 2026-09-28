import {
  isValidElement,
} from 'react'
import type {
  SelectIcon,
} from '../../core/select-types'
import type {
  IconComponent,
  IconSvg,
} from '../../core/icon-types'
import { Icon } from '../Icon'

export function selectIcon(
  icon: SelectIcon,
  className: string,
) {
  if (isValidElement(icon)) {
    return (
      <Icon
        svg={icon as IconSvg}
        size="small"
        stroke="regular"
        viewProps={{
          className,
          'aria-hidden': true,
        }}
      />
    )
  }

  return (
    <Icon
      icon={icon as IconComponent}
      size="small"
      stroke="regular"
      viewProps={{
        className,
        'aria-hidden': true,
      }}
    />
  )
}
