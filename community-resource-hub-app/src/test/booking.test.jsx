import { fireEvent, screen, waitFor } from '@testing-library/react'
import { assertive, polite, renderRoute } from './helpers.jsx'

const fillValid = async (user) => {
  await user.selectOptions(screen.getByLabelText(/^Room \(required\)/), 'room-2')
  fireEvent.change(screen.getByLabelText(/^Date/), { target: { value: '2099-01-15' } })
  await user.type(screen.getByLabelText(/^Duration/), '60')
  await user.type(screen.getByLabelText(/^Full name/), 'Thabo Nkosi')
  await user.type(screen.getByLabelText(/^Email/), 'thabo@example.com')
  await user.type(screen.getByLabelText(/^Phone/), '0721234567')
}

describe('Room reservation form: labels and helper text', () => {
  it('gives every control an explicitly associated label and marks required fields', () => {
    renderRoute('#/booking')
    for (const label of [/^Room \(required\)/, /^Date/, /^Duration/, /^Full name/, /^Email/, /^Phone/]) {
      expect(screen.getByLabelText(label)).toBeRequired()
    }
    expect(screen.getByLabelText(/^Reason/)).not.toBeRequired()
  })

  it('links helper text with aria-describedby', () => {
    renderRoute('#/booking')
    expect(screen.getByLabelText(/^Duration/)).toHaveAccessibleDescription(/Choose 15 to 120/)
    expect(screen.getByLabelText(/^Phone/)).toHaveAccessibleDescription(/10 digits, no spaces/)
    expect(screen.getByLabelText(/^Reason/)).toHaveAccessibleDescription(/Up to 100 characters/)
  })

  it('shows no errors before the user interacts', () => {
    renderRoute('#/booking')
    expect(screen.getByLabelText(/^Phone/)).toHaveAttribute('aria-invalid', 'false')
    expect(screen.queryByText(/There (is|are)/)).not.toBeInTheDocument()
  })
})

describe('Room reservation form: live validation', () => {
  it('on blur, sets aria-invalid, links the error, and announces it politely', async () => {
    const { user } = renderRoute('#/booking')
    const phone = screen.getByLabelText(/^Phone/)
    await user.type(phone, '123')
    await user.tab()

    expect(phone).toHaveAttribute('aria-invalid', 'true')
    expect(phone).toHaveAccessibleDescription(/10-digit phone number/)
    expect(phone).toHaveAccessibleDescription(/10 digits, no spaces/)
    await waitFor(() => expect(polite(screen)).toHaveTextContent(/Phone number: Enter a 10-digit/))
  })

  it('clears aria-invalid and announces the correction once the value is fixed', async () => {
    const { user } = renderRoute('#/booking')
    const phone = screen.getByLabelText(/^Phone/)
    await user.type(phone, '123')
    await user.tab()
    await user.clear(phone)
    await user.type(phone, '0721234567')

    expect(phone).toHaveAttribute('aria-invalid', 'false')
    await waitFor(() => expect(polite(screen)).toHaveTextContent('Phone number corrected.'))
  })

  it('rejects a past date', async () => {
    const { user } = renderRoute('#/booking')
    const date = screen.getByLabelText(/^Date/)
    fireEvent.change(date, { target: { value: '2000-01-01' } })
    await user.click(date)
    await user.tab()
    expect(date).toHaveAttribute('aria-invalid', 'true')
    expect(date).toHaveAccessibleDescription(/Past dates cannot be booked/)
  })
})

describe('Room reservation form: submit', () => {
  it('on failure: announces assertively, focuses the first invalid field, shows a summary', async () => {
    const { user } = renderRoute('#/booking')
    await user.click(screen.getByRole('button', { name: 'Reserve room' }))

    await waitFor(() => expect(assertive(screen)).toHaveTextContent(/Form not sent\. 6 problems to fix: Room, Date, Duration, Full name, Email address, Phone number\./))
    expect(screen.getByLabelText(/^Room \(required\)/)).toHaveFocus()
    expect(screen.getByRole('heading', { name: 'There are 6 problems with this form' })).toBeInTheDocument()
  })

  it('error summary links move focus to the matching field', async () => {
    const { user } = renderRoute('#/booking')
    await user.click(screen.getByRole('button', { name: 'Reserve room' }))
    await user.click(screen.getByRole('link', { name: /^Phone number: Enter a 10-digit/ }))
    expect(screen.getByLabelText(/^Phone/)).toHaveFocus()
    expect(window.location.hash).toBe('#/booking')
  })

  it('on success: shows a confirmation and moves focus to its heading', async () => {
    const { user } = renderRoute('#/booking')
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Reserve room' }))

    const heading = await screen.findByRole('heading', { name: 'Room reserved' })
    expect(heading).toHaveFocus()
    expect(screen.getByText('Room 2')).toBeInTheDocument()
    expect(screen.getByText('60 minutes')).toBeInTheDocument()
  })

  it('"Make another reservation" returns to an empty form and focuses the page heading', async () => {
    const { user } = renderRoute('#/booking')
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Reserve room' }))
    await user.click(await screen.findByRole('button', { name: 'Make another reservation' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Room Reservation' })).toHaveFocus()
    expect(screen.getByLabelText(/^Full name/)).toHaveValue('')
  })
})