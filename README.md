# Freedom Park Library: Community Resource Hub

Ticket **MD-2026-0143**, Marlowe Digital. An accessible prototype for the Freedom Park Library (Adaptive Learning & Resource Portal): catalogue search, room reservation and event registration, fully usable by keyboard and screen reader.

## Repository layout

| Path | Contents |
|---|---|
| `wireframes/` | Part A: semantic HTML/CSS wireframes, persona, WCAG matrix |
| `community-resource-hub-app/` | Part B: React 19 + Vite app, component tests, audit script |

## Run it

```bash
cd community-resource-hub-app
npm ci
npm run dev
npm test
npm run lint
npm run build && npm run audit
```
---

## Part C: Architectural and Accessibility Decisions

### 1. Accessibility trade-off analysis

**Custom validation over native constraint validation.** The forms use `noValidate` and my own rules. Native error bubbles differ between browsers, cannot be styled for contrast, and cannot say how to fix a problem. Owning the rules costs code, but every message now states the fault and the fix, is linked with `aria-describedby`, and is announced the same way everywhere. For similar reasons I kept native `<select>` and `<input type="date">` over custom widgets, accepting plainer visuals.

**Native `<dialog>` over a hand-built modal.** A custom focus trap needs a Tab-cycling key handler, an inert background and Escape handling, and each is a chance to create a keyboard trap. `showModal()` supplies all three. The cost: jsdom lacks it, so unit tests polyfill it and the real behaviour is verified in Chromium by the audit script. On open, focus goes to the heading rather than the first field, so the title is spoken before a form control.

**Live-region verbosity versus silence.** Field errors are polite, announced once per distinct message on blur. Only a blocked submit is assertive. Catalogue searches run on submit, not per keystroke. When focus moves to a new heading, no live message is added, because the focus move already speaks, and the error summary is deliberately not a live region. The price is a less "live" feel in exchange for no repeated speech.

### 2. Assistive tech state architecture

- **`aria-expanded` / `aria-pressed`:** `Disclosure` holds one `open` boolean that sets both `aria-expanded` and the panel's `hidden`. Category buttons read `aria-pressed` from the `selected` array.
- **`aria-invalid` / `aria-describedby`:** `useAccessibleForm` stores values, touched fields and a submit flag; errors are computed from values, never stored. `Field` turns a visible error into `aria-invalid` and adds its id to `aria-describedby` beside the hint.
- **`aria-live`:** `AnnouncerProvider` keeps two permanent regions (polite, assertive). `announce(message, priority)` clears then sets the text so repeats are re-announced.
- **`aria-busy`:** the results region uses `useTransition`'s `isPending`.
- **`focus()`:** refs and effects. `App` focuses the new `<h1>` on route change (a ref comparison stops first load stealing focus). `BookingPage` focuses its confirmation heading. `EventDialog` focuses its heading after `showModal()` and returns focus to the opener, held in a ref.

### 3. Verification and testing audit

**Automated.** Reproducible with npm test and npm run audit; full reports are in community-resource-hub-app/docs/ (a11y-audit-results.md and the lighthouse-*.report.html files).

| Tool | Scope | Result |
|---|---|---|
| Lighthouse 13.5.0, accessibility | Home, Catalogue, Booking (production build) | **100 / 100 / 100** |
| axe-core 4.14.0, Chromium 156.0.8078.4 | 10 views and states at 1280px and 320px, WCAG 2.0 to 2.2 A/AA plus best-practice | **0 violations** |
| Vitest + jest-axe | 65 tests, including error, open-filter and open-dialog states | all pass |
| Reflow | every state at 320px | no horizontal scroll |

**Keyboard tab sequence** (Playwright, 1280px): Home 13 stops, Catalogue 13, Booking 21 (the date field adds four). The skip link is first, order follows the DOM, every stop shows a focus ring, and nothing traps focus. In the dialog, Tab cannot reach the page behind, Escape closes it, and focus returns to the opener.

**Manual screen reader log.**

| # | Steps | Expected | NVDA + Firefox |
|---|---|---|---|
| 1 | Tab, Enter | "Skip to main content, link"; focus on main ||
| 2 | Activate "Catalogue" | "Library Catalogue, heading level 1" |  |
| 3 | Search "moscow", Enter | "1 title found for moscow." |  |
| 4 | Open filter; press "Fiction" | "expanded"; "Fiction, toggle button, pressed"; "2 titles found in Fiction." |  |
| 5 | Booking: Tab out of empty name | "Full name: Enter your full name." |  |
| 6 | Booking: submit empty | "Form not sent. 6 problems..."; focus on Room, "invalid entry" |  |
| 7 | Open event dialog; Escape | Title read; focus returns to the Register button |  |
