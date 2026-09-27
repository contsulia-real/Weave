import type { ResolvedButton } from '../../core/resolved-button'
import type { ResolvedImage } from '../../core/resolved-image'
import type { ResolvedSwitch } from '../../core/resolved-switch'
import type { ResolvedText } from '../../core/resolved-text'
import type { ResolvedView } from '../../core/resolved-view'
import type { ResolvedTheme } from '../../theme/theme-types'

export const DIC_VIEW_HOST = 'weave:view'
export const DIC_TEXT_HOST = 'weave:text'
export const DIC_IMAGE_HOST = 'weave:image'
export const DIC_BUTTON_HOST = 'weave:button'
export const DIC_SWITCH_HOST = 'weave:switch'

export type DiCHostType =
  | typeof DIC_VIEW_HOST
  | typeof DIC_TEXT_HOST
  | typeof DIC_IMAGE_HOST
  | typeof DIC_BUTTON_HOST
  | typeof DIC_SWITCH_HOST

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

export type DiCHostProps =
  | DiCViewHostProps
  | DiCTextHostProps
  | DiCImageHostProps
  | DiCButtonHostProps
  | DiCSwitchHostProps
