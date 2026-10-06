import { Code } from '../../../index'

const weaveSyntax = {
  name: 'weave-demo',
  scopeName: 'source.weave-demo',
  repository: {},
  patterns: [
    { match: '\\b(component|prop|state)\\b', name: 'keyword.control.weave-demo' },
    { match: '"[^"]*"', name: 'string.quoted.double.weave-demo' },
    { match: '\\b[0-9]+\\b', name: 'constant.numeric.weave-demo' },
  ],
}

export default function CodeCustomSyntaxDemo() {
  return (
    <Code language="custom" syntax={weaveSyntax}>
      {'component "Button"\nprop "size"\nstate 3'}
    </Code>
  )
}
