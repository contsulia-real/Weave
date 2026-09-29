import type { ReactNode } from 'react'
import { Column, Text, View } from '../index'

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
    <Column gap={0.75}>
      <Text
        typo="headline-small"
        viewProps={{
          role: 'heading',
          level: 2,
        }}
      >
        {title}
      </Text>

      {description === undefined ? null : (
        <Text typo="body-medium" color="secondary">
          {description}
        </Text>
      )}

      {children}
    </Column>
  )
}

export function DemoBox({ label }: { label: string }) {
  return (
    <View padding={1} radius="medium" background="surfaceHover">
      <Text typo="label-medium">{label}</Text>
    </View>
  )
}
