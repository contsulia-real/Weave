import {
  cloneElement,
  useInsertionEffect,
} from 'react'
import type {
  IconProps,
  IconStroke,
} from '../core/icon-types'
import type { ViewProps } from '../core/view-types'
import { ensureIconStylesheet } from '../renderers/dom/icon-stylesheet'
import { useViewHost } from './internal/use-view-host'

const STROKE_WIDTH: Readonly<Record<IconStroke, number>> = {
  thin: 1.5,
  regular: 2,
  bold: 2.5,
}

export function Icon({
  icon: IconSource,
  svg,
  size = 'medium',
  stroke = 'regular',
  viewProps = {},
}: IconProps) {
  const hostProps: ViewProps<HTMLSpanElement> = {
    ...viewProps,
    role:
      viewProps.role ??
      (viewProps.label === undefined ? undefined : 'img'),
  }

  const {
    elementRef,
    className,
    inlineStyle,
    resolved,
  } = useViewHost(hostProps)

  useInsertionEffect(ensureIconStylesheet, [])

  const strokeWidth = STROKE_WIDTH[stroke]
  const content =
    IconSource === undefined
      ? cloneElement(svg, {
          width: '100%',
          height: '100%',
          strokeWidth,
          'aria-hidden': true,
          focusable: false,
        })
      : (
          <IconSource
            size="100%"
            stroke={strokeWidth}
            aria-hidden="true"
            focusable="false"
          />
        )

  return (
    <span
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-icon=""
      data-weave-icon-size={size}
      data-weave-icon-stroke={stroke}
      data-weave-layout={resolved.layout}
      className={[
        'weave-icon',
        `weave-icon--${size}`,
        `weave-icon--stroke-${stroke}`,
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {content}
    </span>
  )
}
