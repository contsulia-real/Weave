import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { View } from '../src'

afterEach(cleanup)

describe('disabled cursor', () => {
  it('applies not-allowed at the ViewHost layer for every disabled component', () => {
    const { getByTestId } = render(
      <View disabled data={{ testid: 'disabled-view' }}>
        disabled
      </View>,
    )

    expect(getComputedStyle(getByTestId('disabled-view')).cursor).toBe('not-allowed')
  })
})
