import { useCallback, useRef, useState } from 'react'
import type { InputProps, InputType } from '../../core/input-types'
import { Button } from '../Button'
import { Column } from '../Column'
import { Grid } from '../Grid'
import { Popover } from '../Popover'
import { Row } from '../Row'
import { Text } from '../Text'
import { assignRef } from './assign-ref'
import { calendarIcon, chevronLeftIcon, chevronRightIcon, clockIcon } from './control-icons'
import { useDateLocalization } from './date-localization'
import { useFormFieldContext } from './form-field-context'
import { useFormReset } from './use-form-reset'

type SingleLineProps = Extract<InputProps, { multiline?: false }>
type TemporalType = Extract<InputType, 'date' | 'time' | 'datetime-local' | 'month' | 'week'>
type TemporalInputProps = SingleLineProps & {
  type: TemporalType
  InputHost: (props: SingleLineProps) => import('react').JSX.Element
}
type Panel = 'days' | 'months' | 'years' | 'hours' | 'minutes' | 'seconds'

function calendarDate(month: number, day: number): globalThis.Date {
  const date = new globalThis.Date(0)
  date.setUTCFullYear(Math.floor(month / 12), month % 12, day)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

function dateString(date: globalThis.Date): string {
  return date.toISOString().slice(0, 10)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function weekStart(value: string): globalThis.Date | null {
  const match = /^(\d{4})-W(\d{2})$/.exec(value)
  if (!match) return null
  const jan4 = calendarDate(Number(match[1]) * 12, 4)
  const monday = calendarDate(
    jan4.getUTCFullYear() * 12 + jan4.getUTCMonth(),
    4 - ((jan4.getUTCDay() + 6) % 7) + (Number(match[2]) - 1) * 7,
  )
  return isoWeek(monday) === value ? monday : null
}

function isoWeek(date: globalThis.Date): string {
  const thursday = new globalThis.Date(date)
  thursday.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7))
  const year = thursday.getUTCFullYear()
  const jan4 = calendarDate(year * 12, 4)
  const firstThursday = new globalThis.Date(jan4)
  firstThursday.setUTCDate(jan4.getUTCDate() + 3 - ((jan4.getUTCDay() + 6) % 7))
  const week = 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 86400000))
  return `${year}-W${pad(week)}`
}

function monthOf(value: string, type: TemporalType): number {
  const yearMonth = /^(\d{4})-(\d{2})/.exec(value)
  if (type === 'week') {
    const start = weekStart(value)
    if (start) return start.getUTCFullYear() * 12 + start.getUTCMonth()
  } else if (yearMonth && Number(yearMonth[2]) >= 1 && Number(yearMonth[2]) <= 12) {
    return Number(yearMonth[1]) * 12 + Number(yearMonth[2]) - 1
  }
  const today = new globalThis.Date()
  return today.getUTCFullYear() * 12 + today.getUTCMonth()
}

function timeOf(value: string, type: TemporalType): [number, number, number] {
  const text = type === 'datetime-local' ? (value.split('T')[1] ?? '') : value
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?/.exec(text)
  if (!match) return [0, 0, 0]
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)]
}

function initialPanel(type: TemporalType): Panel {
  return type === 'month' ? 'months' : type === 'time' ? 'hours' : 'days'
}

function timeMilliseconds(text: string): number | null {
  const match = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(text)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3] ?? 0)
  if (hours > 23 || minutes > 59 || seconds > 59) return null
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + Number((match[4] ?? '').padEnd(3, '0'))
}

function numericValue(type: TemporalType, value: string): number | null {
  if (type === 'time') return timeMilliseconds(value)
  if (type === 'week') return weekStart(value)?.getTime() ?? null
  if (type === 'month') {
    const match = /^(\d{4})-(\d{2})$/.exec(value)
    const month = Number(match?.[2])
    return match && month >= 1 && month <= 12 ? Number(match[1]) * 12 + month - 1 : null
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(.+))?$/.exec(value)
  if (!match) return null
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const date = calendarDate(Number(match[1]) * 12 + month - 1, day)
  if (dateString(date) !== value.slice(0, 10)) return null
  if (type === 'date') return match[4] === undefined ? date.getTime() : null
  const time = timeMilliseconds(match[4] ?? '')
  return time === null ? null : date.getTime() + time
}

function optionAllowed(
  type: TemporalType,
  value: string,
  min: string | undefined,
  max: string | undefined,
  step: number | 'any' | undefined,
  baseValue: string,
): boolean {
  const candidate = numericValue(type, value)
  if (candidate === null) return false
  const minValue = min === undefined ? null : numericValue(type, min)
  const maxValue = max === undefined ? null : numericValue(type, max)
  if (type === 'time' && minValue !== null && maxValue !== null && minValue > maxValue) {
    if (candidate < minValue && candidate > maxValue) return false
  } else {
    if (minValue !== null && candidate < minValue) return false
    if (maxValue !== null && candidate > maxValue) return false
  }
  if (step === 'any') return true
  const effectiveStep =
    typeof step === 'number' && step > 0
      ? step
      : type === 'time' || type === 'datetime-local'
        ? 60
        : 1
  const unit =
    type === 'month' ? 1 : type === 'week' ? 604800000 : type === 'date' ? 86400000 : 1000
  const base = minValue ?? numericValue(type, baseValue) ?? (type === 'week' ? -259200000 : 0)
  const span = effectiveStep * unit
  const remainder = (((candidate - base) % span) + span) % span
  return remainder < 0.001 || span - remainder < 0.001
}

export function DateInput({
  InputHost,
  type,
  value,
  defaultValue = '',
  onChange,
  min,
  max,
  step,
  disabled = false,
  readOnly = false,
  required,
  name,
  autoComplete,
  locale,
  viewProps = {},
  ...inputProps
}: TemporalInputProps): import('react').JSX.Element {
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
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ''))
  const currentValue = controlled ? String(value ?? '') : uncontrolledValue
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => monthOf(String(value ?? defaultValue ?? ''), type))
  const [panel, setPanel] = useState<Panel>(() => initialPanel(type))
  const [chosenDay, setChosenDay] = useState(() => {
    const input = String(value ?? defaultValue ?? '')
    return /^\d{4}-\d{2}-\d{2}$/.test(input.slice(0, 10))
      ? input.slice(0, 10)
      : dateString(new globalThis.Date())
  })
  const [hour, setHour] = useState(() => timeOf(String(value ?? defaultValue ?? ''), type)[0])
  const [minute, setMinute] = useState(() => timeOf(String(value ?? defaultValue ?? ''), type)[1])
  const [second, setSecond] = useState(() => timeOf(String(value ?? defaultValue ?? ''), type)[2])
  const inputRef = useRef<HTMLInputElement>(null)
  const field = useFormFieldContext()
  const fieldRequired = required === true || field?.required === true
  const optionIsAllowed = (candidate: string) =>
    optionAllowed(type, candidate, min, max, step, String(value ?? defaultValue ?? ''))
  const includesTime = type === 'time' || type === 'datetime-local'
  const includesSeconds =
    includesTime &&
    (step === 'any' ||
      (typeof step === 'number' && step % 60 !== 0) ||
      /:\d{2}:\d{2}/.test(currentValue) ||
      /:\d{2}:\d{2}/.test(min ?? '') ||
      /:\d{2}:\d{2}/.test(max ?? ''))

  const checkNativeValue = (next: string): boolean => {
    const input = inputRef.current
    if (!input) return true
    const original = input.value
    input.value = next
    const valid = input.validity.valid
    input.value = original
    return valid
  }

  const commit = (next: string) => {
    if (!controlled) {
      setUncontrolledValue(next)
      if (inputRef.current) inputRef.current.value = next
    }
    if (next !== currentValue) onChange?.(next)
  }

  const reset = useCallback(() => {
    if (!controlled) setUncontrolledValue(String(defaultValue ?? ''))
    setMonth(monthOf(String(controlled ? value : (defaultValue ?? '')), type))
    setPanel(initialPanel(type))
    setOpen(false)
  }, [controlled, defaultValue, type, value])

  useFormReset(inputRef, reset)

  const changeOpen = (next: boolean) => {
    if (next && (disabled || readOnly)) return
    if (next) {
      setMonth(monthOf(currentValue, type))
      setPanel(initialPanel(type))
      const parts = timeOf(currentValue, type)
      setHour(parts[0])
      setMinute(parts[1])
      setSecond(parts[2])
      if (type === 'datetime-local' && /^\d{4}-\d{2}-\d{2}/.test(currentValue)) {
        setChosenDay(currentValue.slice(0, 10))
      }
    }
    setOpen(next)
  }

  const handleInputChange = (next: string) => {
    if (!controlled) setUncontrolledValue(next)
    onChange?.(next)
  }

  const completeSelection = (next: string) => {
    if (!checkNativeValue(next)) return
    commit(next)
    setOpen(false)
  }

  const selectedTime = (hours: number, minutes: number, seconds: number): string => {
    const time = `${pad(hours)}:${pad(minutes)}${includesSeconds ? `:${pad(seconds)}` : ''}`
    return type === 'datetime-local' ? `${chosenDay}T${time}` : time
  }

  const firstDay = calendarDate(month, 1)
  const year = Math.floor(month / 12)
  const yearPage = Math.floor((Math.max(1, year) - 1) / 12) * 12 + 1
  const leadingDays = (firstDay.getUTCDay() - firstWeekday + 7) % 7
  const daysInMonth = calendarDate(month + 1, 0).getUTCDate()
  const minDay =
    type === 'week'
      ? weekStart(min ?? '')
      : min
        ? new globalThis.Date(`${min.slice(0, 10)}T00:00:00Z`)
        : null
  const maxDay =
    type === 'week'
      ? weekStart(max ?? '')
      : max
        ? new globalThis.Date(`${max.slice(0, 10)}T00:00:00Z`)
        : null
  const lower = minDay && !Number.isNaN(minDay.getTime()) ? dateString(minDay) : undefined
  const upper = maxDay && !Number.isNaN(maxDay.getTime()) ? dateString(maxDay) : undefined

  const availableMonth = (candidate: number) =>
    candidate >= 12 &&
    candidate < 120000 &&
    (lower === undefined || dateString(calendarDate(candidate + 1, 0)) >= lower) &&
    (upper === undefined || dateString(calendarDate(candidate, 1)) <= upper) &&
    (type !== 'month' ||
      optionIsAllowed(`${Math.floor(candidate / 12)}-${pad((candidate % 12) + 1)}`))

  const availableYear = (candidate: number) =>
    candidate >= 1 &&
    candidate <= 9999 &&
    (lower === undefined || dateString(calendarDate((candidate + 1) * 12, 0)) >= lower) &&
    (upper === undefined || dateString(calendarDate(candidate * 12, 1)) <= upper)

  const isTimePanel = panel === 'hours' || panel === 'minutes' || panel === 'seconds'
  const navigationStep = panel === 'days' ? 1 : panel === 'months' ? 12 : 144
  const canGoPrevious =
    panel === 'years'
      ? availableYear(yearPage - 1)
      : panel === 'months'
        ? availableYear(year - 1)
        : availableMonth(month - 1)
  const canGoNext =
    panel === 'years'
      ? availableYear(yearPage + 12)
      : panel === 'months'
        ? availableYear(year + 1)
        : availableMonth(month + 1)

  const monthLabel = (candidate: number, short = false) =>
    (short ? monthShortFormatter : monthNameFormatter).format(calendarDate(candidate, 1))

  const header =
    panel === 'days' ? (
      <Row align="center" gap={4}>
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

  const selectDay = (day: globalThis.Date) => {
    const picked = dateString(day)
    if (type === 'week') {
      completeSelection(isoWeek(day))
    } else if (type === 'datetime-local') {
      setChosenDay(picked)
      setPanel('hours')
    } else {
      completeSelection(picked)
    }
  }

  const selectMonth = (candidate: number) => {
    if (type === 'month') {
      completeSelection(`${Math.floor(candidate / 12)}-${pad((candidate % 12) + 1)}`)
    } else {
      setMonth(candidate)
      setPanel('days')
    }
  }

  const pickerContent = (
    <Column gap={16} width={304}>
      {includesTime ? (
        <Row align="center" justify="center" gap={4}>
          {type === 'datetime-local' ? (
            <Button
              text={messages.chooseDate}
              size="small"
              variant={!isTimePanel ? 'primary' : 'ghost'}
              viewProps={{ onClick: () => setPanel('days') }}
            />
          ) : null}
          <Button
            text={messages.chooseHour}
            size="small"
            variant={panel === 'hours' ? 'primary' : 'ghost'}
            viewProps={{ onClick: () => setPanel('hours') }}
          />
          <Button
            text={messages.chooseMinute}
            size="small"
            variant={panel === 'minutes' ? 'primary' : 'ghost'}
            viewProps={{ onClick: () => setPanel('minutes') }}
          />
          {includesSeconds ? (
            <Button
              text={messages.chooseSecond}
              size="small"
              variant={panel === 'seconds' ? 'primary' : 'ghost'}
              viewProps={{ onClick: () => setPanel('seconds') }}
            />
          ) : null}
        </Row>
      ) : null}
      {!isTimePanel ? (
        <>
          <Row align="center" justify="space-between" gap={4}>
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
                    panel === 'years' ? (yearPage - 12) * 12 : current - navigationStep,
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
                    panel === 'years' ? (yearPage + 12) * 12 : current + navigationStep,
                  ),
              }}
            />
          </Row>
          {panel === 'days' && type === 'week' ? (
            <Grid columns={2} gap={4}>
              {Array.from(
                { length: Math.ceil((((firstDay.getUTCDay() + 6) % 7) + daysInMonth) / 7) },
                (_, index) => {
                  const mondayOffset = (firstDay.getUTCDay() + 6) % 7
                  const start = calendarDate(month, 1 - mondayOffset + 7 * index)
                  const week = isoWeek(start)
                  return (
                    <Button
                      key={week}
                      text={week}
                      size="small"
                      variant={currentValue === week ? 'primary' : 'ghost'}
                      disabled={!optionIsAllowed(week)}
                      viewProps={{
                        width: 'fill',
                        minWidth: 0,
                        label: `${week} · ${dayFormatter.format(start)}`,
                        onClick: () => selectDay(start),
                      }}
                    />
                  )
                },
              )}
            </Grid>
          ) : panel === 'days' ? (
            <Grid columns={7} gap={4}>
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
                const picked = dateString(day)
                const outOfRange =
                  (lower !== undefined && picked < lower) || (upper !== undefined && picked > upper)
                return (
                  <Button
                    key={picked}
                    text={index + 1}
                    size="small"
                    variant={currentValue.slice(0, 10) === picked ? 'primary' : 'ghost'}
                    pressed={currentValue.slice(0, 10) === picked}
                    disabled={outOfRange || (type === 'date' && !optionIsAllowed(picked))}
                    viewProps={{
                      width: 'fill',
                      minWidth: 0,
                      label: dayFormatter.format(day),
                      onClick: () => selectDay(day),
                    }}
                  />
                )
              })}
            </Grid>
          ) : panel === 'months' ? (
            <Grid columns={3} gap={4}>
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
                      onClick: () => selectMonth(candidate),
                    }}
                  />
                )
              })}
            </Grid>
          ) : (
            <Grid columns={3} gap={4}>
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
        </>
      ) : (
        <Grid columns={6} gap={4}>
          {Array.from({ length: panel === 'hours' ? 24 : 60 }, (_, index) => {
            const active =
              panel === 'hours'
                ? hour === index
                : panel === 'minutes'
                  ? minute === index
                  : second === index
            const candidate =
              panel === 'hours'
                ? selectedTime(index, minute, second)
                : panel === 'minutes'
                  ? selectedTime(hour, index, second)
                  : selectedTime(hour, minute, index)
            const disabledValue =
              ((panel === 'minutes' && !includesSeconds) || panel === 'seconds') &&
              !optionIsAllowed(candidate)
            return (
              <Button
                key={index}
                text={pad(index)}
                size="small"
                variant={active ? 'primary' : 'ghost'}
                disabled={disabledValue}
                viewProps={{
                  width: 'fill',
                  minWidth: 0,
                  onClick: () => {
                    if (panel === 'hours') {
                      setHour(index)
                      setPanel('minutes')
                    } else if (panel === 'minutes') {
                      setMinute(index)
                      if (includesSeconds) setPanel('seconds')
                      else completeSelection(candidate)
                    } else {
                      setSecond(index)
                      completeSelection(candidate)
                    }
                  },
                }}
              />
            )
          })}
        </Grid>
      )}
      {!fieldRequired && currentValue !== '' ? (
        <Row justify="end">
          <Button
            text={messages.clear}
            size="small"
            variant="ghost"
            viewProps={{ onClick: () => completeSelection('') }}
          />
        </Row>
      ) : null}
    </Column>
  )

  return (
    <InputHost
      {...inputProps}
      type={type}
      value={value}
      defaultValue={controlled ? undefined : defaultValue}
      min={min}
      max={max}
      step={step}
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
          viewProps={{
            label:
              type === 'time'
                ? messages.chooseTime
                : type === 'month'
                  ? messages.chooseMonth
                  : type === 'week'
                    ? messages.chooseWeek
                    : type === 'datetime-local'
                      ? messages.chooseDateTime
                      : messages.chooseDate,
            lang: resolvedLocale,
          }}
          content={pickerContent}
        >
          <Button
            icon={type === 'time' ? clockIcon : calendarIcon}
            size="small"
            variant="ghost"
            disabled={disabled || readOnly}
            viewProps={{
              className: 'weave-input__clear',
              label:
                type === 'time'
                  ? messages.chooseTime
                  : type === 'month'
                    ? messages.chooseMonth
                    : type === 'week'
                      ? messages.chooseWeek
                      : type === 'datetime-local'
                        ? messages.chooseDateTime
                        : messages.chooseDate,
            }}
          />
        </Popover>
      }
      viewProps={{
        ...viewProps,
        className: ['weave-date-input', viewProps.className].filter(Boolean).join(' '),
        lang: resolvedLocale,
        ref: (node) => {
          inputRef.current = node
          assignRef(viewProps.ref, node)
        },
      }}
    />
  )
}
