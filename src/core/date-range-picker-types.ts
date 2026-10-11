export type DateRangeValue = readonly [start: string, end: string]

export interface DateRangePickerProps {
  value?: DateRangeValue | null
  defaultValue?: DateRangeValue | null
  onChange?: (value: DateRangeValue) => void
  min?: string
  max?: string
  locale?: string
  disabled?: boolean
  placeholder?: string
}
