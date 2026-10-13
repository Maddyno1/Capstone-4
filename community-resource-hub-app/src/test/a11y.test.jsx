import { axe } from 'jest-axe'
import { screen } from '@testing-library/react'
import { renderRoute } from './helpers.jsx'

describe('axe-core: no violations on each view', () => {
  it.each([
    ['home', ''],
    ['catalogue', '#/catalogue'],
    ['booking', '#/booking'],
    ['not found', '#/missing'],
  ])('%s', async (_name, hash) => {
    const { container } = renderRoute(hash)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('booking form with every error showing', async () => {
    const { user, container } = renderRoute('#/booking')
    await user.click(screen.getByRole('button', { name: 'Reserve room' }))
    expect(await axe(container)).toHaveNoViolations()
  })

  it('catalogue with the filter panel open and a category pressed', async () => {
    const { user, container } = renderRoute('#/catalogue')
    await user.click(screen.getByRole('button', { name: /^Filter by category/ }))
    await user.click(screen.getByRole('button', { name: 'Fiction' }))
    expect(await axe(container)).toHaveNoViolations()
  })

  it('event dialog open', async () => {
    const { user, container } = renderRoute('')
    await user.click(screen.getByRole('button', { name: /^Register for Science/ }))
    expect(await axe(container)).toHaveNoViolations()
  })
})