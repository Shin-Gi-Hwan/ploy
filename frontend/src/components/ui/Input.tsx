import React, { useId } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export default function Input({ label, hint, error, className = '', required, id: propId, ...rest }: InputProps) {
  const genId = useId()
  const id = propId ?? genId

  return (
    <div className="field">
      {label && (
        <label
          htmlFor={id}
          className={`field-label${required ? ' field-label-required' : ''}`}
        >
          {label}
        </label>
      )}
      {hint && <p className="field-hint">{hint}</p>}
      <input
        id={id}
        className={`input${error ? ' error' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
