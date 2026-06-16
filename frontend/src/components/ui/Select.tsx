import React, { useId } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export default function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  className = '',
  required,
  id: propId,
  ...rest
}: SelectProps) {
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

      {/* Wrapper for custom arrow */}
      <div style={{ position: 'relative' }}>
        <select
          id={id}
          className={`select${error ? ' error' : ''} ${className}`}
          style={{ paddingRight: 36 }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--gray-400)',
          }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
