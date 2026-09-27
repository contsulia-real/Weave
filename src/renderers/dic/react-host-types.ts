import type { ResolvedButton } from '../../core/resolved-button'
import type { ResolvedImage } from '../../core/resolved-image'
import type { ResolvedInput } from '../../core/resolved-input'
import type { ResolvedProgress } from '../../core/resolved-progress'
import type { ResolvedSwitch } from '../../core/resolved-switch'
import type { ResolvedText } from '../../core/resolved-text'
import type { ResolvedView } from '../../core/resolved-view'
import type { ResolvedTheme } from '../../theme/theme-types'

export const DIC_VIEW_HOST = 'weave:view'
export const DIC_TEXT_HOST = 'weave:text'
export const DIC_IMAGE_HOST = 'weave:image'
export const DIC_INPUT_HOST = 'weave:input'
export const DIC_BUTTON_HOST = 'weave:button'
export const DIC_SWITCH_HOST = 'weave:switch'
export const DIC_PROGRESS_HOST = 'weave:progress'

export type DiCHostType =
  | typeof DIC_VIEW_HOST
  | typeof DIC_TEXT_HOST
  | typeof DIC_IMAGE_HOST
  | typeof DIC_INPUT_HOST
  | typeof DIC_BUTTON_HOST
  | typeof DIC_SWITCH_HOST
  | typeof DIC_PROGRESS_HOST

export interface DiCViewHostProps {
  view: ResolvedView
  theme: ResolvedTheme
}

export interface DiCTextHostProps {
  view: ResolvedView
  text: ResolvedText
  theme: ResolvedTheme
}

export interface DiCImageHostProps {
  view: ResolvedView
  image: ResolvedImage
  theme: ResolvedTheme
}

export interface DiCInputHostProps {
  view: ResolvedView
  input: ResolvedInput
  theme: ResolvedTheme
  value: string
  onChange?: (value: string) => void
}

export interface DiCButtonHostProps {
  view: ResolvedView
  button: ResolvedButton
  theme: ResolvedTheme
}

export interface DiCSwitchHostProps {
  view: ResolvedView
  value: ResolvedSwitch
  theme: ResolvedTheme
  onChange?: (checked: boolean) => void
}

export interface DiCProgressHostProps {
  view: ResolvedView
  progress: ResolvedProgress
  theme: ResolvedTheme
}

export type DiCHostProps =
  | DiCViewHostProps
  | DiCTextHostProps
  | DiCImageHostProps
  | DiCInputHostProps
  | DiCButtonHostProps
  | DiCSwitchHostProps
  | DiCProgressHostProps
