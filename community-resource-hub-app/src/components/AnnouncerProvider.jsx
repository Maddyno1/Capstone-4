import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnnouncerContext } from '../hooks/useAnnounce.js'

const CLEAR_AFTER_MS = 6000

export function AnnouncerProvider({ children }) {
  const [polite, setPolite] = useState('')
  const [assertive, setAssertive] = useState('')
  const timers = useRef({})

  const announce = useCallback((message, priority = 'polite') => {
    const setText = priority === 'assertive' ? setAssertive : setPolite
    clearTimeout(timers.current[priority])
    setText('')
    timers.current[priority] = setTimeout(() => {
      setText(message)
      timers.current[priority] = setTimeout(() => setText(''), CLEAR_AFTER_MS)
    }, 60)
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => Object.values(pending).forEach(clearTimeout)
  }, [])

  const value = useMemo(() => ({ announce }), [announce])

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true" data-testid="live-polite">
        {polite}
      </div>
      <div className="visually-hidden" role="alert" aria-live="assertive" aria-atomic="true" data-testid="live-assertive">
        {assertive}
      </div>
    </AnnouncerContext.Provider>
  )
}
