import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { preview } from 'vite'

const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const axeVersion = JSON.parse(readFileSync(new URL('../node_modules/axe-core/package.json', import.meta.url), 'utf8')).version

const PORT = 4173
const BASE = `http://localhost:${PORT}/`
const server = await preview({ preview: { port: PORT, strictPort: true, open: false } })
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})

const lines = []
let failures = 0
const log = (text = '') => { lines.push(text); console.log(text) }
const check = (ok, text) => { if (!ok) failures += 1; log(`${ok ? 'PASS' : 'FAIL'}  ${text}`) }

async function open(page, hash) {
  await page.goto(BASE + hash)
  await page.waitForSelector('main h1, main h2')
}

const VALID = { room: 'room-2', date: '2099-01-15', duration: '60', name: 'Thabo Nkosi', email: 'thabo@example.com', phone: '0721234567' }

const scenarios = [
  ['Home', '#/', async () => {}],
  ['Home, event dialog open', '#/', async (p) => { await p.getByRole('button', { name: 'Register for Science model building competition' }).click() }],
  ['Home, event dialog with errors', '#/', async (p) => {
    await p.getByRole('button', { name: 'Register for Science model building competition' }).click()
    await p.getByRole('button', { name: 'Register', exact: true }).click()
  }],
  ['Catalogue', '#/catalogue', async () => {}],
  ['Catalogue, filter open + Fiction pressed', '#/catalogue', async (p) => {
    await p.getByRole('button', { name: /Filter by category/ }).click()
    await p.getByRole('button', { name: 'Fiction' }).click()
  }],
  ['Catalogue, no results', '#/catalogue', async (p) => { await p.getByRole('searchbox').fill('zzzz'); await p.keyboard.press('Enter') }],
  ['Booking', '#/booking', async () => {}],
  ['Booking, all errors showing', '#/booking', async (p) => { await p.getByRole('button', { name: 'Reserve room' }).click() }],
  ['Booking, confirmation', '#/booking', async (p) => {
    await p.getByLabel(/^Room \(required\)/).selectOption(VALID.room)
    await p.getByLabel(/^Date/).fill(VALID.date)
    await p.getByLabel(/^Duration/).fill(VALID.duration)
    await p.getByLabel(/^Full name/).fill(VALID.name)
    await p.getByLabel(/^Email/).fill(VALID.email)
    await p.getByLabel(/^Phone/).fill(VALID.phone)
    await p.getByRole('button', { name: 'Reserve room' }).click()
    await p.getByRole('heading', { name: 'Room reserved' }).waitFor()
  }],
  ['Not found', '#/missing', async () => {}],
]

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

log(`# Accessibility audit (axe-core ${axeVersion}, Chromium ${browser.version()})`)
log(`Run: ${new Date().toISOString().slice(0, 10)}`)
log()
log('## 1 and 2. axe-core and reflow')
log()
log('| State | Width | Violations | Needs review | Horizontal scroll |')
log('|---|---|---|---|---|')

for (const [width, height] of [[1280, 900], [320, 640]]) {
  for (const [name, hash, setup] of scenarios) {
    const page = await browser.newPage({ viewport: { width, height } })
    await open(page, hash)
    await setup(page)
    await page.waitForTimeout(150)
    await page.addScriptTag({ content: axeSource })
    const result = await page.evaluate((tags) => axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    const bad = result.violations.length > 0 || overflow > 0
    if (bad) failures += 1
    log(`| ${name} | ${width}px | ${result.violations.length} | ${result.incomplete.length} | ${overflow > 0 ? `${overflow}px` : 'none'} |`)
    for (const v of result.violations) log(`|  ↳ ${v.id} (${v.impact}) | | ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join('; ')} | | |`)
    for (const v of result.incomplete) log(`|  ↳ review: ${v.id} | | ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join('; ')} | | |`)
    await page.close()
  }
}

log()
log('Notes on "needs review" (axe could not decide automatically; checked by hand):')
log('- `.chevron`, `.tick`: symbol-only glyphs, which axe cannot measure. Both are decorative (`aria-hidden`); the state is also exposed by `aria-expanded` / `aria-pressed`. Tick #2B6CB0 on #EBF4FF = 4.88:1; chevron uses body text #1A202C on #F7FAFC = 15.3:1.')
log('- Dialog title, label and error: axe reports the text as "partially obscured" because of the modal backdrop. Actual colours: #1A202C on #FFFFFF = 16.32:1 (title, label); #C53030 on #FFFFFF = 5.47:1 (error text).')

log()
log('## 3. Keyboard: Tab sequence and focus visibility (1280px)')
log()

const describeFocus = () => {
  const el = document.activeElement
  if (!el || el === document.body) return null
  const cs = getComputedStyle(el)
  const name = (el.getAttribute('aria-label') || el.innerText || el.querySelector('img')?.alt || el.getAttribute('alt') || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40)
  const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 && cs.outlineColor !== 'rgba(0, 0, 0, 0)'
  const shadow = cs.boxShadow !== 'none'
  return { tag: el.tagName.toLowerCase(), name, visible: ring || shadow, rect: el.getBoundingClientRect().toJSON() }
}

for (const [label, hash] of [['Home', '#/'], ['Catalogue', '#/catalogue'], ['Booking', '#/booking']]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await open(page, hash)
  const stops = []
  const hidden = []
  for (let i = 0; i < 80; i += 1) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(describeFocus)
    if (!info) break
    stops.push(`${info.tag}:${info.name}`)
    if (!info.visible) hidden.push(`${info.tag}:${info.name}`)
  }
  log(`**${label}**: ${stops.length} tab stops`)
  log(`  ${stops.join(' → ')}`)
  check(hidden.length === 0, `${label}: every tab stop shows a visible focus indicator${hidden.length ? ` (missing on: ${hidden.join(', ')})` : ''}`)
  await page.close()
}

{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await open(page, '#/')
  await page.keyboard.press('Tab')
  const skip = await page.evaluate(() => ({ text: document.activeElement.textContent, top: document.activeElement.getBoundingClientRect().top }))
  check(skip.text === 'Skip to main content' && skip.top >= 0, 'Skip link is the first Tab stop and is visible on focus')
  await page.keyboard.press('Enter')
  check(await page.evaluate(() => document.activeElement.id === 'main'), 'Skip link moves focus to <main>')

  await open(page, '#/')
  await page.getByRole('link', { name: 'Catalogue' }).click()
  await page.waitForTimeout(100)
  check(await page.evaluate(() => document.activeElement.tagName === 'H1' && document.activeElement.textContent === 'Library Catalogue'), 'View switch moves focus to the new page heading')
  check((await page.title()) === 'Catalogue — Freedom Park Library', 'View switch updates the document title')
  await page.close()
}

log()
log('## 4. Modal dialog (real browser)')
log()
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await open(page, '#/')
  const opener = page.getByRole('button', { name: 'Register for Science model building competition' })
  await opener.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(100)

  check(await page.evaluate(() => !!document.querySelector('dialog[open]')), 'Enter on the Register button opens the dialog')
  check(await page.evaluate(() => document.activeElement.tagName === 'H2' && !!document.activeElement.closest('dialog')), 'Focus moves to the dialog heading')

  let escaped = false
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('dialog'))
    if (!inside) escaped = true
  }
  check(!escaped, 'Tab cannot reach the page behind the modal (12 presses)')

  await page.keyboard.press('Escape')
  await page.waitForTimeout(100)
  check(await page.evaluate(() => !document.querySelector('dialog[open]')), 'Escape closes the dialog (no keyboard trap)')
  check(await page.evaluate(() => document.activeElement.textContent.startsWith('Register') && document.activeElement.textContent.includes('Science')), 'Focus returns to the button that opened the dialog')
  await page.close()
}

log()
log(failures === 0 ? '**All checks passed.**' : `**${failures} check(s) failed.**`)

writeFileSync(new URL('../docs/a11y-audit-results.md', import.meta.url), lines.join('\n') + '\n')
await browser.close()
await new Promise((resolve) => server.httpServer.close(resolve))
process.exit(failures === 0 ? 0 : 1)
