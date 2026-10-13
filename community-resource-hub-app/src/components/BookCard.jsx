import { CATEGORIES } from '../data/books.js'
import { imgSrc } from '../data/site.js'

const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id

export function BookCard({ book, showDetails = false }) {
  return (
    <li className="card">
      <figure>
        <img className="cover" src={imgSrc(book.image)} alt="" width="400" />
        <figcaption>
          <strong>{book.title}</strong>
          {showDetails && (
            <>
              <br />
              {book.author}
              <br />
              <span className="meta">{categoryLabel(book.category)}</span>
            </>
          )}
        </figcaption>
      </figure>
    </li>
  )
}