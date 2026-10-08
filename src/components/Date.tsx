import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import type { DateProps } from '../core/date-types'
import { Button } from './Button'
import { Column } from './Column'
import { Grid } from './Grid'
import { Input } from './Input'
import { assignRef } from './internal/assign-ref'
import { useDateLocalization } from './internal/date-localization'
import { useFormFieldContext } from './internal/form-field-context'
import { useFormReset } from './internal/use-form-reset'
import { Popover } from './Popover'
import { Row } from './Row'
import { Text } from './Text'

function parseDate(value: string): globalThis.Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const date = new globalThis.Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null
}

function calendarDate(month: number, day: number): globalThis.Date {
  const date = new globalThis.Date(0)
  date.setUTCFullYear(Math.floor(month / 12), month % 12, day)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

function dateString(date: globalThis.Date): string {
  return date.toISOString().slice(0, 10)
}

function monthOf(value: string): number {
  const date = parseDate(value) ?? new globalThis.Date()
  return date.getUTCFullYear() * 12 + date.getUTCMonth()
}

export function Date({
  value,
  defaultValue = '',
  onChange,
  min,
  max,
  disabled = false,
  readOnly = false,
  required,
  name,
  autoComplete,
  locale,
  viewProps = {},
}: DateProps): import('react').JSX.Element {
  const {
    locale: resolvedLocale,
    messages,
    firstWeekday,
    weekdays,
    monthFormatter,
    dayFormatter,
  } = useDateLocalization(locale)
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const currentValue = controlled ? value : uncontrolledValue
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => monthOf(value ?? defaultValue))
  const inputRef = useRef<HTMLInputElement>(null)
  const minValue = min !== undefined && parseDate(min) !== null ? min : undefined
  const maxValue = max !== undefined && parseDate(max) !== null ? max : undefined
  const field = useFormFieldContext()
  const fieldRequired = required === true || field?.required === true

  const reset = useCallback(() => {
    if (!controlled) setUncontrolledValue(defaultValue)
    setMonth(monthOf(controlled ? value : defaultValue))
    setOpen(false)
  }, [controlled, defaultValue, value])

  useFormReset(inputRef, reset)

  useEffect(() => {
    const input = inputRef.current
    if (input === null) return

    const invalid =
      currentValue !== '' &&
      (parseDate(currentValue) === null ||
        (minValue !== undefined && currentValue < minValue) ||
        (maxValue !== undefined && currentValue > maxValue))
    input.setCustomValidity(invalid ? messages.invalidDate : '')
  }, [currentValue, maxValue, minValue, messages.invalidDate])

  const changeOpen = (next: boolean) => {
    if (next && (disabled || readOnly)) return
    if (next) setMonth(monthOf(currentValue))
    setOpen(next)
  }

  const selectDate = (next: string) => {
    if (!controlled) setUncontrolledValue(next)
    if (next !== currentValue) onChange?.(next)
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    viewProps.onKeyDown?.(event)
    if (event.defaultPrevented || disabled || readOnly) return

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      changeOpen(true)
    } else if (
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete')
    ) {
      event.preventDefault()
    }
  }

  const firstDay = calendarDate(month, 1)
  const leadingDays = (firstDay.getUTCDay() - firstWeekday + 7) % 7
  const daysInMonth = calendarDate(month + 1, 0).getUTCDate()
  const canGoPrevious =
    month > 0 && (minValue === undefined || dateString(calendarDate(month, 0)) >= minValue)
  const canGoNext =
    month < 9999 * 12 + 11 &&
    (maxValue === undefined || dateString(calendarDate(month + 1, 1)) <= maxValue)

  return (
    <Popover
      open={open && !disabled && !readOnly}
      onOpenChange={changeOpen}
      placement="bottom-left"
      viewProps={{ label: messages.chooseDate, lang: resolvedLocale }}
      content={
        <Column gap={1} width={19}>
          <Row align="center" justify="space-between" gap={0.5}>
            <Button
              text="‹"
              variant="ghost"
              size="small"
              disabled={!canGoPrevious}
              viewProps={{
                label: messages.previousMonth,
                onClick: () => setMonth((current) => current - 1),
              }}
            />
            <Text typo="title-medium">{monthFormatter.format(firstDay)}</Text>
            <Button
              text="›"
              variant="ghost"
              size="small"
              disabled={!canGoNext}
              viewProps={{
                label: messages.nextMonth,
                onClick: () => setMonth((current) => current + 1),
              }}
            />
          </Row>
          <Grid columns={7} gap={0.25}>
            {weekdays.map((weekday, index) => (
              <Text
                key={index}
                typo="label-small"
                color="secondary"
                viewProps={{ style: { textAlign: 'center' } }}
              >
                {weekday}
              </Text>
            ))}
            {Array.from({ length: leadingDays }, (_, index) => (
              <Text key={`empty-${index}`}>{'\u00A0'}</Text>
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = calendarDate(month, index + 1)
              const dateValue = dateString(day)
              const outOfRange =
                (minValue !== undefined && dateValue < minValue) ||
                (maxValue !== undefined && dateValue > maxValue)
              return (
                <Button
                  key={dateValue}
                  text={index + 1}
                  size="small"
                  variant={currentValue === dateValue ? 'primary' : 'ghost'}
                  pressed={currentValue === dateValue}
                  disabled={outOfRange}
                  viewProps={{
                    width: 'fill',
                    minWidth: 0,
                    label: dayFormatter.format(day),
                    onClick: () => selectDate(dateValue),
                  }}
                />
              )
            })}
          </Grid>
          {!fieldRequired && currentValue !== '' ? (
            <Row justify="end">
              <Button
                text={messages.clear}
                size="small"
                variant="ghost"
                viewProps={{ onClick: () => selectDate('') }}
              />
            </Row>
          ) : null}
        </Column>
      }
    >
      <Input
        type="text"
        value={currentValue}
        clearable={false}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        name={name}
        autoComplete={autoComplete}
        viewProps={{
          ...viewProps,
          lang: resolvedLocale,
          cursor: disabled || readOnly ? undefined : 'pointer',
          inputMode: 'none',
          'aria-readonly': true,
          onBeforeInput: (event) => {
            viewProps.onBeforeInput?.(event)
            event.preventDefault()
          },
          onPaste: (event) => {
            viewProps.onPaste?.(event)
            event.preventDefault()
          },
          onDrop: (event) => {
            viewProps.onDrop?.(event)
            event.preventDefault()
          },
          ref: (node) => {
            inputRef.current = node
            assignRef(viewProps.ref, node)
          },
          onKeyDown: handleKeyDown,
        }}
      />
    </Popover>
  )
}
