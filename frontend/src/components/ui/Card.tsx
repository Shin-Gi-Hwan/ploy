import React from 'react'

interface CardProps {
  children: React.ReactNode
  hoverable?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export default function Card({ children, hoverable = false, className = '', style, onClick }: CardProps) {
  return (
    <div
      className={`card${hoverable ? ' card-hover' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
