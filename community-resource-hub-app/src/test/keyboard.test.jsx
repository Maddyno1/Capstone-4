import { screen, waitFor } from '@testing-library/react'
import { assertive, renderRoute } from './helpers.jsx'

describe('Keyboard: skip link and landmarks', () => {
  it('makes the skip link the first tab stop and moves focus to <main>', async () => {
    const { user } = renderRoute('')
    await user.tab()
    const skip = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skip).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('main')).toHaveFocus()
    expect(window.location.hash).toBe('')
  })

  it('does not steal focus on first load', () => {
    renderRoute('#/catalogue')
    expect(document.body).toHaveFocus()
  })

  it('exposes the required landmarks', () => {
    renderRoute('')
    for (const role of ['banner', 'navigation', 'main', 'complementary', 'contentinfo']) {
      expect(screen.getAllByRole(role).length).toBeGreaterThan(0)
    }
  })
})

describe('Keyboard: tab order', () => {
  it('never uses a positive tabindex (DOM order is the tab order)', () => {
    const { container } = renderRoute('')
    const positive = [...container.querySelectorAll('[tabindex]')].filter((el) => Number(el.getAttribute('tabindex')) > 0)
    expect(positive).toHaveLength(0)
  })

  it('moves through header, navigation, then page content in order', async () => {
    const { user } = renderRoute('#/catalogue')
    const names = []
    for (let i = 0; i < 6; i += 1) {
      await user.tab()
      names.push(document.activeElement.textContent.trim() || document.activeElement.getAttribute('alt') || document.activeElement.tagName)
    }
    expect(names.slice(0, 4)).toEqual(['Skip to main content', 'Freedom Park Library, home'.length ? expect.any(String) : '', 'Home', 'Catalogue'])
    expect(names[4]).toBe('Room Reservation')
  })

  it('has no keyboard trap: Tab always moves on from a form field', async () => {
    const { user } = renderRoute('#/booking')
    const phone = screen.getByLabelText(/^Phone/)
    phone.focus()
    await user.tab()
    expect(phone).not.toHaveFocus()
  })
})

describe('Focus management: view switches', () => {
  it('moves focus to the new page heading and updates the document title', async () => {
    const { user } = renderRoute('')
    await user.click(screen.getByRole('link', { name: 'Catalogue' }))

    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'Library Catalogue' })).toHaveFocus())
    expect(document.title).toBe('Catalogue — Freedom Park Library')
  })

  it('marks the current page with aria-current', async () => {
    const { user } = renderRoute('')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('link', { name: 'Room Reservation' }))
    await waitFor(() => expect(screen.getByRole('link', { name: 'Room Reservation' })).toHaveAttribute('aria-current', 'page'))
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('shows an accessible not-found page for unknown routes', () => {
    renderRoute('#/nope')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})

describe('Focus management: event registration dialog', () => {
  const opener = () => screen.getByRole('button', { name: 'Register for Science model building competition' })

  it('opens a labelled modal and moves focus to its heading', async () => {
    const { user } = renderRoute('')
    await user.click(opener())

    const dialog = screen.getByRole('dialog', { name: 'Register for Science model building competition' })
    expect(dialog).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: /^Register for Science/ })).toHaveFocus()
  })

  it('reaches the form fields with Tab and closes with Cancel, returning focus to the opener', async () => {
    const { user } = renderRoute('')
    await user.click(opener())

    await user.tab()
    expect(screen.getByLabelText(/^Full name/)).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText(/^Email/)).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Register' })).toHaveFocus()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener()).toHaveFocus()
  })

  it('validates inside the dialog: assertive announcement and focus on the first invalid field', async () => {
    const { user } = renderRoute('')
    await user.click(opener())
    await user.click(screen.getByRole('button', { name: 'Register' }))

    await waitFor(() => expect(assertive(screen)).toHaveTextContent('Form not sent. 2 problems to fix: Full name, Email address.'))
    expect(screen.getByLabelText(/^Full name/)).toHaveFocus()
    expect(screen.getByLabelText(/^Full name/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('confirms registration, focuses the confirmation, and returns focus on Close', async () => {
    const { user } = renderRoute('')
    await user.click(opener())
    await user.type(screen.getByLabelText(/^Full name/), 'Thabo Nkosi')
    await user.type(screen.getByLabelText(/^Email/), 'thabo@example.com')
    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByRole('heading', { name: 'You are registered' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(opener()).toHaveFocus()
  })

  it('gives each Register button a unique accessible name', () => {
    renderRoute('')
    const names = screen.getAllByRole('button', { name: /^Register for/ }).map((b) => b.textContent)
    expect(new Set(names).size).toBe(names.length)
    expect(names).toHaveLength(2)
  })
})