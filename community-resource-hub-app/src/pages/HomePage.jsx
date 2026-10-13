import { useRef, useState } from 'react'
import { BookCard } from '../components/BookCard.jsx'
import { EventDialog } from '../components/EventDialog.jsx'
import { BOOKS, POPULAR_IDS } from '../data/books.js'
import { EVENTS, imgSrc, PHONE_DISPLAY, PHONE_HREF, TEAM } from '../data/site.js'

export default function HomePage({ headingRef }) {
  const [activeEvent, setActiveEvent] = useState(null)
  const openerRef = useRef(null)

  const openEvent = (event, domEvent) => {
    openerRef.current = domEvent.currentTarget
    setActiveEvent(event)
  }
  const closeEvent = () => {
    setActiveEvent(null)
    openerRef.current?.focus()
  }

  const popular = POPULAR_IDS.map((id) => BOOKS.find((b) => b.id === id))

  return (
    <div className="with-aside">
      <div>
        <section className="hero" aria-labelledby="about-title">
          <img src={imgSrc('hero.jpg')} alt="" width="400" />
          <div>
            <h1 id="about-title" ref={headingRef} tabIndex={-1}>About Freedom Park Library</h1>
            <p>
              Freedom Park Library was founded on a simple belief: that every person deserves a place to learn, grow, and
              be uplifted. As a community library, we offer a welcoming, quiet, and encouraging environment where learners
              and adults alike can study, read, and pursue their goals. Our doors are open to the school learner working
              on homework, the job seeker building new skills, and the lifelong learner who simply wants to explore.
            </p>
            <p>
              We see the library as more than a collection of books. It is a shared space where knowledge is freely
              available, curiosity is nurtured, and people are supported to grow in every aspect of their lives. Together,
              we are building a community where learning is within everyone&apos;s reach.
            </p>
          </div>
        </section>

        <section aria-labelledby="popular-title">
          <h2 id="popular-title">Popular Offerings</h2>
          <ul className="card-grid">
            {popular.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="events-title">
          <h2 id="events-title">Event Registration</h2>
          <div className="card-grid">
            {EVENTS.map((event) => (
              <article className="card" key={event.id}>
                <h3>{event.title}</h3>
                <img className="natural" src={imgSrc(event.image)} alt={event.alt} width="400" />
                <p>
                  <button type="button" onClick={(e) => openEvent(event, e)}>
                    Register{' '}
                    <span className="visually-hidden">for {event.title}</span>
                  </button>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="team-title">
          <h2 id="team-title">Meet our team!</h2>
          <ul className="card-grid">
            {TEAM.map((person) => (
              <li className="card" key={person.id}>
                <figure>
                  <img className="avatar" src={imgSrc(person.image)} alt="" width="96" height="96" />
                  <figcaption>
                    {person.role}: {person.name}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside aria-labelledby="help-title">
        <h2 id="help-title">Need assistance?</h2>
        <p>
          Call us on <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> and a staff member can help you find a title, register for
          an event or reserve a room.
        </p>
        <p>
          <a href="#/booking">Reserve a room</a>
        </p>
      </aside>

      <EventDialog event={activeEvent} onClose={closeEvent} />
    </div>
  )
}