export default function NotFoundPage({ headingRef }) {
  return (
    <section aria-labelledby="notfound-title">
      <h1 id="notfound-title" ref={headingRef} tabIndex={-1}>Page not found</h1>
      <p>
        We could not find that page. Go to the <a href="#/">home page</a>, the <a href="#/catalogue">catalogue</a> or{' '}
        <a href="#/booking">room reservation</a>.
      </p>
    </section>
  )
}