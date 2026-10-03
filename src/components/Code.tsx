import { useEffect, useInsertionEffect, useState } from 'react'
import {
  codeToHtml,
  createCssVariablesTheme,
  createHighlighter,
  type LanguageRegistration,
} from 'shiki'
import type { CodeLanguage, CodeProps } from '../core/code-types'
import { ensureCodeStylesheet } from '../renderers/dom/code-stylesheet'
import { useViewHost } from './internal/use-view-host'

const codeTheme = createCssVariablesTheme({
  name: 'weave-code-theme',
  variablePrefix: '--weave-code-',
  variableDefaults: {
    foreground: 'var(--weave-color-tertiary)',
    background: 'transparent',
    'token-comment': 'var(--weave-color-secondary)',
    'token-string': 'var(--weave-color-success)',
    'token-constant': 'var(--weave-color-warning)',
    'token-keyword': 'var(--weave-color-primary)',
    'token-parameter': 'var(--weave-color-tertiary)',
    'token-function': 'var(--weave-color-primary)',
    'token-string-expression': 'var(--weave-color-success)',
    'token-punctuation': 'var(--weave-color-secondary)',
    'token-link': 'var(--weave-color-primary)',
  },
})

interface HighlightResult {
  code: string
  language: CodeLanguage
  syntax: LanguageRegistration | undefined
  html?: string
  error?: unknown
}

async function highlightCode(
  code: string,
  language: CodeLanguage,
  syntax: LanguageRegistration | undefined,
): Promise<string> {
  if (language === 'custom') {
    if (syntax === undefined) {
      throw new TypeError('Code language="custom" requires syntax')
    }

    const highlighter = await createHighlighter({
      langs: [syntax],
      themes: [codeTheme],
    })

    try {
      return highlighter.codeToHtml(code, {
        lang: syntax.name,
        theme: codeTheme.name ?? 'weave-code-theme',
      })
    } finally {
      highlighter.dispose()
    }
  }

  if (syntax !== undefined) {
    throw new TypeError('Code syntax is only valid when language="custom"')
  }

  return codeToHtml(code, {
    lang: language,
    theme: codeTheme,
  })
}

export function Code(props: CodeProps) {
  const { children, viewProps = {} } = props
  const language = props.language
  const syntax = language === 'custom' ? props.syntax : undefined
  const [highlighted, setHighlighted] = useState<HighlightResult | null>(null)
  const { elementRef, className, inlineStyle, resolved } = useViewHost(viewProps)

  useInsertionEffect(ensureCodeStylesheet, [])

  useEffect(() => {
    let active = true

    void highlightCode(children, language, syntax).then(
      (html) => {
        if (!active) return

        setHighlighted({
          code: children,
          language,
          syntax,
          html,
        })
      },
      (error: unknown) => {
        if (!active) return

        setHighlighted({
          code: children,
          language,
          syntax,
          error,
        })
      },
    )

    return () => {
      active = false
    }
  }, [children, language, syntax])

  const current =
    highlighted?.code === children &&
    highlighted.language === language &&
    highlighted.syntax === syntax
      ? highlighted
      : null
  const visible =
    current ??
    (highlighted?.html !== undefined &&
    highlighted.language === language &&
    highlighted.syntax === syntax
      ? highlighted
      : null)

  if (current?.error !== undefined) {
    throw current.error
  }

  return (
    <div
      {...resolved.domProps}
      ref={elementRef}
      data-weave-view=""
      data-weave-code=""
      data-weave-code-language={language}
      data-weave-layout={resolved.layout}
      className={['weave-code', className].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {visible?.html === undefined ? (
        <pre className="weave-code__fallback">
          <code>{children}</code>
        </pre>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: visible.html }} />
      )}
    </div>
  )
}
