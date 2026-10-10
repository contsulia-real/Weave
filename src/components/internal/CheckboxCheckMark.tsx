import type { CSSProperties } from 'react'

interface CheckboxCheckMarkProps {
  checked?: boolean
  delay?: string
  style?: CSSProperties
}

export function CheckboxCheckMark({ checked, delay, style }: CheckboxCheckMarkProps) {
  return (
    <svg className="weave-checkbox__mark" viewBox="0 0 24 24" aria-hidden="true" style={style}>
      <path
        className="weave-checkbox__mark-path weave-checkbox__check-path"
        data-weave-checkbox-check=""
        pathLength="1"
        d="M4.5 12.5 9.5 17.5 19.5 6.5"
        style={
          checked === undefined
            ? undefined
            : { stroke: 'currentColor', strokeDashoffset: checked ? 0 : 1, transitionDelay: delay }
        }
      />
      <path
        className="weave-checkbox__mark-path weave-checkbox__indeterminate-path"
        data-weave-checkbox-indeterminate-mark=""
        pathLength="1"
        d="M6 12 H18"
      />
    </svg>
  )
}
