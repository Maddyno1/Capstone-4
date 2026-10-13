import { imgSrc, PHONE_DISPLAY, PHONE_HREF } from '../data/site.js'

export function SiteHeader() {
  return (
    <header>
      <a href="#/">
        <img src={imgSrc('logo.png')} alt="Freedom Park Library, home" width="300" />
      </a>
    </header>
  )
}

const LINKS = [
  { path: '/', label: 'Home' },
  { path: '/catalogue', label: 'Catalogue' },
  { path: '/booking', label: 'Room Reservation' },
]

export function SiteNav({ route }) {
  return (
    <nav aria-label="Main">
      <ul>
        {LINKS.map((link) => (
          <li key={link.path}>
            <a href={`#${link.path}`} aria-current={route === link.path ? 'page' : undefined}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer>
      <div>
        <img src={imgSrc('logo.png')} alt="" width="200" />
      </div>
      <div className="copyright">
        <p>&copy; 2026 Freedom Park Municipality. All rights reserved.</p>
      </div>
      <div>
        <a href="mailto:info@freedompark.example">Email</a>
        <a href="https://www.facebook.com/" rel="noopener">Facebook</a>
        <a href="https://www.instagram.com/" rel="noopener">Instagram</a>
        <p>
          Phone: <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        </p>
      </div>
    </footer>
  )
}