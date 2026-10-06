import { Code } from '../../../index'

export default function CodeScrollingCodeDemo() {
  const source = `const first = 1
  const second = 2
  const third = 3
  const fourth = 4
  const fifth = 5
  const sixth = 6`

  return (
    <Code language="typescript" viewProps={{ maxHeight: 8, overflow: 'auto', width: 24 }}>
      {source}
    </Code>
  )
}
