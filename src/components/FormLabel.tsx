import type { FormLabelProps } from '../core/form-types'
import { useTheme } from '../theme/theme-context'
import { useRequiredFormFieldContext } from './internal/form-field-context'
import { Text } from './Text'

export function FormLabel(props: FormLabelProps): import('react').JSX.Element {
  const { children, viewProps = {} } = props
  const field = useRequiredFormFieldContext('FormLabel')
  const { theme } = useTheme()
  const typo = theme.components.Form?.base?.labelTypo

  return (
    <Text
      typo={typo}
      viewProps={{
        ...viewProps,
        id: field.labelId,
        className: ['weave-form-label', viewProps.className].filter(Boolean).join(' '),
        data: {
          ...viewProps.data,
          'weave-form-label': '',
        },
      }}
    >
      {children}
      {field.required ? (
        <Text
          viewProps={{
            className: 'weave-form-required',
            'aria-hidden': true,
          }}
        >
          {' *'}
        </Text>
      ) : null}
    </Text>
  )
}
