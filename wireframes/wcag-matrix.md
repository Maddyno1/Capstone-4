# WCAG 2.1 AA Mapping Matrix: Freedom Park Library Portal

Ticket MD-2026-0143 | Part A wireframes (`landing.html`, `listing.html`, `booking.html`, `main.css`)

| # | Criterion (ID & Name) | Target component | Technical implementation | Verification strategy |
|---|---|---|---|---|
| 1 | **1.1.1 Non-text Content** (A) | Book covers, event images, team photos, header logo, search icon | Informative images get concise, specific `alt` text. Where a `<figcaption>` or heading already names the subject (book covers, team portraits, category illustrations), the image uses `alt=""` so it is not announced twice. The search button has visible text "Search" and no icon. | axe `image-alt` and `button-name` rules; NVDA browse mode (G key) to hear each graphic; confirm no empty button is announced. |
| 2 | **1.3.1 Info and Relationships** (A) | Landmarks, heading outline, booking form | `<header>`, `<nav aria-label="Main">`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`. One `<h1>` per page. Booking form uses `<fieldset>`/`<legend>` groups and `<label for>` on every control. | NVDA landmarks list (D) and headings list (H); W3C Nu HTML validator; axe `landmark-*`, `heading-order`, `label`. |
| 3 | **1.3.5 Identify Input Purpose** (AA) | Booking form: name, email, phone | `autocomplete="name"`, `autocomplete="email"`, `autocomplete="tel"`. | Inspect markup; browser autofill fills the three fields; axe `autocomplete-valid`. |
| 4 | **1.4.1 Use of Color** (A) | Links, current nav item, error state | Links are always underlined. Current page uses `aria-current="page"` plus bold and thicker underline. Error styling pairs red with a thicker border and a text message. | Greyscale/forced-colours emulation in DevTools; confirm every state is still distinguishable. |
| 5 | **1.4.3 Contrast (Minimum)** (AA) | All text | Palette chosen so every pairing is at least 5.4:1 for body text; ratios logged in the `main.css` header. Placeholder text also passes. | WebAIM Contrast Checker for each logged pairing; Lighthouse and axe `color-contrast`. |
| 6 | **1.4.10 Reflow** (AA) | Whole layout, card grid, form | Fluid CSS grid with `repeat(auto-fit, minmax(min(100%, 14rem), 1fr))`, `max-width: 100%` on images, correct viewport meta tag, aside stacks below 48rem. | Resize to 320 CSS px wide (or 400% zoom at 1280px) and confirm no horizontal scroll and no clipped content. |
