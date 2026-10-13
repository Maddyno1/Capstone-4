import { useId, useState, useTransition } from 'react'
import { BookCard } from '../components/BookCard.jsx'
import { Disclosure } from '../components/Disclosure.jsx'
import { BOOKS, CATEGORIES } from '../data/books.js'
import { imgSrc, PHONE_DISPLAY, PHONE_HREF } from '../data/site.js'
import { useAnnounce } from '../hooks/useAnnounce.js'
import { filterBooks, resultsSummary } from '../lib/catalogue.js'

export default function CataloguePage({ headingRef }) {
  const { announce } = useAnnounce()
  const searchId = useId()
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([])
  const [isPending, startTransition] = useTransition()

  const results = filterBooks(BOOKS, { query, categories: selected })
  const labelsFor = (ids) => CATEGORIES.filter((c) => ids.includes(c.id)).map((c) => c.label)

  const announceFor = (nextQuery, nextSelected) => {
    const count = filterBooks(BOOKS, { query: nextQuery, categories: nextSelected }).length
    announce(resultsSummary(count, nextQuery, labelsFor(nextSelected)), 'polite')
  }

  const handleSearch = (event) => {
    event.preventDefault()
    startTransition(() => setQuery(draft))
    announceFor(draft, selected)
  }

  const toggleCategory = (id) => {
    const next = selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]
    startTransition(() => setSelected(next))
    announceFor(query, next)
  }

  const clearAll = () => {
    setDraft('')
    startTransition(() => {
      setQuery('')
      setSelected([])
    })
    announceFor('', [])
  }

  const hasFilters = query.trim() !== '' || selected.length > 0
  const filterTitle = selected.length > 0 ? `Filter by category (${selected.length} selected)` : 'Filter by category'

  return (
    <>
      <h1 ref={headingRef} tabIndex={-1}>Library Catalogue</h1>

      <section aria-labelledby="search-title">
        <h2 id="search-title">Search the Catalogue</h2>

        <form role="search" aria-label="Catalogue" onSubmit={handleSearch}>
          <div className="search-form">
            <div className="field">
              <label htmlFor={searchId}>Search by title, author or keyword</label>
              <input type="search" id={searchId} name="q" value={draft} onChange={(e) => setDraft(e.target.value)} />
            </div>
            <button type="submit">Search</button>
          </div>
        </form>

        <Disclosure title={filterTitle}>
          <div role="group" aria-label="Categories" className="toggle-group">
            {CATEGORIES.map((category) => {
              const pressed = selected.includes(category.id)
              return (
                <button
                  type="button"
                  key={category.id}
                  className="toggle"
                  aria-pressed={pressed}
                  onClick={() => toggleCategory(category.id)}
                >
                  <img src={imgSrc(category.image)} alt="" width="64" height="64" />
                  <span>
                    {pressed && (
                      <span className="tick" aria-hidden="true">
                        ✓{' '}
                      </span>
                    )}
                    {category.label}
                  </span>
                </button>
              )
            })}
          </div>
        </Disclosure>

        {hasFilters && (
          <p>
            <button type="button" className="button-secondary" onClick={clearAll}>
              Clear search and filters
            </button>
          </p>
        )}
      </section>

      <section aria-labelledby="results-title" aria-busy={isPending}>
        <h2 id="results-title">{hasFilters ? 'Matching titles' : 'All titles'}</h2>
        <p>
          Showing {results.length} of {BOOKS.length} titles
        </p>
        {results.length > 0 ? (
          <ul className="card-grid">
            {results.map((book) => (
              <BookCard key={book.id} book={book} showDetails />
            ))}
          </ul>
        ) : (
          <p className="empty">
            No titles match your search. Try a different word, or clear the search and filters.
          </p>
        )}
      </section>

      <aside aria-labelledby="help-title">
        <h2 id="help-title">Can&apos;t find a title?</h2>
        <p>
          Call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> and a librarian will search for you.
        </p>
      </aside>
    </>
  )
}