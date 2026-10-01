import type { FormDescriptionProps } from '../core/form-types'
import { useTheme } from '../theme/theme-context'
import { useRequiredFormFieldContext } from './internal/form-field-context'
import { Text } from './Text'

export function FormDescription({ children, viewProps = {} }: FormDescriptionProps) {
  const field = useRequiredFormFieldContext('FormDescription')
  const { theme } = useTheme()
  const typo = theme.components.Form?.base?.descriptionTypo

  return (
    <Text
      typo={typo}
      viewProps={{
        ...viewProps,
        id: field.descriptionId,
        className: ['weave-form-description', viewProps.className].filter(Boolean).join(' '),
        data: {
          ...viewProps.data,
          'weave-form-description': '',
        },
      }}
    >
      {children}
    </Text>
  )
}
