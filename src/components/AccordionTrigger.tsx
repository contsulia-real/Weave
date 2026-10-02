import type { MouseEvent } from 'react'
import type { AccordionTriggerProps } from '../core/accordion-types'
import type { ViewProps } from '../core/view-types'
import { useAccordionContext, useAccordionItemContext } from './internal/accordion-context'
import { chevronDownIcon, chevronRightIcon } from './internal/control-icons'
import { renderIconSource } from './internal/render-icon-source'
import { useViewHost } from './internal/use-view-host'

export function AccordionTrigger({
  children,
  singleLine = false,
  expandIcon,
  collapseIcon,
  viewProps = {},
}: AccordionTriggerProps) {
  const accordion = useAccordionContext('AccordionTrigger')
  const item = useAccordionItemContext('AccordionTrigger')
  const open = accordion.isOpen(item.value)
  const usesDefaultIcons = expandIcon === undefined && collapseIcon === undefined
  const icon = usesDefaultIcons
    ? chevronRightIcon
    : open
      ? (collapseIcon ?? chevronDownIcon)
      : (expandIcon ?? chevronRightIcon)

  const hostProps: ViewProps<HTMLButtonElement> = {
    ...viewProps,
    disabled: item.disabled,
  }
  const { elementRef, className, inlineStyle, resolved } = useViewHost(hostProps)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    viewProps.onClick?.(event)

    if (event.defaultPrevented || item.disabled) return
    accordion.requestToggle(item.value)
  }

  return (
    <button
      {...resolved.domProps}
      ref={elementRef}
      id={accordion.triggerId(item.value)}
      type="button"
      aria-expanded={open}
      aria-controls={accordion.panelId(item.value)}
      disabled={item.disabled}
      onClick={handleClick}
      data-weave-view=""
      data-weave-accordion-trigger=""
      data-weave-accordion-open={open ? 'true' : 'false'}
      data-weave-accordion-default-icons={usesDefaultIcons ? 'true' : 'false'}
      data-weave-accordion-single-line={singleLine ? 'true' : undefined}
      data-weave-layout={resolved.layout}
      className={['weave-accordion-trigger', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      <span className="weave-accordion-trigger__content">{children}</span>
      <span className="weave-accordion-trigger__indicator" aria-hidden="true">
        {renderIconSource(icon, {
          size: 'medium',
          stroke: 'regular',
          viewProps: {
            width: '100%',
            height: '100%',
          },
        })}
      </span>
    </button>
  )
}
