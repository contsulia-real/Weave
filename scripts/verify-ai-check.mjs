import assert from 'node:assert/strict'
import { checkSource } from './weave-check.mjs'

function codes(source) {
  return checkSource('fixture.tsx', source).map((item) => item.code)
}

assert.deepEqual(
  codes(`import { Button } from '@contsulia/weave/components/Button'
export const Demo = () => <Button text="Save" />`),
  [],
)

assert(
  codes(`import { Button } from '@contsulia/weave'
export const Demo = () => <Button text="Save" />`).includes('WEAVE_IMPORT_001'),
)

assert(
  codes(`import { Button } from '@contsulia/weave/components/Input'
export const Demo = () => <Button text="Save" />`).includes('WEAVE_IMPORT_003'),
)

assert(
  codes(`import { useViewHost } from '@contsulia/weave/components/internal/use-view-host'
void useViewHost`).includes('WEAVE_IMPORT_002'),
)

assert(
  codes(`import { View } from '@contsulia/weave/components/View'
export const Demo = () => <View />`).includes('WEAVE_VIEW_001'),
)

assert(
  codes(`import { Input } from '@contsulia/weave/components/Input'
export const Demo = () => <Input multiline clearable />`).includes('WEAVE_INPUT_001'),
)

assert(
  codes(`import { Flex } from '@contsulia/weave/components/Flex'
export const Demo = () => <Flex direction="column" />`).includes('WEAVE_LAYOUT_001'),
)

console.log('Weave semantic checker verification passed.')
