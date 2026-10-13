import { useEffect, useRef, useState } from 'react'
import { ErrorSummary } from '../components/ErrorSummary.jsx'
import { Field } from '../components/Field.jsx'
import { PHONE_DISPLAY, PHONE_HREF, ROOMS } from '../data/site.js'
import { useAccessibleForm } from '../hooks/useAccessibleForm.js'
import { RESERVATION_LABELS, RESERVATION_ORDER, todayISO, validateReservation } from '../lib/validators.js'

const INITIAL = { room: '', reason: '', date: '', duration: '', name: '', email: '', phone: '' }

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export default function BookingPage({ headingRef }) {
  const [confirmation, setConfirmation] = useState(null)
  const confirmRef = useRef(null)

  const form = useAccessibleForm({
    idPrefix: 'booking',
    initialValues: INITIAL,
    validate: validateReservation,
    labels: RESERVATION_LABELS,
    order: RESERVATION_ORDER,
    onValid: setConfirmation,
  })

  useEffect(() => {
    if (confirmation) confirmRef.current?.focus()
  }, [confirmation])

  const bookAnother = () => {
    form.reset()
    setConfirmation(null)
    headingRef.current?.focus()
  }

  const roomLabel = (value) => ROOMS.find((r) => r.value === value)?.label ?? value

  return (
    <div className="with-aside">
      <section aria-labelledby="page-title">
        <h1 id="page-title" ref={headingRef} tabIndex={-1}>Room Reservation</h1>

        {confirmation ? (
          <div className="confirmation">
            <h2 ref={confirmRef} tabIndex={-1}>Room reserved</h2>
            <dl>
              <dt>Room</dt>
              <dd>{roomLabel(confirmation.room)}</dd>
              <dt>Date</dt>
              <dd>{formatDate(confirmation.date)}</dd>
              <dt>Duration</dt>
              <dd>{confirmation.duration} minutes</dd>
              <dt>Name</dt>
              <dd>{confirmation.name.trim()}</dd>
            </dl>
            <p>This is a prototype, so no confirmation email is sent.</p>
            <button type="button" onClick={bookAnother}>Make another reservation</button>
          </div>
        ) : (
          <>
            <p>Fields marked (required) must be completed before you reserve.</p>

            <ErrorSummary
              idPrefix="booking"
              errors={form.attempted ? form.visibleErrors : {}}
              order={RESERVATION_ORDER}
              labels={RESERVATION_LABELS}
              onSelect={form.focusField}
            />

            <form onSubmit={form.handleSubmit} noValidate>
              <fieldset>
                <legend>Booking details</legend>

                <Field {...form.getFieldProps('room')} as="select" label="Room" required>
                  <option value="">Choose a room</option>
                  {ROOMS.map((room) => (
                    <option key={room.value} value={room.value}>{room.label}</option>
                  ))}
                </Field>

                <Field
                  {...form.getFieldProps('reason')}
                  as="textarea"
                  label="Reason for Reservation"
                  hint="Optional. Up to 100 characters."
                  rows={4}
                  maxLength={100}
                />

                <Field {...form.getFieldProps('date')} type="date" label="Date" required min={todayISO()} />

                <Field
                  {...form.getFieldProps('duration')}
                  type="number"
                  label="Duration in minutes"
                  hint="Choose 15 to 120, in steps of 15."
                  required
                  min={15}
                  max={120}
                  step={15}
                  inputMode="numeric"
                />
              </fieldset>

              <fieldset>
                <legend>Your details</legend>

                <Field {...form.getFieldProps('name')} type="text" label="Full name" required autoComplete="name" />
                <Field {...form.getFieldProps('email')} type="email" label="Email address" required autoComplete="email" />
                <Field
                  {...form.getFieldProps('phone')}
                  type="tel"
                  label="Phone Number"
                  hint="10 digits, no spaces. For example: 0721234567"
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </fieldset>

              <button type="submit">Reserve room</button>
            </form>
          </>
        )}
      </section>

      <aside aria-labelledby="help-title">
        <h2 id="help-title">Need help booking?</h2>
        <p>
          Call the library on <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> and a staff member can reserve a room for you.
        </p>
      </aside>
    </div>
  )
}