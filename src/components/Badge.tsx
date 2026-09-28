import {
  useEffect,
  useInsertionEffect,
  useState,
} from 'react'
import type { BadgeProps } from '../core/badge-types'
import type { ViewProps } from '../core/view-types'
import { ensureBadgeStylesheet } from '../renderers/dom/badge-stylesheet'
import { resolveBadgeTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { durationMilliseconds } from './internal/motion-duration'
import { useBadgeAnchor } from './internal/use-badge-anchor'
import { useViewHost } from './internal/use-view-host'

export function Badge({
  children,
  placement = 'top-right',
  visible = true,
  viewProps = {},
  ...content
}: BadgeProps) {
  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'badge-theme',
    resolveBadgeTheme(theme),
  )
  const hostProps: ViewProps<HTMLSpanElement> = viewProps
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)
  const dot = content.dot === true
  const [present, setPresent] = useState(visible)
  const [visualState, setVisualState] = useState<'open' | 'closing'>(
    'open',
  )
  const exitDuration = durationMilliseconds(
    theme.tokens.motion?.duration?.fast,
    120,
  )

  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (visible) {
      setPresent(true)
      setVisualState('open')
      return
    }

    if (!present) return

    setVisualState('closing')

    if (reducedMotion) {
      setPresent(false)
      return
    }

    const timer = globalThis.setTimeout(
      () => setPresent(false),
      exitDuration + 32,
    )

    return () => globalThis.clearTimeout(timer)
  }, [exitDuration, present, reducedMotion, visible])
  /* oxlint-enable react/set-state-in-effect */

  useBadgeAnchor(elementRef, children)
  useInsertionEffect(ensureBadgeStylesheet, [])

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-badge-anchor=""
      data-weave-badge-placement={placement}
      data-weave-layout={resolved.layout}
      className={[
        'weave-badge-anchor',
        themeClassName,
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}

      {present ? (
        <span
          data-weave-badge=""
          data-weave-badge-dot={dot ? 'true' : 'false'}
          data-weave-badge-state={visualState}
          data-weave-reduced-motion={reducedMotion ? 'reduce' : undefined}
          className={[
            'weave-badge',
            dot ? 'weave-badge--dot' : undefined,
          ].filter(Boolean).join(' ')}
          aria-hidden={dot ? true : undefined}
          onAnimationEnd={(event) => {
            if (
              event.animationName === 'weave-badge-dismiss' &&
              visualState === 'closing' &&
              !visible
            ) {
              setPresent(false)
            }
          }}
        >
          {dot ? null : content.text}
        </span>
      ) : null}
    </span>
  )
}
