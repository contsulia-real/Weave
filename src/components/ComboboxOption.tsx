import { useContext } from 'react'
import type { ComboboxOptionProps } from '../core/combobox-types'
import { ensureComboboxStylesheet } from '../renderers/dom/combobox-stylesheet'
import { useTheme } from '../theme/theme-context'
import { ComboboxContext } from './internal/combobox-context'
import { OptionItem } from './internal/OptionItem'

export function ComboboxOption({
  value,
  text,
  secondaryText,
  icon,
  disabled = false,
  viewProps = {},
}: ComboboxOptionProps) {
  const context = useContext(ComboboxContext)

  if (context === null) {
    throw new Error('ComboboxOption must be rendered inside Combobox')
  }

  const { theme } = useTheme()

  return (
    <OptionItem
      component="combobox"
      value={value}
      text={text}
      secondaryText={secondaryText}
      icon={icon}
      disabled={disabled}
      viewProps={viewProps}
      context={context}
      optionTheme={theme.components.Combobox?.option}
      ensureStylesheet={ensureComboboxStylesheet}
    />
  )
}
