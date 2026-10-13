import { useEffect, useRef } from 'react'
import { AnnouncerProvider } from './components/AnnouncerProvider.jsx'
import { SiteFooter, SiteHeader, SiteNav } from './components/Chrome.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import BookingPage from './pages/BookingPage.jsx'
import CataloguePage from './pages/CataloguePage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const ROUTES = {
  '/': { title: 'Home', Page: HomePage },
  '/catalogue': { title: 'Catalogue', Page: CataloguePage },
  '/booking': { title: 'Room Reservation', Page: BookingPage },
}

export default function App() {
  const route = useHashRoute()
  const match = ROUTES[route]
  const title = match ? match.title : 'Page not found'
  const Page = match ? match.Page : NotFoundPage

  const mainRef = useRef(null)
  const headingRef = useRef(null)
  const lastTitle = useRef(title)

  useEffect(() => {
    document.title = `${title} — Freedom Park Library`
    if (lastTitle.current !== title) {
      lastTitle.current = title
      headingRef.current?.focus()
    }
  }, [title])

  const skipToMain = (event) => {
    event.preventDefault()
    mainRef.current?.focus()
  }

  return (
    <AnnouncerProvider>
      <a className="skip-link" href="#main" onClick={skipToMain}>
        Skip to main content
      </a>
      <SiteHeader />
      <SiteNav route={route} />
      <main id="main" tabIndex={-1} ref={mainRef}>
        <Page headingRef={headingRef} />
      </main>
      <SiteFooter />
    </AnnouncerProvider>
  )
}