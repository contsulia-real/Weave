import { useState } from 'react'
import type { DateRangePickerProps, DateRangeValue } from '../core/date-range-picker-types'
import { Button } from './Button'
import { Input } from './Input'
import { calendarIcon } from './internal/control-icons'
import { DateInput } from './internal/DateInput'
import { useDateLocalization } from './internal/date-localization'
import { Popover } from './Popover'

export function DateRangePicker({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  locale,
  disabled = false,
  placeholder,
}: DateRangePickerProps): import('react').JSX.Element {
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRangeValue | null>(defaultValue)
  const [draftStart, setDraftStart] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const { locale: resolvedLocale, messages } = useDateLocalization(locale)
  const resolvedValue = value === undefined ? uncontrolledValue : value
  const start = draftStart ?? resolvedValue?.[0] ?? ''
  const end = draftStart === null ? resolvedValue?.[1] : undefined
  const display =
    draftStart !== null
      ? draftStart
      : resolvedValue === null
        ? ''
        : `${resolvedValue[0]} – ${resolvedValue[1]}`

  const pickDay = (day: string) => {
    if (disabled) return
    if (draftStart === null) {
      setDraftStart(day)
      return
    }

    const next: DateRangeValue = day < draftStart ? [day, draftStart] : [draftStart, day]

    if (value === undefined) setUncontrolledValue(next)
    onChange?.(next)
    setDraftStart(null)
    setOpen(false)
  }

  return (
    <Input
      type="text"
      value={display}
      readOnly
      disabled={disabled}
      clearable={false}
      placeholder={placeholder ?? messages.chooseDateRange}
      trailingAction={
        <Popover
          open={open && !disabled}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setDraftStart(null)
          }}
          placement="bottom-left"
          viewProps={{ label: messages.chooseDateRange, lang: resolvedLocale }}
          content={
            <DateInput
              type="date"
              inline
              value={start}
              range={{ start, end }}
              onRangeSelect={pickDay}
              min={min}
              max={max}
              locale={locale}
            />
          }
        >
          <Button
            icon={calendarIcon}
            size="small"
            variant="ghost"
            disabled={disabled}
            viewProps={{
              className: 'weave-input__clear',
              label: messages.chooseDateRange,
            }}
          />
        </Popover>
      }
      viewProps={{
        label: messages.chooseDateRange,
        onClick: () => {
          if (!disabled) setOpen(true)
        },
        data: { 'weave-date-range-picker': '' },
      }}
    />
  )
}
