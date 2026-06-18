import React, { useId } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  /**
   * 'default' — light theme (existing behaviour, used in Intake, Admin, etc.)
   * 'glass'   — dark glass theme for auth pages (Login, Register)
   */
  variant?: 'default' | 'glass'
  /** Icon rendered inside the left edge of the input */
  leftIcon?: React.ReactNode
}

export default function Input({
  label,
  hint,
  error,
  variant = 'default',
  leftIcon,
  className = '',
  required,
  id: propId,
  ...rest
}: InputProps) {
  const genId = useId()
  const id = propId ?? genId

  const isGlass = variant === 'glass'

  return (
    <div className={isGlass ? 'field-glass' : 'field'}>
      {label && (
        <label
          htmlFor={id}
          className={
            isGlass
              ? 'field-label-glass'
              : `field-label${required ? ' field-label-required' : ''}`
          }
        >
          {label}
        </label>
      )}
      {hint && <p className={isGlass ? 'field-hint-glass' : 'field-hint'}>{hint}</p>}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`${isGlass ? 'input-glass' : 'input'}${error ? ' error' : ''} ${className}`}
          style={leftIcon ? { paddingLeft: '40px' } : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className={isGlass ? 'field-error-glass' : 'field-error'} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
