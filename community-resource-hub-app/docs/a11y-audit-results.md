# Accessibility audit (axe-core 4.14.0, Chromium 156.0.8078.4)
Run: 2026-10-13

## 1 and 2. axe-core and reflow

| State | Width | Violations | Needs review | Horizontal scroll |
|---|---|---|---|---|
| Home | 1280px | 0 | 0 | none |
| Home, event dialog open | 1280px | 0 | 1 | none |
|  ↳ review: color-contrast | | #event-dialog-title; label[for="event-name"] | | |
| Home, event dialog with errors | 1280px | 0 | 1 | none |
|  ↳ review: color-contrast | | #event-dialog-title; label[for="event-name"] | | |
| Catalogue | 1280px | 0 | 1 | none |
|  ↳ review: color-contrast | | .chevron | | |
| Catalogue, filter open + Fiction pressed | 1280px | 0 | 1 | none |
|  ↳ review: color-contrast | | .chevron; .tick | | |
| Catalogue, no results | 1280px | 0 | 1 | none |
|  ↳ review: color-contrast | | .chevron | | |
| Booking | 1280px | 0 | 0 | none |
| Booking, all errors showing | 1280px | 0 | 0 | none |
| Booking, confirmation | 1280px | 0 | 0 | none |
| Not found | 1280px | 0 | 0 | none |
| Home | 320px | 0 | 0 | none |
| Home, event dialog open | 320px | 0 | 1 | none |
|  ↳ review: color-contrast | | #event-dialog-title; label[for="event-name"] | | |
| Home, event dialog with errors | 320px | 0 | 1 | none |
|  ↳ review: color-contrast | | #event-dialog-title | | |
| Catalogue | 320px | 0 | 1 | none |
|  ↳ review: color-contrast | | .chevron | | |
| Catalogue, filter open + Fiction pressed | 320px | 0 | 1 | none |
|  ↳ review: color-contrast | | .chevron; .tick | | |
| Catalogue, no results | 320px | 0 | 1 | none |
|  ↳ review: color-contrast | | .chevron | | |
| Booking | 320px | 0 | 0 | none |
| Booking, all errors showing | 320px | 0 | 0 | none |
| Booking, confirmation | 320px | 0 | 0 | none |
| Not found | 320px | 0 | 0 | none |

Notes on "needs review" (axe could not decide automatically; checked by hand):
- `.chevron`, `.tick`: symbol-only glyphs, which axe cannot measure. Both are decorative (`aria-hidden`); the state is also exposed by `aria-expanded` / `aria-pressed`. Tick #2B6CB0 on #EBF4FF = 4.88:1; chevron uses body text #1A202C on #F7FAFC = 15.3:1.
- Dialog title, label and error: axe reports the text as "partially obscured" because of the modal backdrop. Actual colours: #1A202C on #FFFFFF = 16.32:1 (title, label); #C53030 on #FFFFFF = 5.47:1 (error text).

## 3. Keyboard: Tab sequence and focus visibility (1280px)

**Home**: 13 tab stops
  a:Skip to main content → a:Freedom Park Library, home → a:Home → a:Catalogue → a:Room Reservation → button:Register for Science model building comp → button:Register for Sharon's book launch and lo → a:011 365 5764 → a:Reserve a room → a:Email → a:Facebook → a:Instagram → a:011 365 5764
PASS  Home: every tab stop shows a visible focus indicator
**Catalogue**: 13 tab stops
  a:Skip to main content → a:Freedom Park Library, home → a:Home → a:Catalogue → a:Room Reservation → input:_r_0_ → button:Search → button:▸ Filter by category → a:011 365 5764 → a:Email → a:Facebook → a:Instagram → a:011 365 5764
PASS  Catalogue: every tab stop shows a visible focus indicator
**Booking**: 21 tab stops
  a:Skip to main content → a:Freedom Park Library, home → a:Home → a:Catalogue → a:Room Reservation → select:Choose a room Room 1 Room 2 Room 3 → textarea:booking-reason → input:booking-date → input:booking-date → input:booking-date → input:booking-date → input:booking-duration → input:booking-name → input:booking-email → input:booking-phone → button:Reserve room → a:011 365 5764 → a:Email → a:Facebook → a:Instagram → a:011 365 5764
PASS  Booking: every tab stop shows a visible focus indicator
PASS  Skip link is the first Tab stop and is visible on focus
PASS  Skip link moves focus to <main>
PASS  View switch moves focus to the new page heading
PASS  View switch updates the document title

## 4. Modal dialog (real browser)

PASS  Enter on the Register button opens the dialog
PASS  Focus moves to the dialog heading
PASS  Tab cannot reach the page behind the modal (12 presses)
PASS  Escape closes the dialog (no keyboard trap)
PASS  Focus returns to the button that opened the dialog

**All checks passed.**
