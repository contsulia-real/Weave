import type {
  ReactNode,
} from 'react'
import {
  Text,
  View,
} from '../index'

export function PlaygroundSection({
  title,
  description,
  children,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <View
      layout="flex"
      direction="column"
      gap={0.75}
    >
      <Text
        typo="headline-small"
        viewProps={{
          role: 'heading',
          level: 2,
        }}
      >
        {title}
      </Text>

      {description === undefined
        ? null
        : (
            <Text
              typo="body-medium"
              color="secondary"
            >
              {description}
            </Text>
          )}

      {children}
    </View>
  )
}

export function DemoBox({
  label,
}: {
  label: string
}) {
  return (
    <View
      padding={1}
      radius="medium"
      background="#f4f4f5"
    >
      <Text typo="label-medium">
        {label}
      </Text>
    </View>
  )
}
