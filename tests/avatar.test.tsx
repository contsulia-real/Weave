import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Avatar, createTheme, ThemeProvider } from '../src'

afterEach(cleanup)

function runtimeRule(element: Element, prefix: string): string {
  const className = [...element.classList].find((name) => name.startsWith(prefix))
  expect(className).toBeDefined()

  return (
    document.querySelector<HTMLStyleElement>(`style[data-weave-runtime-class="${className}"]`)
      ?.textContent ?? ''
  ).replace(/\s+/g, '')
}

describe('Avatar', () => {
  it('generates initials from the first and last words', () => {
    const { getByTestId } = render(
      <Avatar name="Ada Lovelace" viewProps={{ data: { testid: 'avatar' } }} />,
    )

    const avatar = getByTestId('avatar')
    expect(avatar.textContent).toBe('AL')
    expect(avatar.getAttribute('data-weave-avatar-image')).toBe('false')
    expect(avatar.getAttribute('data-weave-avatar-size-mode')).toBe('default')

    const themeRule = runtimeRule(avatar, 'weave-avatar-theme-')
    expect(themeRule).toContain(
      '--weave-avatar-theme-background:var(--weave-color-surfaceHover,surfaceHover);',
    )
    expect(themeRule).toContain('--weave-avatar-theme-color:var(--weave-color-tertiary,tertiary);')
    expect(themeRule).toContain(
      '--weave-avatar-theme-border-color:var(--weave-color-outline,outline);',
    )
    expect(themeRule).toContain('--weave-avatar-theme-border-width:0.0625rem;')
  })

  it('uses the first two characters for a single-word name', () => {
    const { getByTestId } = render(
      <Avatar name="Cher" viewProps={{ data: { testid: 'avatar' } }} />,
    )

    expect(getByTestId('avatar').textContent).toBe('CH')
  })

  it('prefers an explicit fallback over generated initials', () => {
    const { getByTestId } = render(
      <Avatar
        name="Ada Lovelace"
        fallback={<span>FX</span>}
        viewProps={{ data: { testid: 'avatar' } }}
      />,
    )

    expect(getByTestId('avatar').textContent).toBe('FX')
  })

  it('renders an empty avatar surface when no content is provided', () => {
    const { getByTestId } = render(<Avatar viewProps={{ data: { testid: 'avatar' } }} />)

    const avatar = getByTestId('avatar')
    expect(avatar.textContent).toBe('')
    expect(avatar.childElementCount).toBe(0)
  })

  it('renders Image for src and falls back after an image error', () => {
    const { getByTestId, queryByRole } = render(
      <Avatar
        src="/missing-avatar.png"
        name="Grace Hopper"
        viewProps={{ data: { testid: 'avatar' }, label: 'Grace Hopper' }}
      />,
    )

    const avatar = getByTestId('avatar')
    const image = avatar.querySelector('img')

    expect(image).not.toBeNull()
    expect(image?.getAttribute('alt')).toBe('')
    expect(avatar.getAttribute('aria-label')).toBe('Grace Hopper')
    expect(avatar.getAttribute('data-weave-avatar-image')).toBe('true')

    fireEvent.error(image as HTMLImageElement)

    expect(avatar.querySelector('img')).toBeNull()
    expect(avatar.textContent).toBe('GH')
    expect(avatar.getAttribute('data-weave-avatar-image')).toBe('false')
    expect(queryByRole('img')).toBeNull()
  })

  it('tracks width-only and height-only sizing so aspect ratio can complete the circle', () => {
    const { getByTestId } = render(
      <>
        <Avatar name="Width Only" viewProps={{ width: 4, data: { testid: 'width' } }} />
        <Avatar name="Height Only" viewProps={{ height: 5, data: { testid: 'height' } }} />
      </>,
    )

    expect(getByTestId('width').getAttribute('data-weave-avatar-size-mode')).toBe('width')
    expect(getByTestId('height').getAttribute('data-weave-avatar-size-mode')).toBe('height')
  })

  it('resolves Avatar theme customization', () => {
    const theme = createTheme({
      components: {
        Avatar: {
          base: {
            background: 'primary',
            color: 'onPrimary',
            borderColor: 'primaryActive',
            borderWidth: 0.125,
          },
        },
      },
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Avatar name="Ada Lovelace" viewProps={{ data: { testid: 'avatar' } }} />
      </ThemeProvider>,
    )

    const rule = runtimeRule(getByTestId('avatar'), 'weave-avatar-theme-')
    expect(rule).toContain('--weave-avatar-theme-background:var(--weave-color-primary,primary);')
    expect(rule).toContain('--weave-avatar-theme-color:var(--weave-color-onPrimary,onPrimary);')
    expect(rule).toContain(
      '--weave-avatar-theme-border-color:var(--weave-color-primaryActive,primaryActive);',
    )
    expect(rule).toContain('--weave-avatar-theme-border-width:0.125rem;')
  })
})
