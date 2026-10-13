export const todayISO = (now = new Date()) => {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const RESERVATION_LABELS = {
  room: 'Room',
  reason: 'Reason for reservation',
  date: 'Date',
  duration: 'Duration',
  name: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
}
export const RESERVATION_ORDER = ['room', 'reason', 'date', 'duration', 'name', 'email', 'phone']

export function validateReservation(values, today = todayISO()) {
  const errors = {}

  if (!values.room) errors.room = 'Choose a room from the list.'

  if (values.reason.length > 100) errors.reason = 'Shorten your reason to 100 characters or fewer.'

  if (!values.date) errors.date = 'Enter the date you want the room, for example 2026-11-05.'
  else if (values.date < today) errors.date = 'Choose today or a future date. Past dates cannot be booked.'

  const minutes = Number(values.duration)
  if (values.duration === '') errors.duration = 'Enter a duration from 15 to 120 minutes, in steps of 15.'
  else if (!Number.isInteger(minutes) || minutes < 15 || minutes > 120 || minutes % 15 !== 0)
    errors.duration = 'Enter 15, 30, 45, 60, 75, 90, 105 or 120 minutes.'

  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'

  if (values.email.trim() === '') errors.email = 'Enter your email address, for example name@example.com.'
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = 'Enter an email address in the format name@example.com.'

  if (!/^[0-9]{10}$/.test(values.phone.trim()))
    errors.phone = 'Enter a 10-digit phone number with no spaces, for example 0721234567.'

  return errors
}

export const EVENT_LABELS = { name: 'Full name', email: 'Email address' }
export const EVENT_ORDER = ['name', 'email']

export function validateEventRegistration(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (values.email.trim() === '') errors.email = 'Enter your email address, for example name@example.com.'
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = 'Enter an email address in the format name@example.com.'
  return errors
}