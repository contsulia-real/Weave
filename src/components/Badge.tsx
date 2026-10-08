import type { BadgeProps } from '../core/badge-types'
import type { ViewProps } from '../core/view-types'
import { ensureBadgeStylesheet } from '../renderers/dom/badge-stylesheet'
import { resolveBadgeTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useStaticStylesheet } from '../renderers/dom/static-stylesheet'
import { useTheme } from '../theme/theme-context'
import { durationMilliseconds } from './internal/motion-duration'
import { useBadgeAnchor } from './internal/use-badge-anchor'
import { useExitPresence } from './internal/use-exit-presence'
import { useViewHost } from './internal/use-view-host'
import { Text } from './Text'

export function Badge(props: BadgeProps): import('react').JSX.Element {
  const { children, placement = 'top-right', visible = true, viewProps = {}, ...content } = props
  const { theme, reducedMotion } = useTheme()
  const themeClassName = useRuntimeStyleClass('badge-theme', resolveBadgeTheme(theme))
  const hostProps: ViewProps<HTMLDivElement> = viewProps
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)
  const dot = content.dot === true
  const exitDuration = durationMilliseconds(theme.tokens.motion?.duration?.fast, 120)
  const { present, visualState, finishExit } = useExitPresence(visible, reducedMotion, exitDuration)

  useBadgeAnchor(elementRef, children)
  useStaticStylesheet(ensureBadgeStylesheet)

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-badge-anchor=""
      data-weave-badge-placement={placement}
      data-weave-layout={resolved.layout}
      className={['weave-badge-anchor', themeClassName, className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}

      {present ? (
        <span
          data-weave-badge=""
          data-weave-badge-dot={dot ? 'true' : 'false'}
          data-weave-badge-state={visualState}
          data-weave-reduced-motion={reducedMotion ? 'reduce' : undefined}
          className={['weave-badge', dot ? 'weave-badge--dot' : undefined]
            .filter(Boolean)
            .join(' ')}
          aria-hidden={dot ? true : undefined}
          onAnimationEnd={(event) => {
            if (
              event.animationName === 'weave-badge-dismiss' &&
              visualState === 'closing' &&
              !visible
            ) {
              finishExit()
            }
          }}
        >
          {dot ? null : <Text>{content.text}</Text>}
        </span>
      ) : null}
    </div>
  )
}
