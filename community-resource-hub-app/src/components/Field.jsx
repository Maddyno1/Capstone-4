export function Field({ id, name, label, hint, error, required, as: Control = 'input', inputRef, children, ...rest }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? ' (required)' : ''}
      </label>
      {hint && (
        <p className="hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="error-message" id={errorId}>
          <span className="visually-hidden">Error: </span>
          {error}
        </p>
      )}
      <Control
        id={id}
        name={name}
        ref={inputRef}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      >
        {children}
      </Control>
    </div>
  )
}