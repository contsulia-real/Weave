import { isValidElement, type ReactElement } from 'react'
import type { IconComponent, IconProps, IconSvg } from '../../core/icon-types'
import { Icon } from '../Icon'

type IconSource = IconComponent | IconSvg

export function renderIconSource(
  source: IconSource,
  props: Omit<IconProps, 'icon' | 'svg'>,
): ReactElement {
  if (isValidElement(source)) {
    return <Icon {...props} svg={source as IconSvg} />
  }

  return <Icon {...props} icon={source as IconComponent} />
}
