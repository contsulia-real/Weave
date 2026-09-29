import { act } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { createRoot, Text, View } from '../src'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('public Weave root', () => {
  it('renders directly into ordinary DOM', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)

    await act(async () => {
      root.render(
        <View
          data={{
            testid: 'root-view',
          }}
        >
          <Text>Hello</Text>
        </View>,
      )
    })

    expect(container.querySelector('[data-testid="root-view"]')).toBeInstanceOf(HTMLDivElement)
    expect(container.querySelector('canvas')).toBeNull()

    await act(async () => {
      root.unmount()
    })

    expect(container.childNodes).toHaveLength(0)
  })

  it('updates the same DOM root across renders', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)

    await act(async () => {
      root.render(
        <View>
          <Text>First</Text>
        </View>,
      )
    })

    expect(container.textContent).toContain('First')

    await act(async () => {
      root.render(
        <View>
          <Text>Second</Text>
        </View>,
      )
    })

    expect(container.textContent).toContain('Second')
    expect(container.textContent).not.toContain('First')

    await act(async () => {
      root.unmount()
    })
  })

  it('cannot render again after unmount', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)

    await act(async () => {
      root.render(<View />)
    })

    await act(async () => {
      root.unmount()
    })

    expect(() => root.render(<View />)).toThrow('Cannot render into an unmounted Weave root')
  })
})
