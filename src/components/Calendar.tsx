import type { CalendarProps } from '../core/calendar-types'
import { DateInput } from './internal/DateInput'

export function Calendar(props: CalendarProps): import('react').JSX.Element {
  return <DateInput {...props} type="date" inline />
}
