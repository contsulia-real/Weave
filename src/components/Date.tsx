import { useCallback, useEffect, useRef, useState } from 'react'
import type { DateProps } from '../core/date-types'
import { Button } from './Button'
import { Column } from './Column'
import { Grid } from './Grid'
import { Input } from './Input'
import { assignRef } from './internal/assign-ref'
import { calendarIcon, chevronLeftIcon, chevronRightIcon } from './internal/control-icons'
import { useDateLocalization } from './internal/date-localization'
import { useFormFieldContext } from './internal/form-field-context'
import { useFormReset } from './internal/use-form-reset'
import { Popover } from './Popover'
import { Row } from './Row'
import { Text } from './Text'

type CalendarPanel = 'days' | 'months' | 'years'

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
    monthNameFormatter,
    monthShortFormatter,
    yearFormatter,
    dayFormatter,
  } = useDateLocalization(locale)
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const currentValue = controlled ? value : uncontrolledValue
  const [draft, setDraft] = useState<{ base: string; text: string } | null>(null)
  const inputValue = draft?.base === currentValue ? draft.text : currentValue
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => monthOf(value ?? defaultValue))
  const [panel, setPanel] = useState<CalendarPanel>('days')
  const inputRef = useRef<HTMLInputElement>(null)
  const minValue = min !== undefined && parseDate(min) !== null ? min : undefined
  const maxValue = max !== undefined && parseDate(max) !== null ? max : undefined
  const field = useFormFieldContext()
  const fieldRequired = required === true || field?.required === true

  const validDate = (next: string) =>
    parseDate(next) !== null &&
    (minValue === undefined || next >= minValue) &&
    (maxValue === undefined || next <= maxValue)

  const commitDate = (next: string) => {
    setDraft(null)
    if (!controlled) setUncontrolledValue(next)
    if (next !== currentValue) onChange?.(next)
  }

  const reset = useCallback(() => {
    if (!controlled) setUncontrolledValue(defaultValue)
    setDraft(null)
    setMonth(monthOf(controlled ? value : defaultValue))
    setPanel('days')
    setOpen(false)
  }, [controlled, defaultValue, value])

  useFormReset(inputRef, reset)

  useEffect(() => {
    const input = inputRef.current
    if (input === null) return

    const invalid =
      inputValue !== '' &&
      (parseDate(inputValue) === null ||
        (minValue !== undefined && inputValue < minValue) ||
        (maxValue !== undefined && inputValue > maxValue))
    input.setCustomValidity(invalid ? messages.invalidDate : '')
  }, [inputValue, maxValue, minValue, messages.invalidDate])

  const changeOpen = (next: boolean) => {
    if (next && (disabled || readOnly)) return
    if (next) {
      setMonth(monthOf(validDate(inputValue) ? inputValue : currentValue))
      setPanel('days')
    }
    setOpen(next)
  }

  const selectDate = (next: string) => {
    commitDate(next)
    setOpen(false)
  }

  const handleInputChange = (next: string) => {
    if (next === '' || validDate(next)) {
      commitDate(next)
    } else {
      setDraft({ base: currentValue, text: next })
    }
  }

  const firstDay = calendarDate(month, 1)
  const year = Math.floor(month / 12)
  const yearPage = Math.floor((Math.max(1, year) - 1) / 12) * 12 + 1
  const leadingDays = (firstDay.getUTCDay() - firstWeekday + 7) % 7
  const daysInMonth = calendarDate(month + 1, 0).getUTCDate()

  const availableMonth = (candidate: number) =>
    candidate >= 12 &&
    candidate < 10000 * 12 &&
    (minValue === undefined || dateString(calendarDate(candidate + 1, 0)) >= minValue) &&
    (maxValue === undefined || dateString(calendarDate(candidate, 1)) <= maxValue)

  const availableYear = (candidate: number) =>
    candidate >= 1 &&
    candidate <= 9999 &&
    (minValue === undefined || dateString(calendarDate((candidate + 1) * 12, 0)) >= minValue) &&
    (maxValue === undefined || dateString(calendarDate(candidate * 12, 1)) <= maxValue)

  const step = panel === 'days' ? 1 : panel === 'months' ? 12 : 144
  const navigationMonth = panel === 'years' ? yearPage * 12 : month
  const previous = navigationMonth - step
  const next = navigationMonth + step
  const canGoPrevious =
    panel === 'years'
      ? availableYear(Math.floor(previous / 12) + 11)
      : panel === 'months'
        ? availableYear(Math.floor(previous / 12))
        : availableMonth(previous)
  const canGoNext =
    panel === 'years'
      ? availableYear(Math.floor(next / 12))
      : panel === 'months'
        ? availableYear(Math.floor(next / 12))
        : availableMonth(next)

  const monthLabel = (candidate: number, short = false) =>
    (short ? monthShortFormatter : monthNameFormatter).format(calendarDate(candidate, 1))

  const header =
    panel === 'days' ? (
      <Row align="center" gap={0.25}>
        <Button
          text={monthLabel(month)}
          variant="ghost"
          size="small"
          viewProps={{ label: messages.chooseMonth, onClick: () => setPanel('months') }}
        />
        <Button
          text={yearFormatter.format(firstDay)}
          variant="ghost"
          size="small"
          viewProps={{ label: messages.chooseYear, onClick: () => setPanel('years') }}
        />
      </Row>
    ) : panel === 'months' ? (
      <Button
        text={yearFormatter.format(firstDay)}
        variant="ghost"
        size="small"
        viewProps={{ label: messages.chooseYear, onClick: () => setPanel('years') }}
      />
    ) : (
      <Text typo="title-medium">
        {yearFormatter.format(calendarDate(yearPage * 12, 1))} –{' '}
        {yearFormatter.format(calendarDate((yearPage + 11) * 12, 1))}
      </Text>
    )

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      clearable={false}
      readOnly={readOnly}
      disabled={disabled}
      required={required}
      name={name}
      autoComplete={autoComplete}
      trailingAction={
        <Popover
          open={open && !disabled && !readOnly}
          onOpenChange={changeOpen}
          placement="bottom-left"
          viewProps={{ label: messages.chooseDate, lang: resolvedLocale }}
          content={
            <Column gap={1} width={19}>
              <Row align="center" justify="space-between" gap={0.25}>
                <Button
                  icon={chevronLeftIcon}
                  variant="ghost"
                  size="small"
                  disabled={!canGoPrevious}
                  viewProps={{
                    label:
                      panel === 'years'
                        ? messages.previousYears
                        : panel === 'months'
                          ? messages.previousYear
                          : messages.previousMonth,
                    onClick: () =>
                      setMonth((current) =>
                        panel === 'years' ? (yearPage - 12) * 12 : current - step,
                      ),
                  }}
                />
                {header}
                <Button
                  icon={chevronRightIcon}
                  variant="ghost"
                  size="small"
                  disabled={!canGoNext}
                  viewProps={{
                    label:
                      panel === 'years'
                        ? messages.nextYears
                        : panel === 'months'
                          ? messages.nextYear
                          : messages.nextMonth,
                    onClick: () =>
                      setMonth((current) =>
                        panel === 'years' ? (yearPage + 12) * 12 : current + step,
                      ),
                  }}
                />
              </Row>
              {panel === 'days' ? (
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
              ) : panel === 'months' ? (
                <Grid columns={3} gap={0.25}>
                  {Array.from({ length: 12 }, (_, index) => {
                    const candidate = year * 12 + index
                    return (
                      <Button
                        key={candidate}
                        text={monthLabel(candidate, true)}
                        size="small"
                        variant={candidate === month ? 'primary' : 'ghost'}
                        disabled={!availableMonth(candidate)}
                        viewProps={{
                          minWidth: 0,
                          width: 'fill',
                          label: monthLabel(candidate),
                          onClick: () => {
                            setMonth(candidate)
                            setPanel('days')
                          },
                        }}
                      />
                    )
                  })}
                </Grid>
              ) : (
                <Grid columns={3} gap={0.25}>
                  {Array.from({ length: 12 }, (_, index) => {
                    const candidate = yearPage + index
                    return (
                      <Button
                        key={candidate}
                        text={candidate}
                        size="small"
                        variant={candidate === year ? 'primary' : 'ghost'}
                        disabled={!availableYear(candidate)}
                        viewProps={{
                          width: 'fill',
                          minWidth: 0,
                          onClick: () => {
                            setMonth(candidate * 12 + (month % 12))
                            setPanel('months')
                          },
                        }}
                      />
                    )
                  })}
                </Grid>
              )}
              {!fieldRequired && inputValue !== '' ? (
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
          <Button
            icon={calendarIcon}
            size="small"
            variant="ghost"
            disabled={disabled || readOnly}
            viewProps={{ label: messages.chooseDate }}
          />
        </Popover>
      }
      viewProps={{
        ...viewProps,
        lang: resolvedLocale,
        ref: (node) => {
          inputRef.current = node
          assignRef(viewProps.ref, node)
        },
      }}
    />
  )
}
