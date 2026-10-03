import type { ReactNode } from 'react'
import { Card, Code, Divider, Flex } from '../index'

export interface DocumentationComponentExampleCardProps {
  preview: ReactNode
  code: string
}

export function DocumentationComponentExampleCard({
  preview,
  code,
}: DocumentationComponentExampleCardProps) {
  return (
    <Card viewProps={{ padding: 0, overflow: 'hidden' }}>
      <Flex minHeight={12} width="fill" padding={2} align="center" justify="center">
        {preview}
      </Flex>
      <Divider />
      <Code
        language="tsx"
        viewProps={{
          width: 'fill',
          padding: 1.25,
          background: 'surfaceHover',
        }}
      >
        {code}
      </Code>
    </Card>
  )
}
