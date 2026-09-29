import {
  IconAlt,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBackspace,
  IconBrandWindows,
  IconCommand,
  IconCornerDownLeft,
  IconFunction,
  IconHome,
  IconLetterA,
  IconLetterB,
  IconLetterC,
  IconLetterD,
  IconLetterE,
  IconLetterF,
  IconLetterG,
  IconLetterH,
  IconLetterI,
  IconLetterJ,
  IconLetterK,
  IconLetterL,
  IconLetterM,
  IconLetterN,
  IconLetterO,
  IconLetterP,
  IconLetterQ,
  IconLetterR,
  IconLetterS,
  IconLetterT,
  IconLetterU,
  IconLetterV,
  IconLetterW,
  IconLetterX,
  IconLetterY,
  IconLetterZ,
  IconMenu2,
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
  IconNumber6,
  IconNumber7,
  IconNumber8,
  IconNumber9,
  IconOption,
  IconScreenshot,
  IconSpace,
} from '@tabler/icons-react'
import { type ReactNode, useInsertionEffect, useSyncExternalStore } from 'react'
import type { IconComponent } from '../core/icon-types'
import type { KeyMetaKey, KeyProps } from '../core/key-types'
import type { ViewProps } from '../core/view-types'
import { ensureButtonStylesheet } from '../renderers/dom/button-stylesheet'
import { ensureKeyStylesheet } from '../renderers/dom/key-stylesheet'
import { resolveButtonTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { renderIconSource } from './internal/render-icon-source'
import { useViewHost } from './internal/use-view-host'

type ResolvedMetaKey = Exclude<KeyMetaKey, 'auto'>

const LETTER_ICONS: Readonly<Record<string, IconComponent>> = {
  A: IconLetterA,
  B: IconLetterB,
  C: IconLetterC,
  D: IconLetterD,
  E: IconLetterE,
  F: IconLetterF,
  G: IconLetterG,
  H: IconLetterH,
  I: IconLetterI,
  J: IconLetterJ,
  K: IconLetterK,
  L: IconLetterL,
  M: IconLetterM,
  N: IconLetterN,
  O: IconLetterO,
  P: IconLetterP,
  Q: IconLetterQ,
  R: IconLetterR,
  S: IconLetterS,
  T: IconLetterT,
  U: IconLetterU,
  V: IconLetterV,
  W: IconLetterW,
  X: IconLetterX,
  Y: IconLetterY,
  Z: IconLetterZ,
}

const NUMBER_ICONS: Readonly<Record<string, IconComponent>> = {
  '0': IconNumber0,
  '1': IconNumber1,
  '2': IconNumber2,
  '3': IconNumber3,
  '4': IconNumber4,
  '5': IconNumber5,
  '6': IconNumber6,
  '7': IconNumber7,
  '8': IconNumber8,
  '9': IconNumber9,
}

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: {
    platform?: string
  }
}

const META_LABELS: Readonly<Record<ResolvedMetaKey, string>> = {
  command: 'Command',
  windows: 'Windows',
  meta: 'Meta',
}

function keyIcon(icon: IconComponent) {
  return renderIconSource(icon, {
    size: 'xlarge',
    stroke: 'regular',
  })
}

interface ResolvedKeyVisual {
  content: ReactNode
  label?: string
}

function resolveKeyVisual(value: ReactNode, metaKey: ResolvedMetaKey): ResolvedKeyVisual {
  if (typeof value !== 'string') {
    return { content: value }
  }

  const normalized = value.toLowerCase()

  if (/^[a-z]$/i.test(value)) {
    const letter = value.toUpperCase()
    const icon = LETTER_ICONS[letter]

    return {
      content: keyIcon(icon),
      label: value,
    }
  }

  if (/^[0-9]$/.test(value)) {
    return {
      content: keyIcon(NUMBER_ICONS[value]),
      label: value,
    }
  }

  if (normalized === 'meta') {
    if (metaKey === 'command') {
      return {
        content: keyIcon(IconCommand),
        label: META_LABELS.command,
      }
    }

    if (metaKey === 'windows') {
      return {
        content: keyIcon(IconBrandWindows),
        label: META_LABELS.windows,
      }
    }

    return { content: META_LABELS.meta }
  }

  if (normalized === 'command' || normalized === 'cmd') {
    return {
      content: keyIcon(IconCommand),
      label: 'Command',
    }
  }

  if (normalized === 'windows' || normalized === 'win') {
    return {
      content: keyIcon(IconBrandWindows),
      label: 'Windows',
    }
  }

  if (normalized === 'alt') {
    return {
      content: keyIcon(IconAlt),
      label: 'Alt',
    }
  }

  if (normalized === 'fn' || normalized === 'function') {
    return {
      content: keyIcon(IconFunction),
      label: 'Fn',
    }
  }

  if (normalized === 'option') {
    return {
      content: keyIcon(IconOption),
      label: 'Option',
    }
  }

  if (normalized === 'enter' || normalized === 'return') {
    return {
      content: keyIcon(IconCornerDownLeft),
      label: normalized === 'return' ? 'Return' : 'Enter',
    }
  }

  if (normalized === 'backspace') {
    return {
      content: keyIcon(IconBackspace),
      label: 'Backspace',
    }
  }

  if (normalized === 'space') {
    return {
      content: keyIcon(IconSpace),
      label: 'Space',
    }
  }

  if (normalized === 'arrowup') {
    return {
      content: keyIcon(IconArrowUp),
      label: 'Arrow Up',
    }
  }

  if (normalized === 'arrowdown') {
    return {
      content: keyIcon(IconArrowDown),
      label: 'Arrow Down',
    }
  }

  if (normalized === 'arrowleft') {
    return {
      content: keyIcon(IconArrowLeft),
      label: 'Arrow Left',
    }
  }

  if (normalized === 'arrowright') {
    return {
      content: keyIcon(IconArrowRight),
      label: 'Arrow Right',
    }
  }

  if (normalized === 'home') {
    return {
      content: keyIcon(IconHome),
      label: 'Home',
    }
  }

  if (normalized === 'printscreen' || normalized === 'prtsc') {
    return {
      content: keyIcon(IconScreenshot),
      label: 'Print Screen',
    }
  }

  if (normalized === 'menu' || normalized === 'contextmenu') {
    return {
      content: keyIcon(IconMenu2),
      label: 'Menu',
    }
  }

  return { content: value }
}

function detectMetaKey(): ResolvedMetaKey {
  if (typeof navigator === 'undefined') {
    return 'meta'
  }

  const browserNavigator = navigator as NavigatorWithUserAgentData
  const platform =
    browserNavigator.userAgentData?.platform ||
    browserNavigator.platform ||
    browserNavigator.userAgent

  if (/Mac|iPhone|iPad|iPod/i.test(platform)) {
    return 'command'
  }

  if (/Win/i.test(platform)) {
    return 'windows'
  }

  return 'meta'
}

function subscribeToPlatform(): () => void {
  return () => {}
}

function useDetectedMetaKey(): ResolvedMetaKey {
  return useSyncExternalStore(subscribeToPlatform, detectMetaKey, () => 'meta')
}

export function Key({
  value,
  metaKey = 'auto',
  variant = 'secondary',
  size = 'small',
  viewProps = {},
}: KeyProps) {
  const detectedMetaKey = useDetectedMetaKey()
  const resolvedMetaKey = metaKey === 'auto' ? detectedMetaKey : metaKey
  const visual = resolveKeyVisual(value, resolvedMetaKey)
  const hostProps: ViewProps<HTMLElement> = {
    ...viewProps,
    label: viewProps.label ?? visual.label,
  }

  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('button-theme', resolveButtonTheme(theme))
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  useInsertionEffect(() => {
    ensureButtonStylesheet()
    ensureKeyStylesheet()
  }, [])

  return (
    <kbd
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-key=""
      data-weave-layout={resolved.layout}
      className={[
        'weave-key',
        'weave-button',
        `weave-button--${variant}`,
        `weave-button--${size}`,
        themeClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={inlineStyle}
    >
      <span className="weave-button__content">{visual.content}</span>
    </kbd>
  )
}
