import { useEffect, useRef, useState } from 'react'
import { useAccessibleForm } from '../hooks/useAccessibleForm.js'
import { EVENT_LABELS, EVENT_ORDER, validateEventRegistration } from '../lib/validators.js'
import { Field } from './Field.jsx'

function EventRegistration({ event, headingRef, onClose }) {
  const [registeredName, setRegisteredName] = useState(null)
  const doneHeadingRef = useRef(null)

  const form = useAccessibleForm({
    idPrefix: 'event',
    initialValues: { name: '', email: '' },
    validate: validateEventRegistration,
    labels: EVENT_LABELS,
    order: EVENT_ORDER,
    onValid: (values) => setRegisteredName(values.name.trim()),
  })

  useEffect(() => {
    if (registeredName) doneHeadingRef.current?.focus()
  }, [registeredName])

  if (registeredName) {
    return (
      <div className="dialog-body">
        <h2 id="event-dialog-title" ref={doneHeadingRef} tabIndex={-1}>You are registered</h2>
        <p>
          Thank you, {registeredName}. You are registered for <strong>{event.title}</strong>. This is a prototype, so no
          confirmation email is sent.
        </p>
        <div className="actions">
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="dialog-body">
      <h2 id="event-dialog-title" ref={headingRef} tabIndex={-1}>Register for {event.title}</h2>
      <p>Fields marked (required) must be completed.</p>
      <form onSubmit={form.handleSubmit} noValidate>
        <Field {...form.getFieldProps('name')} label="Full name" required autoComplete="name" type="text" />
        <Field {...form.getFieldProps('email')} label="Email address" required autoComplete="email" type="email" />
        <div className="actions">
          <button type="submit">Register</button>
          <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export function EventDialog({ event, onClose }) {
  const dialogRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (event && !dialog.open) {
      dialog.showModal()
      headingRef.current?.focus()
    } else if (!event && dialog.open) {
      dialog.close()
    }
  }, [event])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="event-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      {event && <EventRegistration key={event.id} event={event} headingRef={headingRef} onClose={onClose} />}
    </dialog>
  )
}