export function ErrorSummary({ idPrefix, errors, order, labels, onSelect }) {
  const names = order.filter((name) => errors[name])
  if (names.length === 0) return null
  const titleId = `${idPrefix}-summary-title`

  return (
    <div className="error-summary" role="group" aria-labelledby={titleId}>
      <h2 id={titleId}>{names.length === 1 ? 'There is 1 problem' : `There are ${names.length} problems`} with this form</h2>
      <ul>
        {names.map((name) => (
          <li key={name}>
            <a
              href={`#${idPrefix}-${name}`}
              onClick={(event) => {
                event.preventDefault()
                onSelect(name)
              }}
            >
              {labels[name]}: {errors[name]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}