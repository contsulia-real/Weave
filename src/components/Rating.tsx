import { IconStar, IconStarFilled } from '@tabler/icons-react'
import { type KeyboardEvent, useState } from 'react'
import type { RatingProps } from '../core/rating-types'
import { Button } from './Button'
import { Icon } from './Icon'
import { Row } from './Row'

function normalizedValue(value: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value))) : 0
}

export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  readOnly = false,
  label = 'Rating',
  viewProps = {},
}: RatingProps): import('react').JSX.Element {
  const count = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 5
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const current = normalizedValue(value ?? uncontrolledValue, count)

  const select = (next: number) => {
    if (readOnly || next === current) return
    if (value === undefined) setUncontrolledValue(next)
    onChange?.(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.defaultPrevented) return
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? Math.min(count, index + 1)
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? Math.max(1, index - 1)
          : event.key === 'Home'
            ? 1
            : event.key === 'End'
              ? count
              : null
    if (next === null) return
    event.preventDefault()
    select(next)
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next - 1]?.focus()
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
        const selected = star <= current
        const icon = selected ? IconStarFilled : IconStar
        const color = selected ? 'primary' : 'secondary'

        return readOnly ? (
          <Row key={star} width={28} height={28} align="center" justify="center" aria-hidden="true">
            <Icon icon={icon} size="small" viewProps={{ color, width: 12, height: 12 }} />
          </Row>
        ) : (
          <Button
            key={star}
            icon={icon}
            variant="ghost"
            size="small"
            viewProps={{
              color,
              role: 'radio',
              checked: star === current,
              label: `${star} of ${count}`,
              tabIndex: star === (current || 1) ? 0 : -1,
              onClick: () => select(star),
              onKeyDown: (event) => onKeyDown(event, star),
            }}
          />
        )
      })}
    </Row>
  )
}
