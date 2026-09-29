import { FoundationActionPlayground } from './FoundationActionPlayground'
import { FoundationControlPlayground } from './FoundationControlPlayground'
import { FoundationLayoutPlayground } from './FoundationLayoutPlayground'
import { FoundationMotionPlayground } from './FoundationMotionPlayground'
import { FoundationVisualPlayground } from './FoundationVisualPlayground'

export function FoundationPlayground() {
  return (
    <>
      <FoundationLayoutPlayground />
      <FoundationMotionPlayground />
      <FoundationVisualPlayground />
      <FoundationActionPlayground />
      <FoundationControlPlayground />
    </>
  )
}
