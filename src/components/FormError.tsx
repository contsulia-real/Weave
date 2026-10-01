import type { FormErrorProps } from '../core/form-types'
import { useTheme } from '../theme/theme-context'
import { useRequiredFormFieldContext } from './internal/form-field-context'
import { Text } from './Text'

export function FormError({ children, viewProps = {} }: FormErrorProps) {
  const field = useRequiredFormFieldContext('FormError')
  const { theme } = useTheme()
  const typo = theme.components.Form?.base?.errorTypo

  return (
    <Text
      typo={typo}
      viewProps={{
        ...viewProps,
        id: field.errorId,
        className: ['weave-form-error', viewProps.className].filter(Boolean).join(' '),
        data: {
          ...viewProps.data,
          'weave-form-error': '',
        },
      }}
    >
      {children}
    </Text>
  )
}
