import type {
  TextResponsiveProps,
  TextStyleProps,
} from '../../core/text-types'
import type { ResolvedText } from '../../core/resolved-text'
import type {
  DiCTypographyContext,
  DiCViewNode,
} from './compile-view'
import type { ResolvedTheme, ThemeScaleValue } from '../../theme/theme-types'

export interface DiCResolvedTextStyle extends DiCTypographyContext {
  align: NonNullable<TextStyleProps['align']>
  wrap: NonNullable<TextStyleProps['wrap']>
  overflow: NonNullable<TextStyleProps['overflow']>
  maxLines?: number
  case: NonNullable<TextStyleProps['case']>
}

function parseAbsoluteLength(
  value: ThemeScaleValue,
  rem: number,
  fontSize: number,
): number | undefined {
  if (typeof value === 'number') return value * rem

  const input = value.trim()
  if (input === '0') return 0

  if (input.endsWith('rem')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed) ? parsed * rem : undefined
  }

  if (input.endsWith('px')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  if (input.endsWith('em')) {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed) ? parsed * fontSize : undefined
  }

  return undefined
}

function unitlessNumber(
  value: number | string,
): number | undefined {
  if (typeof value === 'number') return value
  const input = value.trim()
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(input)) {
    return undefined
  }

  const parsed = Number.parseFloat(input)
  return Number.isFinite(parsed) ? parsed : undefined
}

function themeTypo(
  theme: ResolvedTheme,
  typo: string | undefined,
) {
  return typo === undefined
    ? undefined
    : theme.tokens.typography?.styles?.[typo]
}

function resolveFontSize(
  value: ThemeScaleValue | undefined,
  fallback: number,
  rem: number,
): number {
  if (value === undefined) return fallback
  return parseAbsoluteLength(value, rem, fallback) ?? fallback
}

function resolveLineHeight(
  value: number | string | undefined,
  fontSize: number,
  rem: number,
  fallback: DiCTypographyContext,
  source: 'theme' | 'text',
): Pick<DiCTypographyContext, 'lineHeight' | 'lineHeightRatio'> {
  if (value === undefined) {
    const ratio = fallback.lineHeightRatio
    return {
      lineHeight:
        ratio === undefined
          ? fallback.lineHeight
          : fontSize * ratio,
      lineHeightRatio: ratio,
    }
  }

  const unitless = unitlessNumber(value)
  if (unitless !== undefined && source === 'theme') {
    return {
      lineHeight: fontSize * unitless,
      lineHeightRatio: unitless,
    }
  }

  if (typeof value === 'string') {
    const ratio = unitlessNumber(value)
    if (ratio !== undefined) {
      return {
        lineHeight: fontSize * ratio,
        lineHeightRatio: ratio,
      }
    }
  }

  const absolute =
    typeof value === 'number' && source === 'text'
      ? value * rem
      : parseAbsoluteLength(value, rem, fontSize)

  if (absolute === undefined) {
    throw new Error(
      `Unsupported DiC lineHeight "${String(value)}"`,
    )
  }

  return {
    lineHeight: absolute,
  }
}

function resolveLetterSpacing(
  value: ThemeScaleValue | undefined,
  fallback: number,
  rem: number,
  fontSize: number,
): number {
  if (value === undefined) return fallback

  const resolved = parseAbsoluteLength(
    value,
    rem,
    fontSize,
  )

  if (resolved === undefined) {
    throw new Error(
      `Unsupported DiC letterSpacing "${String(value)}"`,
    )
  }

  return resolved
}

function resolveColor(
  value: string | undefined,
  inherited: string,
  theme: ResolvedTheme,
): string {
  if (value === undefined || value === 'inherit') return inherited
  return theme.tokens.color?.[value] ?? value
}

function applyTextStyle(
  inherited: DiCTypographyContext,
  style: TextResponsiveProps,
  theme: ResolvedTheme,
  rem: number,
): DiCResolvedTextStyle {
  const preset = themeTypo(theme, style.typo)
  const sizeToken =
    style.size === undefined
      ? undefined
      : theme.tokens.typography?.size?.[style.size]
  const weightToken =
    style.weight === undefined
      ? undefined
      : theme.tokens.typography?.weight?.[style.weight]

  const fontSize = resolveFontSize(
    sizeToken ?? preset?.fontSize,
    inherited.fontSize,
    rem,
  )
  const fontWeight =
    weightToken ??
    preset?.fontWeight ??
    inherited.fontWeight

  const line = resolveLineHeight(
    style.lineHeight ?? preset?.lineHeight,
    fontSize,
    rem,
    inherited,
    style.lineHeight === undefined ? 'theme' : 'text',
  )

  return {
    fontFamily: inherited.fontFamily,
    fontSize,
    fontWeight,
    lineHeight: line.lineHeight,
    lineHeightRatio: line.lineHeightRatio,
    letterSpacing: resolveLetterSpacing(
      style.letterSpacing ?? preset?.letterSpacing,
      inherited.letterSpacing,
      rem,
      fontSize,
    ),
    color: resolveColor(
      style.color,
      inherited.color,
      theme,
    ),
    align: style.align ?? 'start',
    wrap:
      style.wrap ??
      (
        style.overflow === 'ellipsis' &&
        style.maxLines === undefined
          ? 'nowrap'
          : 'wrap'
      ),
    overflow: style.overflow ?? 'clip',
    maxLines: style.maxLines,
    case: style.case ?? 'none',
  }
}

export function createRootDiCTypography(
  theme: ResolvedTheme,
  rem: number,
): DiCTypographyContext {
  const family =
    theme.tokens.typography?.family?.body ??
    'ui-sans-serif, system-ui, sans-serif'
  const base: DiCTypographyContext = {
    fontFamily: family,
    fontSize: rem,
    fontWeight: 400,
    lineHeight: rem * 1.5,
    lineHeightRatio: 1.5,
    letterSpacing: 0,
    color: theme.tokens.color?.text ?? '#18181b',
  }

  const resolved = applyTextStyle(
    base,
    { typo: 'body-large' },
    theme,
    rem,
  )

  return {
    fontFamily: resolved.fontFamily,
    fontSize: resolved.fontSize,
    fontWeight: resolved.fontWeight,
    lineHeight: resolved.lineHeight,
    lineHeightRatio: resolved.lineHeightRatio,
    letterSpacing: resolved.letterSpacing,
    color: resolved.color,
  }
}

export function resolveDiCNodeTypography(
  node: DiCViewNode,
  inherited: DiCTypographyContext,
  theme: ResolvedTheme,
  rem: number,
  paintColor?: string,
): DiCTypographyContext {
  const typo = node.typography?.typo
  const withTypo =
    typo === undefined
      ? inherited
      : applyTextStyle(
          inherited,
          { typo },
          theme,
          rem,
        )

  return {
    fontFamily: withTypo.fontFamily,
    fontSize: withTypo.fontSize,
    fontWeight: withTypo.fontWeight,
    lineHeight: withTypo.lineHeight,
    lineHeightRatio: withTypo.lineHeightRatio,
    letterSpacing: withTypo.letterSpacing,
    color: resolveColor(
      paintColor,
      withTypo.color,
      theme,
    ),
  }
}

export function resolveDiCTextStyle(
  text: ResolvedText,
  inherited: DiCTypographyContext,
  theme: ResolvedTheme,
  viewportWidth: number,
  rem: number,
): DiCResolvedTextStyle {
  let style: TextResponsiveProps = {
    ...text.base,
  }

  for (const responsive of text.responsive) {
    if (viewportWidth >= responsive.minWidth * rem) {
      style = {
        ...style,
        ...responsive.style,
      }
    }
  }

  return applyTextStyle(
    inherited,
    style,
    theme,
    rem,
  )
}
