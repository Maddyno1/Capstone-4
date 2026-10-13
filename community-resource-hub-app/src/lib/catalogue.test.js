import { BOOKS } from '../data/books.js'
import { filterBooks, resultsSummary } from './catalogue.js'

describe('filterBooks', () => {
  it('returns everything with no filters', () => {
    expect(filterBooks(BOOKS)).toHaveLength(BOOKS.length)
  })
  it('searches title and author, ignoring case and surrounding spaces', () => {
    expect(filterBooks(BOOKS, { query: '  MOSCOW ' }).map((b) => b.id)).toEqual(['book6'])
    expect(filterBooks(BOOKS, { query: 'wiest' }).map((b) => b.id)).toEqual(['book2'])
  })
  it('filters by one or several categories (OR within categories)', () => {
    expect(filterBooks(BOOKS, { categories: ['fiction'] })).toHaveLength(2)
    expect(filterBooks(BOOKS, { categories: ['fiction', 'history'] })).toHaveLength(3)
  })
  it('combines search and category (AND)', () => {
    expect(filterBooks(BOOKS, { query: 'coffee', categories: ['fiction'] })).toHaveLength(1)
    expect(filterBooks(BOOKS, { query: 'coffee', categories: ['history'] })).toHaveLength(0)
  })
})

describe('resultsSummary', () => {
  it('pluralises and mentions the active search and categories', () => {
    expect(resultsSummary(1, '', [])).toBe('1 title found.')
    expect(resultsSummary(2, 'x', ['Fiction'])).toBe('2 titles found for "x" in Fiction.')
  })
})