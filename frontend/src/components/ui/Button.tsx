import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  as: 'a'
}

type Props = ButtonProps | LinkButtonProps

export default function Button(props: Props) {
  if ('as' in props && props.as === 'a') {
    const { as: _as, variant = 'primary', size = 'md', loading, className = '', children, ...rest } = props
    const cls = `btn btn-${variant} btn-${size} ${className}`
    return (
      <a className={cls} {...rest}>
        {loading && <span className="btn-spinner" aria-hidden="true" />}
        {children}
      </a>
    )
  }

  const { variant = 'primary', size = 'md', loading, className = '', children, disabled, ...rest } = props as ButtonProps
  const cls = `btn btn-${variant} btn-${size} ${className}`

  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}
