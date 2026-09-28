import {
  useInsertionEffect,
} from 'react'
import type { LinkProps } from '../core/link-types'
import type { ViewProps } from '../core/view-types'
import { ensureLinkStylesheet } from '../renderers/dom/link-stylesheet'
import { resolveLinkTheme } from '../renderers/dom/resolve-component-theme'
import { useRuntimeStyleClass } from '../renderers/dom/runtime-class'
import { useTheme } from '../theme/theme-context'
import { Icon } from './Icon'
import { useViewHost } from './internal/use-view-host'

const linkIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

export function Link({
  href,
  text,
  hideIcon = false,
  hideUnderline = false,
  target,
  viewProps = {},
}: LinkProps) {
  const { theme } = useTheme()
  const themeClassName = useRuntimeStyleClass(
    'link-theme',
    resolveLinkTheme(theme),
  )
  const hostProps: ViewProps<HTMLAnchorElement> = viewProps
  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)

  useInsertionEffect(ensureLinkStylesheet, [])

  return (
    <a
      {...resolved.domProps}
      ref={elementRef}
      href={href}
      target={target}
      data-weave-view=""
      data-weave-link=""
      data-weave-link-underline={hideUnderline ? 'hidden' : 'visible'}
      data-weave-layout={resolved.layout}
      className={[
        'weave-link',
        themeClassName,
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      <span className="weave-link__text">
        {text ?? href}
      </span>

      {!hideIcon ? (
        <Icon
          svg={linkIcon}
          size="small"
          stroke="regular"
          viewProps={{
            className: 'weave-link__icon',
            width: 'var(--weave-link-theme-icon-size)',
            height: 'var(--weave-link-theme-icon-size)',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </a>
  )
}
