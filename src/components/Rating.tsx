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
  small: 'large',
  medium: 'xlarge',
  large: 'xlarge',
}

const starSizes: Record<ButtonSize, number> = {
  small: 20,
  medium: 24,
  large: 28,
}

function normalizedValue(value: number, max: number, allowHalf: boolean): number {
  const divisor = allowHalf ? 2 : 1
  return Number.isFinite(value)
    ? Math.min(max, Math.max(0, Math.round(value * divisor) / divisor))
    : 0
}

function RatingStar({
  fraction,
  size,
  pixels,
  duration,
  delay,
  reducedMotion,
}: {
  fraction: number
  size: IconSize
  pixels: number
  duration: string
  delay: string
  reducedMotion: boolean
}) {
  return (
    <Row position="relative" align="center" justify="center" pointerEvents="none">
      <Icon
        icon={IconStar}
        size={size}
        viewProps={{ color: 'secondary', width: pixels, height: pixels }}
      />
      <View
        layout="flex"
        align="start"
        position="absolute"
        top={0}
        left={0}
        height="fill"
        width={`${fraction * 100}%`}
        overflow="hidden"
        pointerEvents="none"
        transition={reducedMotion ? undefined : { properties: ['width'], duration, delay }}
      >
        <Icon
          icon={IconStarFilled}
          size={size}
          viewProps={{ color: 'primary', width: pixels, height: pixels }}
        />
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
  allowHalf = false,
  readOnly = false,
  label = 'Rating',
  viewProps = {},
}: RatingProps): import('react').JSX.Element {
  const { theme, reducedMotion } = useTheme()
  const count = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 5
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const current = normalizedValue(value ?? uncontrolledValue, count, allowHalf)
  const [transitionValues, setTransitionValues] = useState({ from: current, to: current })
  if (transitionValues.to !== current) {
    setTransitionValues({ from: transitionValues.to, to: current })
  }
  const from = transitionValues.from
  const changedStars = Math.ceil(Math.max(current, from)) - Math.floor(Math.min(current, from))
  const duration =
    changedStars > 0 ? `calc(var(--weave-motion-duration-normal) / ${changedStars})` : 'normal'
  const baseDimension = theme.components.Button?.sizes?.[size]?.minHeight
  const dimension =
    typeof baseDimension === 'number'
      ? baseDimension + 4
      : typeof baseDimension === 'string'
        ? `calc(${baseDimension} + 4px)`
        : 'fit'

  const select = (next: number) => {
    if (readOnly || next === current) return
    if (value === undefined) setUncontrolledValue(next)
    onChange?.(next)
  }

  const onClick = (event: MouseEvent<HTMLButtonElement>, star: number) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    select(
      star -
        (allowHalf && event.detail !== 0 && event.clientX - bounds.left < bounds.width / 2
          ? 0.5
          : 0),
    )
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.defaultPrevented) return
    const step = allowHalf ? 0.5 : 1
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? Math.min(count, current + step)
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? Math.max(step, current - step)
          : event.key === 'Home'
            ? step
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
        const previousFraction = Math.max(0, Math.min(1, from - index))
        const stage = current > from ? index - Math.floor(from) : Math.ceil(from) - 1 - index
        const delay =
          reducedMotion || fraction === previousFraction || stage <= 0
            ? '0ms'
            : `calc(var(--weave-motion-duration-normal) * ${stage} / ${changedStars})`
        const visual = (
          <RatingStar
            fraction={fraction}
            size={iconSizes[size]}
            pixels={starSizes[size]}
            duration={duration}
            delay={delay}
            reducedMotion={reducedMotion}
          />
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
                  : allowHalf
                    ? `${star - 0.5} or ${star} of ${count}`
                    : `${star} of ${count}`,
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
