import type { DateProps } from '../core/date-types'
import { Input } from './Input'

export function Date(props: DateProps): import('react').JSX.Element {
  return <Input {...props} type="date" clearable={false} />
}
