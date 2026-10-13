import { useId, useState } from 'react'

export function Disclosure({ title, headingLevel: Heading = 'h3', defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const baseId = useId()
  const buttonId = `${baseId}-button`
  const panelId = `${baseId}-panel`

  return (
    <div className="disclosure">
      <Heading className="disclosure-heading">
        <button
          type="button"
          id={buttonId}
          className="disclosure-button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="chevron" aria-hidden="true">
            {open ? '▾' : '▸'}
          </span>
          {title}
        </button>
      </Heading>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="disclosure-panel">
        {children}
      </div>
    </div>
  )
}