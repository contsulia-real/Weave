import { useInsertionEffect, useSyncExternalStore } from 'react'
import type { KeyMetaKey, KeyProps } from '../core/key-types'
import type { ViewProps } from '../core/view-types'
import { ensureButtonStylesheet } from '../renderers/dom/button-stylesheet'
import { ensureKeyStylesheet } from '../renderers/dom/key-stylesheet'
import { resolveButtonTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { useViewHost } from './internal/use-view-host'

type ResolvedMetaKey = Exclude<KeyMetaKey, 'auto'>

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: {
    platform?: string
  }
}

const META_LABELS: Readonly<Record<ResolvedMetaKey, string>> = {
  command: '⌘',
  windows: '⊞',
  meta: 'Meta',
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
  const content =
    typeof value === 'string' && value.toLowerCase() === 'meta'
      ? META_LABELS[resolvedMetaKey]
      : value

  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass('button-theme', resolveButtonTheme(theme))
  const { elementRef, className, inlineStyle, resolved } = useViewHost(
    viewProps as ViewProps<HTMLElement>,
  )

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
      <span className="weave-button__content">{content}</span>
    </kbd>
  )
}
