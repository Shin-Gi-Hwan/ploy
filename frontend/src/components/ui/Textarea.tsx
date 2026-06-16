import React, { useId } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export default function Textarea({ label, hint, error, className = '', required, id: propId, ...rest }: TextareaProps) {
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
      <textarea
        id={id}
        className={`textarea${error ? ' error' : ''} ${className}`}
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
