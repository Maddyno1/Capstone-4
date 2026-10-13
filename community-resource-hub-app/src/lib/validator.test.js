import { validateEventRegistration, validateReservation } from './validators.js'

const valid = {
  room: 'room-1', reason: '', date: '2030-01-15', duration: '60',
  name: 'Thabo Nkosi', email: 'thabo@example.com', phone: '0721234567',
}
const TODAY = '2026-10-12'

describe('validateReservation', () => {
  it('accepts a complete, valid reservation', () => {
    expect(validateReservation(valid, TODAY)).toEqual({})
  })

  it('requires the mandatory fields but not the reason', () => {
    const errors = validateReservation({ ...valid, room: '', date: '', duration: '', name: '', email: '', phone: '' }, TODAY)
    expect(Object.keys(errors).sort()).toEqual(['date', 'duration', 'email', 'name', 'phone', 'room'])
  })

  it('rejects past dates but allows today', () => {
    expect(validateReservation({ ...valid, date: '2026-10-11' }, TODAY).date).toMatch(/future date/)
    expect(validateReservation({ ...valid, date: TODAY }, TODAY).date).toBeUndefined()
  })

  it.each(['10', '135', '20', '7.5', 'abc'])('rejects duration %s', (duration) => {
    expect(validateReservation({ ...valid, duration }, TODAY).duration).toBeDefined()
  })

  it.each(['15', '60', '120'])('accepts duration %s', (duration) => {
    expect(validateReservation({ ...valid, duration }, TODAY).duration).toBeUndefined()
  })

  it.each(['072123456', '07212345678', '072 123 4567', 'abcdefghij'])('rejects phone %s', (phone) => {
    expect(validateReservation({ ...valid, phone }, TODAY).phone).toMatch(/10-digit/)
  })

  it('rejects malformed email and over-long reasons', () => {
    expect(validateReservation({ ...valid, email: 'not-an-email' }, TODAY).email).toBeDefined()
    expect(validateReservation({ ...valid, reason: 'x'.repeat(101) }, TODAY).reason).toBeDefined()
  })
})

describe('validateEventRegistration', () => {
  it('validates name and email', () => {
    expect(validateEventRegistration({ name: 'Ann', email: 'ann@example.com' })).toEqual({})
    expect(Object.keys(validateEventRegistration({ name: '', email: 'x' }))).toEqual(['name', 'email'])
  })
})