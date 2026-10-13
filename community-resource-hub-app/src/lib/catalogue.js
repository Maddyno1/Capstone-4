export function filterBooks(books, { query = '', categories = [] } = {}) {
  const q = query.trim().toLowerCase()
  return books.filter((b) => {
    const matchesCategory = categories.length === 0 || categories.includes(b.category)
    const matchesQuery = q === '' || `${b.title} ${b.author}`.toLowerCase().includes(q)
    return matchesCategory && matchesQuery
  })
}

export function resultsSummary(count, query, categoryLabels) {
  const noun = count === 1 ? 'title' : 'titles'
  const parts = [`${count} ${noun} found`]
  if (query.trim()) parts.push(`for "${query.trim()}"`)
  if (categoryLabels.length) parts.push(`in ${categoryLabels.join(', ')}`)
  return parts.join(' ') + '.'
}