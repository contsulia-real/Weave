import {
  Children,
  Fragment,
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from 'react'
import type {
  SelectIcon,
  SelectOptionDescriptor,
} from '../../core/select-types'

export interface OptionPropsLike {
  value: string
  text: ReactNode
  textValue?: string
  secondaryText?: ReactNode
  icon?: SelectIcon
  disabled?: boolean
}

export function optionTextValue(
  props: OptionPropsLike,
): string {
  if (props.textValue !== undefined) {
    return props.textValue
  }

  if (
    typeof props.text === 'string' ||
    typeof props.text === 'number'
  ) {
    return String(props.text)
  }

  return ''
}

export function optionDescriptor(
  props: OptionPropsLike,
): SelectOptionDescriptor {
  return {
    value: props.value,
    text: props.text,
    textValue:
      optionTextValue(props),
    secondaryText:
      props.secondaryText,
    icon: props.icon,
    disabled:
      props.disabled === true,
  }
}

export function collectOptionElements<
  TProps extends OptionPropsLike,
>(
  children: ReactNode,
  optionType: ComponentType<TProps>,
): ReactElement<TProps>[] {
  const output:
    ReactElement<TProps>[] = []

  const collect = (
    nodes: ReactNode,
  ) => {
    Children.forEach(
      nodes,
      (child) => {
        if (!isValidElement(child)) {
          return
        }

        if (child.type === Fragment) {
          collect(
            (
              child.props as {
                children?: ReactNode
              }
            ).children,
          )
          return
        }

        if (child.type !== optionType) {
          return
        }

        output.push(
          child as ReactElement<TProps>,
        )
      },
    )
  }

  collect(children)
  return output
}

export function assertUniqueOptionValues(
  options:
    readonly SelectOptionDescriptor[],
  component: string,
): void {
  const seen = new Set<string>()

  for (const option of options) {
    if (seen.has(option.value)) {
      throw new Error(
        component +
          ' option value "' +
          option.value +
          '" is duplicated',
      )
    }

    seen.add(option.value)
  }
}

export function selectedOptionDescriptor(
  options:
    readonly SelectOptionDescriptor[],
  value: string | null,
):
  | SelectOptionDescriptor
  | undefined {
  if (value === null) {
    return undefined
  }

  return options.find(
    (option) =>
      option.value === value,
  )
}
