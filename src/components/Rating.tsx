import { IconStar, IconStarFilled } from '@tabler/icons-react'
import { type KeyboardEvent, type MouseEvent, useState } from 'react'
import type { ButtonSize } from '../core/button-types'
import type { IconSize } from '../core/icon-types'
import type { RatingProps } from '../core/rating-types'
import { useTheme } from '../theme/theme-context'
import { Button } from './Button'
import { Icon } from './Icon'
import { Row } from './Row'
import { View } from './View'

const iconSizes: Record<ButtonSize, IconSize> = {
  small: 'medium',
  medium: 'large',
  large: 'xlarge',
}

function normalizedValue(value: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value * 2) / 2)) : 0
}

function RatingStar({
  fraction,
  size,
  reducedMotion,
}: {
  fraction: number
  size: IconSize
  reducedMotion: boolean
}) {
  return (
    <Row position="relative" align="center" justify="center" pointerEvents="none">
      <Icon icon={IconStar} size={size} viewProps={{ color: 'secondary' }} />
      <View
        position="absolute"
        top={0}
        left={0}
        height="fill"
        width={`${fraction * 100}%`}
        overflow="hidden"
        pointerEvents="none"
        transition={reducedMotion ? undefined : { properties: ['width'], duration: 'normal' }}
      >
        <Icon icon={IconStarFilled} size={size} viewProps={{ color: 'primary' }} />
      </View>
    </Row>
  )
}

export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  size = 'large',
  readOnly = false,
  label = 'Rating',
  viewProps = {},
}: RatingProps): import('react').JSX.Element {
  const { theme, reducedMotion } = useTheme()
  const count = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 5
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const current = normalizedValue(value ?? uncontrolledValue, count)
  const dimension = theme.components.Button?.sizes?.[size]?.minHeight ?? 'fit'

  const select = (next: number) => {
    if (readOnly || next === current) return
    if (value === undefined) setUncontrolledValue(next)
    onChange?.(next)
  }

  const onClick = (event: MouseEvent<HTMLButtonElement>, star: number) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    select(star - (event.detail !== 0 && event.clientX - bounds.left < bounds.width / 2 ? 0.5 : 0))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.defaultPrevented) return
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? Math.min(count, current + 0.5)
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? Math.max(0.5, current - 0.5)
          : event.key === 'Home'
            ? 0.5
            : event.key === 'End'
              ? count
              : null
    if (next === null) return
    event.preventDefault()
    select(next)
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [Math.ceil(next) - 1]?.focus()
  }

  return (
    <Row
      {...viewProps}
      role={readOnly ? 'img' : 'radiogroup'}
      label={readOnly ? `${label}: ${current} of ${count}` : label}
      align="center"
      gap={0}
    >
      {Array.from({ length: count }, (_, index) => {
        const star = index + 1
        const fraction = Math.max(0, Math.min(1, current - index))
        const visual = (
          <RatingStar fraction={fraction} size={iconSizes[size]} reducedMotion={reducedMotion} />
        )

        return readOnly ? (
          <Row
            key={star}
            width={dimension}
            height={dimension}
            align="center"
            justify="center"
            aria-hidden="true"
          >
            {visual}
          </Row>
        ) : (
          <Button
            key={star}
            variant="ghost"
            size={size}
            viewProps={{
              width: dimension,
              minWidth: dimension,
              height: dimension,
              paddingX: 0,
              paddingY: 0,
              role: 'radio',
              checked: current > 0 && star === Math.ceil(current),
              label:
                star === Math.ceil(current)
                  ? `${current} of ${count}`
                  : `${star - 0.5} or ${star} of ${count}`,
              tabIndex: star === Math.ceil(current || 0.5) ? 0 : -1,
              onClick: (event) => onClick(event, star),
              onKeyDown,
            }}
          >
            {visual}
          </Button>
        )
      })}
    </Row>
  )
}
