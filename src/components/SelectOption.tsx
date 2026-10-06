import { useContext } from 'react'
import type { SelectOptionProps } from '../core/select-types'
import { ensureSelectStylesheet } from '../renderers/dom/select-stylesheet'
import { useTheme } from '../theme/theme-context'
import { OptionItem } from './internal/OptionItem'
import { SelectContext } from './internal/select-context'

export function SelectOption(props: SelectOptionProps): import('react').JSX.Element {
  const { value, text, secondaryText, icon, disabled = false, viewProps = {} } = props
  const context = useContext(SelectContext)

  if (context === null) {
    throw new Error('SelectOption must be rendered inside Select')
  }

  const { theme } = useTheme()

  return (
    <OptionItem
      component="select"
      value={value}
      text={text}
      secondaryText={secondaryText}
      icon={icon}
      disabled={disabled}
      viewProps={viewProps}
      context={context}
      optionTheme={theme.components.Select?.option}
      ensureStylesheet={ensureSelectStylesheet}
    />
  )
}
