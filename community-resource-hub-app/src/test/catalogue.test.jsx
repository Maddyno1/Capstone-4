import { screen, waitFor } from '@testing-library/react'
import { polite, renderRoute } from './helpers.jsx'

const filterButton = () => screen.getByRole('button', { name: /^Filter by category/ })

describe('Catalogue: expandable filter (aria-expanded)', () => {
  it('starts collapsed, with the panel removed from the accessibility tree', () => {
    renderRoute('#/catalogue')
    expect(filterButton()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('group', { name: 'Categories' })).not.toBeInTheDocument()
  })

  it('updates aria-expanded in step with the visible panel on click', async () => {
    const { user } = renderRoute('#/catalogue')
    await user.click(filterButton())
    expect(filterButton()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('group', { name: 'Categories' })).toBeVisible()

    await user.click(filterButton())
    expect(filterButton()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('group', { name: 'Categories' })).not.toBeInTheDocument()
  })

  it.each([['{Enter}'], [' ']])('toggles with the keyboard (%j)', async (key) => {
    const { user } = renderRoute('#/catalogue')
    filterButton().focus()
    await user.keyboard(key)
    expect(filterButton()).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard(key)
    expect(filterButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('controls the panel it expands (aria-controls points at a real element)', () => {
    renderRoute('#/catalogue')
    const id = filterButton().getAttribute('aria-controls')
    expect(document.getElementById(id)).toBeInTheDocument()
  })
})

describe('Catalogue: category toggles (aria-pressed)', () => {
  it('flips aria-pressed, filters the list and announces the new count', async () => {
    const { user } = renderRoute('#/catalogue')
    await user.click(filterButton())

    const fiction = screen.getByRole('button', { name: 'Fiction' })
    expect(fiction).toHaveAttribute('aria-pressed', 'false')
    await user.click(fiction)

    expect(fiction).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Showing 2 of 8 titles')).toBeInTheDocument()
    expect(screen.getByText('A Gentleman in Moscow')).toBeInTheDocument()
    expect(screen.queryByText('Game Theory')).not.toBeInTheDocument()
    await waitFor(() => expect(polite(screen)).toHaveTextContent('2 titles found in Fiction.'))

    await user.click(fiction)
    expect(fiction).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Showing 8 of 8 titles')).toBeInTheDocument()
  })

  it('shows how many filters are active even while the section is collapsed', async () => {
    const { user } = renderRoute('#/catalogue')
    await user.click(filterButton())
    await user.click(screen.getByRole('button', { name: 'Fiction' }))
    await user.click(screen.getByRole('button', { name: 'History' }))
    await user.click(filterButton()) // collapse
    expect(filterButton()).toHaveTextContent('Filter by category (2 selected)')
  })

  it('toggles with Space and Enter', async () => {
    const { user } = renderRoute('#/catalogue')
    await user.click(filterButton())
    const history = screen.getByRole('button', { name: 'History' })
    history.focus()
    await user.keyboard('{Enter}')
    expect(history).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard(' ')
    expect(history).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('Catalogue: search', () => {
  it('searches on submit (Enter) and announces the outcome', async () => {
    const { user } = renderRoute('#/catalogue')
    await user.type(screen.getByRole('searchbox', { name: /Search by title/ }), 'moscow{Enter}')

    expect(screen.getByText('Showing 1 of 8 titles')).toBeInTheDocument()
    await waitFor(() => expect(polite(screen)).toHaveTextContent('1 title found for "moscow".'))
  })

  it('does not filter (or announce) on every keystroke', async () => {
    const { user } = renderRoute('#/catalogue')
    await user.type(screen.getByRole('searchbox'), 'mosc')
    expect(screen.getByText('Showing 8 of 8 titles')).toBeInTheDocument()
    expect(polite(screen)).toBeEmptyDOMElement()
  })

  it('explains an empty result and lets the user clear everything', async () => {
    const { user } = renderRoute('#/catalogue')
    await user.type(screen.getByRole('searchbox'), 'zzzz{Enter}')
    expect(screen.getByText(/No titles match your search/)).toBeInTheDocument()
    await waitFor(() => expect(polite(screen)).toHaveTextContent('0 titles found for "zzzz".'))

    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }))
    expect(screen.getByText('Showing 8 of 8 titles')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('marks the results region aria-busy="false" when idle', () => {
    renderRoute('#/catalogue')
    const section = screen.getByRole('heading', { name: 'All titles' }).closest('section')
    expect(section).toHaveAttribute('aria-busy', 'false')
  })
})