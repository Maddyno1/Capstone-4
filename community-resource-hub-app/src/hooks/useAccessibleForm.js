import { useMemo, useRef, useState } from 'react'
import { useAnnounce } from './useAnnounce.js'

export function useAccessibleForm({ idPrefix, initialValues, validate, labels, order, onValid }) {
  const { announce } = useAnnounce()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  const fieldRefs = useRef({})
  const lastAnnounced = useRef({})

  const errors = useMemo(() => validate(values), [validate, values])
  const visibleErrors = useMemo(
    () => Object.fromEntries(Object.entries(errors).filter(([name]) => attempted || touched[name])),
    [errors, attempted, touched],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    if (visibleErrors[name] && !validate(next)[name]) {
      announce(`${labels[name]} corrected.`, 'polite')
      lastAnnounced.current[name] = ''
    }
    setValues(next)
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
    const message = errors[name]
    if (message && lastAnnounced.current[name] !== message) {
      lastAnnounced.current[name] = message
      announce(`${labels[name]}: ${message}`, 'polite')
    }
  }

  const focusField = (name) => fieldRefs.current[name]?.focus()

  const handleSubmit = (event) => {
    event.preventDefault()
    setAttempted(true)
    const invalid = order.filter((name) => errors[name])
    if (invalid.length > 0) {
      const noun = invalid.length === 1 ? 'problem' : 'problems'
      announce(`Form not sent. ${invalid.length} ${noun} to fix: ${invalid.map((n) => labels[n]).join(', ')}.`, 'assertive')
      focusField(invalid[0])
      return
    }
    onValid(values)
  }

  const getFieldProps = (name) => ({
    id: `${idPrefix}-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: visibleErrors[name],
    inputRef: (element) => {
      if (element) fieldRefs.current[name] = element
      else delete fieldRefs.current[name]
    },
  })

  const reset = () => {
    setValues(initialValues)
    setTouched({})
    setAttempted(false)
    lastAnnounced.current = {}
  }

  return { values, visibleErrors, attempted, getFieldProps, handleSubmit, focusField, reset }
}